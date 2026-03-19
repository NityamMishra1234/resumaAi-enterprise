"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    BrainCircuit,
    RotateCcw,
    Loader2
} from 'lucide-react';

import { jobService } from '../services/job.service';
import type { InterviewDetailsResponse, Application } from '../types/job.types';
import { ApplicationStatus } from '../types/job.types';

interface ApplicantProfileProps {
    application: Application;
    onBack: () => void;
    onStatusUpdated: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const ApplicantProfile = ({ application, onBack, onStatusUpdated }: ApplicantProfileProps) => {
    const [details, setDetails] = useState<InterviewDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await jobService.getInterviewDetails(application.id);
                setDetails(data);
            } catch (error) {
                console.error("Failed to load interview details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [application.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onBack();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onBack]);

    const handleUpdateStatus = async (newStatus: ApplicationStatus) => {
        try {
            setIsUpdating(true);
            await jobService.updateApplicationStatus(application.id, newStatus);

            if (details) {
                setDetails({
                    ...details,
                    application: {
                        ...details.application,
                        status: newStatus
                    }
                });
            }

            onStatusUpdated(application.id, newStatus);
        } catch {
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
                <BrainCircuit className="w-12 h-12 mb-4 animate-pulse text-blue-500" />
                <p className="text-sm font-medium tracking-wide">Analyzing Candidate Performance...</p>
            </div>
        );
    }

    if (!details) {
        return <div className="p-10 text-center text-red-400">Error: Candidate profile not found.</div>;
    }

    const { user, interview, application: appData } = details;
    const isPending = appData.status === ApplicationStatus.PENDING;

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex flex-col h-full p-6 bg-slate-950/50 backdrop-blur-md"
        >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Pipeline View
                </button>

                <div className="flex items-center gap-3">
                    {appData.resumeUrl && (
                        <a
                            href={appData.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all"
                        >
                            Resume
                        </a>
                    )}
                    <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${appData.status === ApplicationStatus.SHORTLISTED
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : appData.status === ApplicationStatus.REJECTED
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                        {appData.status}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">
                            {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400 mt-2">
                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(appData.appliedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter mb-1">Expertise Score</p>
                        <p className={`text-4xl font-black ${interview.score >= 75 ? "text-emerald-400" : interview.score >= 50 ? "text-amber-400" : "text-red-400"
                            }`}>
                            {interview.score}%
                        </p>
                    </div>
                </div>

                <section>
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-purple-500" />
                        Intelligence Feedback
                    </h3>
                    <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-5 text-sm leading-relaxed text-slate-300 italic shadow-inner">
                        "{interview.feedback}"
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                        Technical Q&A Breakdown
                    </h3>
                    {interview.conversation.map((qa, index) => (
                        <div key={index} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group">
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 opacity-60">System Inquiry</p>
                                <p className="text-white font-bold leading-snug">{qa.question}</p>
                            </div>
                            <div className="pl-4 border-l-2 border-emerald-500/30">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 opacity-60">Candidate Response</p>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">{qa.answer}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <AnimatePresence mode="wait">
                    {isPending ? (
                        <motion.div
                            key="pending-actions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-4"
                        >
                            <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(ApplicationStatus.SHORTLISTED)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                Shortlist Candidate
                            </button>

                            <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(ApplicationStatus.REJECTED)}
                                className="flex-1 bg-white/5 hover:bg-red-600/20 text-white py-4 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <XCircle className="w-5 h-5" />}
                                Reject
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="completed-actions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <p className="text-xs font-medium text-slate-500">Decided on {new Date().toLocaleDateString()}</p>
                            <button
                                onClick={() => handleUpdateStatus(ApplicationStatus.PENDING)}
                                className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline px-4 py-2"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Re-evaluate Status
                            </button>
                        </motion.div>
                    )
                    }
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ApplicantProfile;