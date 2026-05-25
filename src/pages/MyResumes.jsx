import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Plus,
    Download,
    Edit3,
    Trash2,
    Loader2,
    Calendar,
    User,
    Briefcase,
} from 'lucide-react';
import api from '../api/axios';

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/generatecv');
            // FIXED: Added response.data.generatecv to match Laravel!
            const data =
                response.data.generatecv || 
                response.data.resumes ||
                response.data.data ||
                response.data ||
                [];
            setResumes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch resumes:', err);
            setResumes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleDelete = async (resume) => {
        const id = resume.generatecv_id ?? resume.id;
        if (!window.confirm(`Are you sure you want to delete this CV for "${resume.fullname}"?`)) return;

        try {
            await api.delete('/generatecv', { params: { generatecv_id: id } });
            await fetchResumes();
        } catch (err) {
            console.error('Failed to delete resume:', err);
            alert('Failed to delete resume. Please try again.');
        }
    };

    const handleDownload = (resume) => {
        alert('PDF Download feature coming soon!');
    };

    const handleEdit = (resume) => {
        const id = resume.generatecv_id ?? resume.id;
        // Direct to CVBuilder with the pre-existing CV ID or template ID
        navigate(`/cv-builder?cv_id=${id}&template_id=${resume.template_id || ''}`);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    /* ───────────── Skeleton card ───────────── */
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                <FileText className="w-10 h-10 text-gray-200" />
            </div>
            <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
            <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex justify-between gap-3">
                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Your Saved Resumes
                    </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Manage and track your professional storytelling.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/templates')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Create New CV
                </button>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : resumes.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No resumes saved yet.</p>
                    <p className="text-gray-400 text-sm mt-1 mb-6">
                        Start crafting your professional story with our beautiful templates.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/templates')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
                    >
                        Choose a Template
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {resumes.map((resume) => {
                        const id = resume.generatecv_id ?? resume.id;
                        return (
                            <div
                                key={id}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                {/* Upper Thumbnail Area */}
                                <div className="h-40 bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center border-b border-gray-100 p-4 relative group-hover:from-blue-50/30 group-hover:to-indigo-50/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 mb-2">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">
                                        Resume Doc
                                    </span>
                                </div>

                                {/* Text Details */}
                                <div className="p-5 flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg truncate flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                                            {resume.job_title || 'Untitled CV'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 truncate flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>Created for:</span>
                                            <span className="font-medium text-gray-700">{resume.fullname}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(resume.created_at)}</span>
                                    </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex justify-between items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(resume)}
                                        title="View/Download"
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 active:scale-[0.97] transition-all cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(resume)}
                                        title="Edit"
                                        className="inline-flex items-center justify-center w-9 h-9 text-gray-500 border border-gray-200 rounded-xl hover:text-blue-600 hover:border-blue-200 active:scale-[0.97] transition-all cursor-pointer"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(resume)}
                                        title="Delete"
                                        className="inline-flex items-center justify-center w-9 h-9 text-gray-400 border border-gray-200 rounded-xl hover:text-red-600 hover:border-red-200 active:scale-[0.97] transition-all cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyResumes;
