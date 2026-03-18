import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    // Step 3 states
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate =  useNavigate()

    const sendOtp = async () => {
        setLoading(true);
        await api.post("/company/auth/send-otp", { email });
        setStep(2);
        setLoading(false);
    };

    const verifyOtp = async () => {
        setLoading(true);
        await api.post("/company/auth/verify-otp", { email, otp });
        setStep(3);
        setLoading(false);
    };

    const createAccount = async () => {
        setLoading(true);
        await api.post("/company/auth/register", { email, password });
        navigate("/dashboard")
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl">

                {/* Step Indicator */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-white' : 'bg-gray-800'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Create Account</h2>
                            <p className="text-sm text-gray-400 mb-6">Enter your work email to get started.</p>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button onClick={sendOtp} disabled={loading || !email} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50">
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Check your email</h2>
                            <p className="text-sm text-gray-400 mb-6">We sent an OTP to {email}</p>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-center tracking-[0.5em] text-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                        <button onClick={verifyOtp} disabled={loading || otp.length < 4} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Secure your account</h2>
                            <p className="text-sm text-gray-400 mb-6">Create a strong password for your portal.</p>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create password"
                                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button onClick={createAccount} disabled={loading || password.length < 6} className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50">
                            Complete Registration
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-white hover:underline">Log in</Link>
                    </p>
                )}
            </div>
        </div>
    );
}