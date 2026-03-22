// components/Header.tsx
import { LogOut, LayoutDashboard } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

const CompanyHeader = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {

        logout()
        navigate("/login")
        // tokenServices.removeToken();
        // window.location.href = '/login';

        if (window.confirm("Are you sure you want to log out?")) {
            console.log("User logged out");
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                        Resume<span className="text-blue-500">Space</span>
                    </h1>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    <span className="text-sm font-semibold">Logout</span>
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
};

export default CompanyHeader;