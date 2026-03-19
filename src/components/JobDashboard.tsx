// components/JobDashboard.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, MapPin, Briefcase, X, ChevronRight } from 'lucide-react';
import { jobService } from '../services/job.service';
import type { Job, Application } from '../types/job.types';
import { JobType } from '../types/job.types';
import CompanyHeader from './companyHeader';
import ApplicantProfile from './ApplicantProfile';
import { ApplicationStatus } from '../types/job.types';


const JobDashboard = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
    const [currentApplicants, setCurrentApplicants] = useState<Application[]>([]);

    const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

    const [formData, setFormData] = useState({
        title: '', description: '', location: '', type: JobType.FULL_TIME,
        salaryMin: '', salaryMax: '', skills: ''
    });

    useEffect(() => { loadJobs(); }, []);

    useEffect(() => {
        if (isJobModalOpen || isApplicantModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isJobModalOpen, isApplicantModalOpen]);

    const loadJobs = async () => {
        try {
            setIsLoading(true);
            const data = await jobService.getCompanyJobs();
            setJobs(data);
        } catch (err) {
            setError("Failed to load jobs.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await jobService.deleteJob(id);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (err) {
            alert("Error deleting job.");
        }
    };

    const openCreateModal = () => {
        setEditingJob(null);
        setFormData({ title: '', description: '', location: '', type: JobType.FULL_TIME, salaryMin: '', salaryMax: '', skills: '' });
        setIsJobModalOpen(true);
    };

    const openEditModal = (job: Job) => {
        setEditingJob(job);
        setFormData({
            title: job.title, description: job.description, location: job.location, type: job.type,
            salaryMin: job.salaryMin?.toString() || '', salaryMax: job.salaryMax?.toString() || '',
            skills: job.skills ? job.skills.join(', ') : ''
        });
        setIsJobModalOpen(true);
    };

    const handleCloseApplicantModal = () => {
        setIsApplicantModalOpen(false);
        setTimeout(() => setSelectedApplicant(null), 300);
    };

    const handleJobSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
            salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
        };

        try {
            if (editingJob) {
                const updatedJob = await jobService.updateJob(editingJob.id, payload);
                setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...updatedJob } : j));
            } else {
                const newJob = await jobService.createJob(payload as any);
                setJobs([...jobs, newJob]);
            }
            setIsJobModalOpen(false);
        } catch (err) {
            alert("Failed to save job. Check console.");
        }
    };

    const handleStatusUpdated = (applicationId: string, newStatus: ApplicationStatus) => {
        setCurrentApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app));
        setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
    };

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-semibold tracking-widest uppercase animate-pulse">Loading Workspace...</div>;

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
            <CompanyHeader />

            <main className="p-8 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Active Postings</h2>
                        <p className="text-slate-400 mt-1">Manage your company's open roles and applicants.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 transition-all"
                        onClick={openCreateModal}
                    >
                        <Plus className="w-5 h-5" /> New Job Listing
                    </motion.button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}
                            key={job.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-blue-500/10 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                        <span className="flex items-center gap-1 capitalize"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${job.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {job.isActive ? "Active" : "Closed"}
                                </span>
                            </div>

                            <p className="text-slate-400 text-sm mb-5 line-clamp-2 leading-relaxed">{job.description}</p>

                            <div className="mb-6 flex flex-wrap gap-2">
                                {job.skills?.slice(0, 3).map(skill => (
                                    <span key={skill} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">{skill}</span>
                                ))}
                                {job.skills && job.skills.length > 3 && (
                                    <span className="text-xs text-slate-500 flex items-center font-medium">+{job.skills.length - 3} more</span>
                                )}
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-800 flex justify-between items-center">
                                <button
                                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                                    onClick={() => { setCurrentApplicants(job.applications || []); setIsApplicantModalOpen(true); }}
                                >
                                    <Users className="w-4 h-4" /> Applicants ({job.applications?.length || 0})
                                </button>
                                <div className="flex gap-1">
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" onClick={() => openEditModal(job)}><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                            <Briefcase className="w-12 h-12 mb-4 text-slate-700" />
                            <p className="text-lg font-medium text-slate-400">No active jobs found</p>
                            <p className="text-sm">Create a new listing to start hiring.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {/* Create/Edit Modal */}
                {isJobModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative">
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-2xl font-bold text-white">{editingJob ? 'Edit Role' : 'Create Role'}</h2>
                                <button className="text-slate-500 hover:text-white transition-colors" onClick={() => setIsJobModalOpen(false)}><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 min-h-0 custom-scrollbar">
                                <form onSubmit={handleJobSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Job Title</label>
                                        <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Description</label>
                                        <textarea required className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Location</label>
                                            <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Job Type</label>
                                            <select className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}>
                                                <option value={JobType.FULL_TIME}>Full-Time</option>
                                                <option value={JobType.PART_TIME}>Part-Time</option>
                                                <option value={JobType.INTERNSHIP}>Internship</option>
                                                <option value={JobType.CONTRACT}>Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Min Salary</label>
                                            <input type="number" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Max Salary</label>
                                            <input type="number" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Required Skills (Comma Separated)</label>
                                        <input type="text" placeholder="React, Node.js, Python" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-blue-500" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                                    </div>
                                </form>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
                                <button type="button" className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all" onClick={() => setIsJobModalOpen(false)}>Cancel</button>
                                <button onClick={handleJobSubmit} className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Save Role</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 🔥 APPLICANTS MODAL - WIDER & STRICT HEIGHT */}
                {isApplicantModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        {/* Notice max-w-5xl and h-[90vh] here */}
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative">

                            <AnimatePresence mode="wait">
                                {!selectedApplicant ? (
                                    /* --- 1. LIST VIEW --- */
                                    /* Notice w-full and min-h-0 here */
                                    <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full w-full min-h-0 p-6">
                                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800 shrink-0">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-blue-500" /> Applicant Pipeline</h2>
                                                <p className="text-sm text-slate-400 mt-1">Reviewing {currentApplicants.length} candidates</p>
                                            </div>
                                            <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors" onClick={handleCloseApplicantModal}><X className="w-5 h-5" /></button>
                                        </div>

                                        {/* Notice min-h-0 here to force the scrollbar */}
                                        <div className="flex-1 overflow-y-auto pr-2 min-h-0 custom-scrollbar">
                                            {currentApplicants.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                                    <Users className="w-12 h-12 mb-3 opacity-50" />
                                                    <p>No applications received yet.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {currentApplicants.map((app, i) => (
                                                        <motion.div
                                                            key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                            onClick={() => setSelectedApplicant(app)}
                                                            className="border border-slate-800 rounded-xl p-4 flex justify-between items-center bg-slate-950/50 hover:bg-slate-800 hover:border-blue-500/30 transition-all cursor-pointer group"
                                                        >
                                                            <div className="flex items-center gap-4 truncate">
                                                                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg border border-blue-500/20 shrink-0">
                                                                    {app.user?.name?.charAt(0) || "U"}
                                                                </div>
                                                                <div className="truncate">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <h4 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{app.user?.name || "Unknown User"}</h4>
                                                                        <span className={`uppercase text-[9px] shrink-0 font-bold tracking-wider px-2 py-0.5 rounded border ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                                            {app.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-400 truncate">{app.user?.email || "No email provided"}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 shrink-0">
                                                                <div className="text-right hidden sm:block">
                                                                    <p className="text-emerald-400 font-bold text-sm">{app.score}%</p>
                                                                    <p className="text-xs text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* --- 2. DETAIL VIEW --- */
                                    <ApplicantProfile
                                        application={selectedApplicant}
                                        onBack={() => setSelectedApplicant(null)}
                                        onStatusUpdated={handleStatusUpdated}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDashboard;