import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, User2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function Login({ state }: { state: string }) {
    const [isLoginState, setIsLoginState] = useState(state === "login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
            <div className="w-full max-w-md">

                {/* Form Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center py-4">
                            <h1 className="text-2xl font-semibold text-foreground">
                                {isLoginState ? "Welcome back" : "Create account"}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {isLoginState ? "Sign in to your" : "Sign up for your"} SerpoAI account
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {!isLoginState && (
                            <label>
                                <div className="block text-sm text-foreground mb-1.5">Name</div>
                                <div className="relative">
                                    <User2Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                    />
                                </div>
                            </label>
                        )}

                        <label>
                            <div className="block text-sm text-foreground mb-1.5 mt-4">Email</div>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                />
                            </div>
                        </label>

                        <label>
                            <div className="block text-sm text-foreground mb-1.5 mt-4">Password</div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/60 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                                />
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-5 rounded-lg bg-primary text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            id="login-submit-btn"
                            style={{ color: "var(--background)" }}
                        >
                            {loading
                                ? <Loader2 size={18} className="animate-spin" />
                                : isLoginState ? "Sign In" : "Create Account"
                            }
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    {isLoginState ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => { setIsLoginState((prev) => !prev); setError(""); }}
                        className="text-primary hover:underline font-medium pl-1"
                    >
                        {isLoginState ? "Sign up" : "Sign in"}
                    </button>
                </p>

                <p className="text-center text-xs text-muted-foreground mt-3">
                    <Link to="/" className="hover:underline hover:text-foreground transition-colors">
                        ← Back to home
                    </Link>
                </p>

            </div>
        </div>
    );
}
