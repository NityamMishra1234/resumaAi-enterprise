import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../../api/api";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        setLoading(true);
        await api.post("/company/auth/forgot-password/send-otp", { email });
        setStep(2);
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await api.post("/company/auth/forgot-password/verify-otp", { email, otp });
            setLoading(false);
            setStep(3);
        } catch (error: any) {
            alert(`${error.data.message}`)
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");

        try {
            setLoading(true);
            await api.post("/company/auth/forgot-password/reset", { email, password: password });
            navigate("/login");
            setLoading(false);

        } catch (error: any) {
            alert(`${error.data.message}`)
            setLoading(false);

        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl relative">

                {step === 1 && (
                    <Link to="/login" className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                )}

                <div className="mt-6 mb-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        {step === 1 && "Enter your email to receive a reset code."}
                        {step === 2 && `We sent a code to ${email}`}
                        {step === 3 && "Create your new secure password."}
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in">
                        <input
                            type="email"
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="hr@company.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSendOtp} disabled={!email || loading} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50">
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <input
                            type="text"
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-center tracking-[0.5em] text-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="000000"
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOtp} disabled={otp.length < 4 || loading} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50">
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                                placeholder="New Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                                placeholder="Confirm New Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button onClick={handleResetPassword} disabled={!password || !confirmPassword || loading} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 mt-2">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}