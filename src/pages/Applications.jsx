import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Plus,
    Trash2,
    Edit3,
    Loader2,
    Calendar,
    FileText,
    AlertCircle,
    X,
    MessageSquare,
    ChevronDown,
} from 'lucide-react';
import api from '../api/axios';

const INITIAL_FORM = {
    company_name: '',
    job_title: '',
    application_date: new Date().toISOString().split('T')[0],
    application_note: '',
    status: 'applied',
    generatecv_id: '',
};

const inputClass =
    'w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appsRes, cvsRes] = await Promise.all([
                api.get('/applications'),
                api.get('/generatecv'),
            ]);

            const appsData =
                appsRes.data.applications ||
                appsRes.data.data ||
                appsRes.data ||
                [];
            setApplications(Array.isArray(appsData) ? appsData : []);

            const cvsData =
                cvsRes.data.generatecv ||
                cvsRes.data.resumes ||
                cvsRes.data.data ||
                cvsRes.data ||
                [];
            setCvs(Array.isArray(cvsData) ? cvsData : []);
        } catch (err) {
            console.error('Failed to load applications tracker data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openAddModal = () => {
        setEditingApplication(null);
        setFormData(INITIAL_FORM);
        setIsModalOpen(true);
    };

    const openEditModal = (app) => {
        setEditingApplication(app);
        setFormData({
            company_name: app.company_name || '',
            job_title: app.job_title || '',
            application_date: app.application_date || new Date().toISOString().split('T')[0],
            application_note: app.application_note || '',
            status: app.status || 'applied',
            generatecv_id: app.generatecv_id || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingApplication(null);
        setFormData(INITIAL_FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingApplication) {
                const id = editingApplication.application_id ?? editingApplication.id;
                await api.put('/applications', formData, {
                    params: { application_id: id }
                });
            } else {
                await api.post('/applications', formData);
            }
            closeModal();
            await fetchData();
        } catch (err) {
            console.error('Failed to save job application:', err);
            alert('Failed to save job application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingStatusId(applicationId);
            // PUT request sending status in body, and application_id as query parameter
            await api.put('/applications', { status: newStatus }, {
                params: { application_id: applicationId }
            });
            
            // Instantly update local state to ensure snappy UI feedback
            setApplications((prev) =>
                prev.map((app) =>
                    (app.application_id ?? app.id) === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDelete = async (applicationId, companyName) => {
        if (!window.confirm(`Delete job application for "${companyName}"?`)) return;

        try {
            await api.delete('/applications', {
                params: { application_id: applicationId }
            });
            await fetchData();
        } catch (err) {
            console.error('Failed to delete application:', err);
            alert('Failed to delete application.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'applied':
                return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-100';
            case 'interview':
                return 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-100';
            case 'offer':
                return 'bg-green-50 text-green-700 border-green-200 focus:ring-green-100';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-gray-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        Applications Tracker
                    </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Track and manage your active opportunities.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New Application
                </button>
            </div>

            {/* ── Table Card ── */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Fetching job applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="py-24 text-center">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No job applications tracked yet.</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Click "+ Add New Application" to list your first opportunity.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date Applied
                                    </th>
                                    <th className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => {
                                    const id = app.application_id ?? app.id;
                                    const isUpdating = updatingStatusId === id;

                                    return (
                                        <tr
                                            key={id}
                                            className="hover:bg-slate-50/60 transition-colors"
                                        >
                                            {/* Company */}
                                            <td className="px-6 py-4.5">
                                                <div className="font-semibold text-gray-900">
                                                    {app.company_name}
                                                </div>
                                                {app.application_note && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 max-w-xs truncate" title={app.application_note}>
                                                        <MessageSquare className="w-3 h-3 shrink-0" />
                                                        <span>
                                                            {app.application_note.length > 20
                                                                ? `${app.application_note.substring(0, 20)}...`
                                                                : app.application_note}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Job Title */}
                                            <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                                                {app.job_title}
                                            </td>

                                            {/* Date Applied */}
                                            <td className="px-6 py-4.5 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{app.application_date || 'N/A'}</span>
                                                </div>
                                            </td>

                                            {/* Status Dropdown */}
                                            <td className="px-6 py-4.5">
                                                <div className="relative inline-flex items-center">
                                                    <select
                                                        value={app.status || 'applied'}
                                                        disabled={isUpdating}
                                                        onChange={(e) =>
                                                            handleStatusChange(id, e.target.value)
                                                        }
                                                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border focus:outline-none focus:ring-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getStatusStyle(
                                                            app.status
                                                        )}`}
                                                    >
                                                        <option value="applied">Applied</option>
                                                        <option value="interview">Interview</option>
                                                        <option value="offer">Offer</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                    <div className="absolute right-2.5 pointer-events-none text-current opacity-60">
                                                        {isUpdating ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <ChevronDown className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(app)}
                                                        title="Edit Opportunity"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 border border-transparent hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 active:scale-[0.95] transition-all cursor-pointer"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(id, app.company_name)
                                                        }
                                                        title="Delete Opportunity"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 border border-transparent hover:text-red-600 hover:border-red-100 hover:bg-red-50/50 active:scale-[0.95] transition-all cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Add/Edit Application Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Form panel */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingApplication ? 'Edit Application' : 'Add Application'}
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Grid 1: Company & Job */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="company_name"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Company Name
                                    </label>
                                    <input
                                        id="company_name"
                                        name="company_name"
                                        type="text"
                                        required
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Google"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="job_title"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Job Title
                                    </label>
                                    <input
                                        id="job_title"
                                        name="job_title"
                                        type="text"
                                        required
                                        value={formData.job_title}
                                        onChange={handleChange}
                                        placeholder="e.g. UI/UX Designer"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Grid 2: Date & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="application_date"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Date Applied
                                    </label>
                                    <input
                                        id="application_date"
                                        name="application_date"
                                        type="date"
                                        required
                                        value={formData.application_date}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="interview">Interview</option>
                                        <option value="offer">Offer</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* CV Selector */}
                            <div>
                                <label
                                    htmlFor="generatecv_id"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Select Resume Used
                                </label>
                                <select
                                    id="generatecv_id"
                                    name="generatecv_id"
                                    value={formData.generatecv_id}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">-- No Resume Linked --</option>
                                    {cvs.map((cv) => {
                                        const id = cv.generatecv_id ?? cv.id;
                                        return (
                                            <option key={id} value={id}>
                                                {cv.job_title} ({cv.fullname})
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Link this application to a resume created in your profile.
                                </p>
                            </div>

                            {/* Note (Jenny's large detailed logs) */}
                            <div>
                                <label
                                    htmlFor="application_note"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Application Note
                                </label>
                                <textarea
                                    id="application_note"
                                    name="application_note"
                                    rows={5}
                                    value={formData.application_note}
                                    onChange={handleChange}
                                    placeholder="Write detailed application notes, job descriptions, links to job posts, referral info..."
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {submitting && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {editingApplication ? 'Save Changes' : 'Add Opportunity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Fade-in Animation keyframes */}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Applications;
