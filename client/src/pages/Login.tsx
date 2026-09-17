import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, User2Icon, ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { SignIn, SignUp } from "@clerk/clerk-react";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export default function Login({ state }: { state: string }) {
    const [isLoginState, setIsLoginState] = useState(state === "login");
    const [useCustomForm, setUseCustomForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

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
                navigate("/dashboard");
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-28 pb-16 overflow-hidden">
            {/* ── Atmospheric Ambient Backdrop (Non-overlapping, pointer-events-none) ── */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-60 animate-pulse" />
            <div className="absolute bottom-10 right-1/4 w-[380px] h-[380px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md mx-auto space-y-5">
                {/* ── Top Brand Header ── */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-xs font-mono font-semibold text-primary shadow-sm">
                        <Sparkles size={13} className="text-primary" />
                        <span>Autonomous Growth Security</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        {isLoginState ? "Welcome back" : "Create your account"}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                        {isLoginState
                            ? "Sign in to deploy verified SEO patches and monitor search telemetry"
                            : "Join SerpoAI to discover striking distance wins and automated growth"}
                    </p>
                </div>

                {/* ── Segmented Controller (Switch between Clerk & Direct Form) ── */}
                {hasClerk && (
                    <div className="p-1 rounded-xl bg-surface-elevated border border-border flex items-center gap-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => { setUseCustomForm(false); setError(""); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                !useCustomForm
                                    ? "bg-card text-primary shadow-sm border border-border"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <ShieldCheck size={14} className="text-primary" />
                            Clerk One-Click
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUseCustomForm(true); setError(""); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                useCustomForm
                                    ? "bg-card text-primary shadow-sm border border-border"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Mail size={14} />
                            Email & Password
                        </button>
                    </div>
                )}

                {/* ── Auth Body ── */}
                {hasClerk && !useCustomForm ? (
                    /* Clerk Auth Container: Isolated without redundant borders or overflow clipping */
                    <div className="w-full flex justify-center py-1">
                        {isLoginState ? (
                            <SignIn
                                routing="hash"
                                fallbackRedirectUrl="/dashboard"
                                signUpUrl="#/register"
                            />
                        ) : (
                            <SignUp
                                routing="hash"
                                fallbackRedirectUrl="/dashboard"
                                signInUrl="#/login"
                            />
                        )}
                    </div>
                ) : (
                    /* Standard Direct Email/Password Form Card */
                    <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3">
                                    {error}
                                </div>
                            )}

                            {!isLoginState && (
                                <label className="block space-y-1">
                                    <span className="text-xs font-semibold text-foreground">Full Name</span>
                                    <div className="relative">
                                        <User2Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </label>
                            )}

                            <label className="block space-y-1">
                                <span className="text-xs font-semibold text-foreground">Work Email</span>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground">Password</span>
                                    {isLoginState && (
                                        <span className="text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                            Forgot password?
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 mt-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        {isLoginState ? "Sign In" : "Create Free Account"}
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-2 text-center border-t border-border/60">
                            <p className="text-xs text-muted-foreground">
                                {isLoginState ? "Don't have an account yet?" : "Already have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => { setIsLoginState(!isLoginState); setError(""); }}
                                    className="text-primary hover:underline font-bold cursor-pointer"
                                >
                                    {isLoginState ? "Sign up here" : "Sign in"}
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Back Link ── */}
                <div className="text-center pt-2">
                    <Link
                        to="/"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
                    >
                        ← Return to SerpoAI Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
