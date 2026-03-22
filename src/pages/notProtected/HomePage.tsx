import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2,  Zap, Shield, ArrowRight, BarChart3, Bot } from "lucide-react";

export default function HomePage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden">

            {/* HERO SECTION - Redesigned for Enterprise feel */}
            <section className="relative pt-12 pb-20 lg:pt-12 lg:pb-12 px-6">
                {/* Complex background gradients */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                            Vichar Enterprise AI 2.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
                            Hire the 1%. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                                Leave the rest to AI.
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                            Stop wasting engineering hours on preliminary screening. Vichar's intelligent agents conduct technical interviews and deliver a curated shortlist of pre-vetted top performers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/signup"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Hiring <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Request Demo
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#050505]"></div>
                                ))}
                            </div>
                            <p>Trusted by 500+ tech leads in India</p>
                        </div>
                    </motion.div>

                    {/* Right Column: Abstract Dashboard Faux-UI */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl bg-[#0a0a0a] border border-gray-800 shadow-2xl p-6 overflow-hidden">
                            {/* Dashboard Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-gray-800/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <Bot className="text-blue-400" />
                                    <span className="font-medium text-gray-200">Active AI Interviews</span>
                                </div>
                                <BarChart3 className="text-gray-500" size={20} />
                            </div>

                            {/* Candidate List Mock */}
                            <div className="space-y-4">
                                {[
                                    { name: "Rahul S.", role: "Senior Frontend", score: 94, status: "Vetted" },
                                    { name: "Priya M.", role: "Backend Eng", score: 88, status: "Vetted" },
                                    { name: "Amit K.", role: "DevOps", score: 91, status: "In Progress" },
                                ].map((cand, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div>
                                            <p className="font-medium text-white">{cand.name}</p>
                                            <p className="text-sm text-gray-500">{cand.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${cand.score > 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                {cand.score}% Match
                                            </p>
                                            <p className="text-xs text-gray-500">{cand.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Fading bottom edge */}
                            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* DIVIDER */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

            {/* HOW IT WORKS / FEATURES SECTION */}
            <section id="how-it-works" className="py-24 lg:py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16 lg:mb-24"
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">Intelligence at every step.</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">We don't just parse resumes. We conduct actual technical evaluations before you ever see the candidate.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: <Zap size={28} className="text-blue-400" />, title: "Define the Role", desc: "Input your job description and specific technical requirements. Our AI builds a custom evaluation matrix in seconds." },
                            { icon: <Bot size={28} className="text-indigo-400" />, title: "Automated Interviews", desc: "Candidates undergo an adaptive, conversational AI interview that tests real-world problem-solving, not just keywords." },
                            { icon: <Shield size={28} className="text-emerald-400" />, title: "Hire with Confidence", desc: "Access a dashboard of scored, ranked candidates with detailed transcripts and AI-generated insight summaries." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1 }}
                                className="group bg-[#0a0a0a] border border-gray-800/60 p-8 rounded-2xl hover:border-gray-600 transition-all hover:bg-gray-900/50"
                            >
                                <div className="bg-white/5 border border-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-100">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES SECTION */}
            <section id="stories" className="py-24 lg:py-32 px-6 bg-[#020202] border-t border-gray-900/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-[1.1] tracking-tight">The new standard for technical hiring.</h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">Top engineering teams are abandoning traditional ATS systems. Vichar reduces time-to-hire by 70% while drastically improving the quality of final round candidates.</p>

                        <div className="space-y-5">
                            {["Zero resume bias in initial screening", "Saved over 500+ engineering hours per quarter", "94% offer acceptance rate from AI-vetted pool"].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20">
                                        <CheckCircle2 className="text-emerald-400" size={16} />
                                    </div>
                                    <span className="text-gray-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-emerald-600/10 rounded-3xl blur-3xl -z-10"></div>
                        <div className="bg-[#0a0a0a] border border-gray-800 p-8 lg:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            {/* Subtle quote mark background */}
                            <div className="absolute top-4 right-8 text-9xl text-gray-800/30 font-serif leading-none select-none">"</div>

                            <p className="text-xl lg:text-2xl font-medium text-gray-200 mb-8 leading-relaxed relative z-10">
                                "Before Vichar, our senior devs were spending 15 hours a week doing initial tech screens. Now, they only talk to candidates who have already proven they can write production code through the AI evaluation. It's transformed our pipeline."
                            </p>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold text-white">Nandini K.</h4>
                                    <p className="text-sm text-blue-400">Head of Talent, HS Industries</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CONTACT / FOOTER SECTION */}
            <footer id="contact" className="py-12 px-6 border-t border-gray-900 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
                            Vichar<span className="text-blue-500">.</span>
                        </Link>
                        <p className="text-gray-500 mt-1 text-sm">Enterprise Talent Acquisition.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
                        <a href="mailto:contact@vichar.com" className="hover:text-white transition-colors">contact@vichar.com</a>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}