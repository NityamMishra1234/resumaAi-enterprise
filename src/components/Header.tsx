import { Link } from "react-router-dom";
import { useAuth } from "../providers/authProvider";

export default function Header() {
    const { user, logout } = useAuth();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-gray-800 px-8 py-4 w-full transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity">
                        ResumeAI<span className="text-blue-500">.</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it Works</button>
                        <button onClick={() => scrollToSection('stories')} className="hover:text-white transition-colors">Success Stories</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
                    </nav>
                </div>

                <div className="flex gap-6 items-center font-medium">
                    {!user ? (
                        <>
                            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-white text-black text-sm px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-sm px-4 py-2 rounded-lg transition-all"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}