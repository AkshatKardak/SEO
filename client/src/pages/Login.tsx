import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, User2Icon, ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { SignIn, SignUp } from "@clerk/clerk-react";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export default function Login({ state }: { state: string }) {
    const [isLoginState, setIsLoginState] = useState(state === "login");
    const [useCustomForm, setUseCustomForm] = useState(!hasClerk);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Immediate redirect to Dashboard if already authenticated
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let data;
            if (isLoginState) {
                data = await authAPI.login({ email, password });
            } else {
                data = await authAPI.register({ name, email, password });
            }

            if (data.token) {
                await login(data.token);
                navigate("/dashboard", { replace: true });
            } else {
                setError(data.message || "Authentication failed. Check credentials.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col justify-center items-center px-4 py-12 select-none relative">
            <div className="w-full max-w-md mx-auto space-y-6">
                {/* ── Top Instrument Header ── */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface-muted text-[11px] font-mono text-text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
                        <span>SERPO ENGINE · AUTH GATEWAY</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight">
                        {isLoginState ? "Authenticate to Console" : "Initialize Workspace"}
                    </h1>

                    <p className="text-xs text-text-secondary font-sans max-w-sm mx-auto">
                        {isLoginState
                            ? "Access continuous search telemetry, ICE opportunity backlog, and automated git patches."
                            : "Deploy SerpoAI on your domains or staging repositories to capture organic search intent."}
                    </p>
                </div>

                {/* ── Segmented Controller (Clerk vs Direct Form) ── */}
                {hasClerk && (
                    <div className="p-1 rounded bg-surface-muted border border-border flex items-center gap-1 text-xs">
                        <button
                            type="button"
                            onClick={() => { setUseCustomForm(false); setError(""); }}
                            className={`flex-1 py-1.5 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1.5 ${
                                !useCustomForm
                                    ? "bg-surface text-text-primary border border-border shadow-xs"
                                    : "text-text-muted hover:text-text-primary"
                            }`}
                        >
                            <ShieldCheck size={14} className="text-accent" />
                            <span>Clerk OAuth</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUseCustomForm(true); setError(""); }}
                            className={`flex-1 py-1.5 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1.5 ${
                                useCustomForm
                                    ? "bg-surface text-text-primary border border-border shadow-xs"
                                    : "text-text-muted hover:text-text-primary"
                            }`}
                        >
                            <Mail size={14} />
                            <span>Email / Key</span>
                        </button>
                    </div>
                )}

                {/* ── Clerk Container ── */}
                {hasClerk && !useCustomForm ? (
                    <div className="w-full flex justify-center py-2">
                        {isLoginState ? (
                            <SignIn
                                routing="hash"
                                forceRedirectUrl="/dashboard"
                                signUpUrl="#/register"
                            />
                        ) : (
                            <SignUp
                                routing="hash"
                                forceRedirectUrl="/dashboard"
                                signInUrl="#/login"
                            />
                        )}
                    </div>
                ) : (
                    /* ── Direct Form Instrument Card ── */
                    <div className="surface-instrument p-6 space-y-4 border border-border bg-surface rounded-md shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                            {error && (
                                <div className="p-2.5 rounded bg-negative/10 border border-negative/30 text-negative font-mono text-[11px]">
                                    {error}
                                </div>
                            )}

                            {!isLoginState && (
                                <label className="block space-y-1">
                                    <span className="font-mono text-[11px] text-text-secondary uppercase">Operator Name</span>
                                    <div className="relative">
                                        <User2Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alex Chen"
                                            className="w-full pl-9 pr-3 py-2 rounded bg-surface-muted border border-border text-text-primary placeholder:text-text-muted font-sans text-xs focus:outline-none focus:border-accent transition-colors"
                                        />
                                    </div>
                                </label>
                            )}

                            <label className="block space-y-1">
                                <span className="font-mono text-[11px] text-text-secondary uppercase">Corporate Email</span>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operator@company.com"
                                        className="w-full pl-9 pr-3 py-2 rounded bg-surface-muted border border-border text-text-primary placeholder:text-text-muted font-sans text-xs focus:outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] text-text-secondary uppercase">Access Key / Password</span>
                                </div>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full pl-9 pr-9 py-2 rounded bg-surface-muted border border-border text-text-primary placeholder:text-text-muted font-sans text-xs focus:outline-none focus:border-accent transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-2.5 mt-2 gap-2 text-xs font-semibold"
                            >
                                {loading ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>{isLoginState ? "Authenticate" : "Create Console Account"}</span>
                                        <ArrowRight size={13} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-3 text-center border-t border-border">
                            <p className="text-xs text-text-muted">
                                {isLoginState ? "Need new workspace credentials?" : "Already registered?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => { setIsLoginState(!isLoginState); setError(""); }}
                                    className="text-text-primary hover:underline font-medium ml-1"
                                >
                                    {isLoginState ? "Create an account" : "Sign in here"}
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Footer Link ── */}
                <div className="text-center pt-2">
                    <Link
                        to="/"
                        className="font-mono text-[11px] text-text-muted hover:text-text-primary transition-colors"
                    >
                        ← RETURN TO SERPOAI TERMINAL
                    </Link>
                </div>
            </div>
        </div>
    );
}

