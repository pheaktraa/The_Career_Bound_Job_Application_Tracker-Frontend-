import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    Clock,
    Trash2,
    Plus,
    X,
    Briefcase,
    Loader2,
    Calendar,
    AlertCircle,
    Bell,
    Check,
} from 'lucide-react';
import api from '../api/axios';

const INITIAL_FORM = {
    task_name: '',
    reminder_date: '',
    application_id: '',
};

const inputClass =
    'w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [remindersRes, jobsRes] = await Promise.all([
                api.get('/reminders'),
                api.get('/applications'),
            ]);

            const remindersData =
                remindersRes.data.reminders ||
                remindersRes.data.data ||
                remindersRes.data ||
                [];
            setReminders(Array.isArray(remindersData) ? remindersData : []);

            const jobsData =
                jobsRes.data.applications ||
                jobsRes.data.data ||
                jobsRes.data ||
                [];
            setJobs(Array.isArray(jobsData) ? jobsData : []);
        } catch (err) {
            console.error('Failed to load reminders or jobs:', err);
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

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            // Format reminder_date properly if required (Laravel datetime expects Y-m-d H:i:s or ISO standard)
            await api.post('/reminders', formData);
            setIsModalOpen(false);
            setFormData(INITIAL_FORM);
            await fetchData();
        } catch (err) {
            console.error('Failed to create reminder:', err);
            alert('Failed to add reminder. Please check your input and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleComplete = async (reminderId, currentStatus) => {
        try {
            setTogglingId(reminderId);
            const nextStatus = !currentStatus;
            
            // PUT call to /reminders with reminder_id in query and is_completed in body
            await api.put('/reminders', { is_completed: nextStatus }, {
                params: { reminder_id: reminderId }
            });

            // Update local state optimistically
            setReminders((prev) =>
                prev.map((r) =>
                    (r.reminder_id ?? r.id) === reminderId
                        ? { ...r, is_completed: nextStatus ? 1 : 0 }
                        : r
                )
            );
        } catch (err) {
            console.error('Failed to toggle status:', err);
            alert('Failed to update status.');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (reminderId, taskName) => {
        if (!window.confirm(`Delete reminder for "${taskName}"?`)) return;

        try {
            await api.delete('/reminders', {
                params: { reminder_id: reminderId }
            });
            await fetchData();
        } catch (err) {
            console.error('Failed to delete reminder:', err);
            alert('Failed to delete reminder.');
        }
    };

    // Helper to find job details
    const getJobInfo = (appId) => {
        return jobs.find((j) => String(j.application_id ?? j.id) === String(appId));
    };

    // Date formatting helper
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return dateStr;
        }
    };

    // Helper to check if a due date is today
    const isDueToday = (dateStr) => {
        if (!dateStr) return false;
        const today = new Date();
        const d = new Date(dateStr);
        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };

    // Separate lists
    const pendingReminders = reminders
        .filter((r) => !r.is_completed)
        .sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date));

    const completedReminders = reminders
        .filter((r) => r.is_completed)
        .sort((a, b) => new Date(b.reminder_date) - new Date(a.reminder_date));

    // Stats calculations
    const totalCompleted = reminders.filter((r) => r.is_completed).length;
    const tasksDueToday = reminders.filter(
        (r) => !r.is_completed && isDueToday(r.reminder_date)
    ).length;

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-600 animate-[swing_1.5s_ease-in-out_infinite]" />
                        Reminders Management
                    </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Keep track of interview dates, follow-up messages, and application deadlines.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Reminder
                </button>
            </div>

            {/* ── Main Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ────────── Left Side: Reminders Lists (Large) ────────── */}
                <div className="lg:col-span-2 space-y-8">
                    {loading ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500 text-sm font-medium">Loading your reminders...</p>
                        </div>
                    ) : reminders.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No reminders created yet.</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Click "Add Reminder" to keep up with application milestones.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Pending Tasks */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Pending Tasks ({pendingReminders.length})
                                    </h2>
                                </div>

                                {pendingReminders.length === 0 ? (
                                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center text-sm text-gray-400">
                                        All tasks completed! Amazing work. 🎉
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingReminders.map((reminder) => {
                                            const id = reminder.reminder_id ?? reminder.id;
                                            const linkedJob = getJobInfo(reminder.application_id);
                                            const dueToday = isDueToday(reminder.reminder_date);
                                            const isOverdue = new Date(reminder.reminder_date) < new Date();
                                            const isToggling = togglingId === id;

                                            return (
                                                <div
                                                    key={id}
                                                    className={`group bg-white rounded-2xl border p-5 flex items-start gap-4 hover:shadow-sm transition-all duration-200 ${
                                                        isOverdue
                                                            ? 'border-red-200 bg-red-50/5'
                                                            : dueToday
                                                            ? 'border-amber-200 bg-amber-50/10'
                                                            : 'border-gray-100'
                                                    }`}
                                                >
                                                    {/* Complete Checkbox */}
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() =>
                                                            handleToggleComplete(id, false)
                                                        }
                                                        className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                                                            isOverdue
                                                                ? 'border-red-300 text-red-600 hover:bg-red-50'
                                                                : dueToday
                                                                ? 'border-amber-300 text-amber-600 hover:bg-amber-50'
                                                                : 'border-gray-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50/30'
                                                        }`}
                                                    >
                                                        {isToggling ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                                        ) : (
                                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Check className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </button>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 leading-snug">
                                                            {reminder.task_name}
                                                        </h3>
                                                        
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs">
                                                            {/* Date */}
                                                            <span className={`inline-flex items-center gap-1 font-semibold ${
                                                                isOverdue
                                                                    ? 'text-red-600'
                                                                    : dueToday
                                                                    ? 'text-amber-600'
                                                                    : 'text-gray-500'
                                                            }`}>
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {formatDateTime(reminder.reminder_date)}
                                                                {isOverdue && (
                                                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-red-100 text-[10px] uppercase font-bold text-red-700">
                                                                        Overdue
                                                                    </span>
                                                                )}
                                                                {dueToday && !isOverdue && (
                                                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-[10px] uppercase font-bold text-amber-700">
                                                                        Today
                                                                    </span>
                                                                )}
                                                            </span>

                                                            {/* Linked Job */}
                                                            {linkedJob && (
                                                                <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                                                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                                    {linkedJob.company_name} — {linkedJob.job_title}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(id, reminder.task_name)
                                                        }
                                                        className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 border border-transparent hover:text-red-600 hover:border-red-100 hover:bg-red-50/50 active:scale-[0.95] transition-all cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Completed Tasks */}
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Completed Tasks ({completedReminders.length})
                                    </h2>
                                </div>

                                {completedReminders.length > 0 && (
                                    <div className="space-y-3">
                                        {completedReminders.map((reminder) => {
                                            const id = reminder.reminder_id ?? reminder.id;
                                            const linkedJob = getJobInfo(reminder.application_id);
                                            const isToggling = togglingId === id;

                                            return (
                                                <div
                                                    key={id}
                                                    className="group bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex items-start gap-4"
                                                >
                                                    {/* Complete Checkbox */}
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() =>
                                                            handleToggleComplete(id, true)
                                                        }
                                                        className="mt-0.5 w-6 h-6 rounded-lg bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600 cursor-pointer"
                                                    >
                                                        {isToggling ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-green-600" />
                                                        ) : (
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        )}
                                                    </button>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-400 line-through leading-snug">
                                                            {reminder.task_name}
                                                        </h3>
                                                        
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs">
                                                            {/* Date */}
                                                            <span className="inline-flex items-center gap-1 text-gray-400">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {formatDateTime(reminder.reminder_date)}
                                                            </span>

                                                            {/* Linked Job */}
                                                            {linkedJob && (
                                                                <span className="inline-flex items-center gap-1 text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                                                                    <Briefcase className="w-3.5 h-3.5 text-gray-300" />
                                                                    {linkedJob.company_name} — {linkedJob.job_title}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(id, reminder.task_name)
                                                        }
                                                        className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 border border-transparent hover:text-red-600 hover:border-red-100 hover:bg-red-50/50 active:scale-[0.95] transition-all cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* ────────── Right Side: Quick Stats (Small) ────────── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Quick Stats
                        </h2>

                        <div className="space-y-4">
                            {/* Today due card */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                                        Tasks Due Today
                                    </p>
                                    <p className="text-4xl font-extrabold text-amber-900">
                                        {tasksDueToday}
                                    </p>
                                </div>
                                <Clock className="w-10 h-10 text-amber-500 opacity-80" />
                            </div>

                            {/* Total Completed card */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold tracking-wider text-green-700 uppercase">
                                        Total Completed
                                    </p>
                                    <p className="text-4xl font-extrabold text-green-900">
                                        {totalCompleted}
                                    </p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-gray-500 leading-relaxed space-y-2">
                            <p className="font-bold text-gray-700">💡 Stay Organized</p>
                            <p>Keeping reminders linked to your job opportunities helps you track interviews and follow-up activities in a consolidated workspace.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Add Reminder Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Form panel */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                Add Reminder
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-5">
                            {/* Task Name */}
                            <div>
                                <label
                                    htmlFor="task_name"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Task Name
                                </label>
                                <input
                                    id="task_name"
                                    name="task_name"
                                    type="text"
                                    required
                                    value={formData.task_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Call recruiter, Technical Interview"
                                    className={inputClass}
                                />
                            </div>

                            {/* Reminder Date & Time */}
                            <div>
                                <label
                                    htmlFor="reminder_date"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Reminder Date & Time
                                </label>
                                <input
                                    id="reminder_date"
                                    name="reminder_date"
                                    type="datetime-local"
                                    required
                                    value={formData.reminder_date}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* Link to Job Select */}
                            <div>
                                <label
                                    htmlFor="application_id"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Link to Job
                                </label>
                                <select
                                    id="application_id"
                                    name="application_id"
                                    value={formData.application_id}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">-- No Linked Job --</option>
                                    {jobs.map((job) => {
                                        const id = job.application_id ?? job.id;
                                        return (
                                            <option key={id} value={id}>
                                                {job.company_name} — {job.job_title}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Associate this reminder with an active application opportunity.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
                                    Create Reminder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Injected Styles */}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes swing {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(15deg); }
                    40% { transform: rotate(-10deg); }
                    60% { transform: rotate(5deg); }
                    80% { transform: rotate(-5deg); }
                }
            `}</style>
        </div>
    );
};

export default Reminders;
