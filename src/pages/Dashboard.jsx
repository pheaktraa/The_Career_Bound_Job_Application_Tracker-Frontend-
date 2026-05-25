import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from "../api/axios"; 
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [appsRes, remindersRes] = await Promise.all([
                    api.get('/applications'),
                    api.get('/reminders')
                ]);
                
                const appsData = appsRes.data.applications || appsRes.data.data || appsRes.data || [];
                setApplications(Array.isArray(appsData) ? appsData : []);
                
                const remindersData = remindersRes.data.reminders || remindersRes.data.data || remindersRes.data || [];
                setReminders(Array.isArray(remindersData) ? remindersData : []);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate Stats based on status enum
    const totalApps = applications.length;
    const interviews = applications.filter(a => a.status === 'interview').length;
    const offers = applications.filter(a => a.status === 'offer').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // Sort recent activity (applications)
    const recentActivity = [...applications]
        .sort((a, b) => new Date(b.created_at || b.application_id) - new Date(a.created_at || a.application_id))
        .slice(0, 5);

    // Filter top 3 pending reminders
    const pendingReminders = reminders
        .filter(r => !r.is_completed)
        .sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date))
        .slice(0, 3);

    const isToday = (dateStr) => {
        if (!dateStr) return false;
        const today = new Date();
        const d = new Date(dateStr);
        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };

    const isOverdue = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    const formatReminderDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusBadge = (status) => {
        const normalized = status?.toLowerCase();
        switch (normalized) {
            case 'applied':
                return <span className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">Applied</span>;
            case 'interview':
                return <span className="px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-100">Interview</span>;
            case 'offer':
                return <span className="px-3 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-full border border-green-100">Offer</span>;
            case 'rejected':
                return <span className="px-3 py-1 text-xs font-semibold bg-red-50 text-red-700 rounded-full border border-red-100">Rejected</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-700 rounded-full border border-gray-100 capitalize">{status || 'Unknown'}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back, {user?.first_name || 'there'}
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    You have <span className="text-blue-600 font-semibold">{totalApps}</span> active applications tracked.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Total Applications</div>
                    <div className="text-4xl font-extrabold text-gray-900">{totalApps}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Interviews</div>
                    <div className="text-4xl font-extrabold text-purple-600">{interviews}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Offers</div>
                    <div className="text-4xl font-extrabold text-green-600">{offers}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-1 uppercase">Rejected</div>
                    <div className="text-4xl font-extrabold text-red-600">{rejected}</div>
                </div>
            </div>

            {/* Bottom Section: Recent Activity (2/3) & Reminders Summary (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* ── Recent Activity Table (2 cols) ── */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        </div>
                        
                        {applications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No applications found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentActivity.map((app) => (
                                            <tr key={app.application_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{app.company_name}</td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">{app.job_title}</td>
                                                <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                                <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                        {app.application_date}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Upcoming Reminders Widget (1 col) ── */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-blue-500" />
                                Upcoming Reminders
                            </h3>
                            <Link 
                                to="/reminders"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 hover:underline"
                            >
                                See all
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {pendingReminders.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-xs space-y-2">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto opacity-80" />
                                <p>No pending reminders!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingReminders.map((reminder) => {
                                    const id = reminder.reminder_id ?? reminder.id;
                                    const activeToday = isToday(reminder.reminder_date);
                                    const activeOverdue = isOverdue(reminder.reminder_date);

                                    return (
                                        <div 
                                            key={id}
                                            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                                                activeOverdue 
                                                    ? 'bg-red-50/20 border-red-100'
                                                    : activeToday 
                                                        ? 'bg-amber-50/20 border-amber-100'
                                                        : 'bg-slate-50/40 border-slate-100 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="mt-0.5">
                                                {activeOverdue ? (
                                                    <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                                                ) : activeToday ? (
                                                    <Clock className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                                                ) : (
                                                    <Calendar className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="text-sm font-bold text-gray-900 truncate">
                                                        {reminder.task_name}
                                                    </h4>
                                                    {activeOverdue ? (
                                                        <span className="shrink-0 px-2 py-0.5 text-[9px] font-extrabold tracking-wider bg-red-100 text-red-700 rounded uppercase">
                                                            Overdue
                                                        </span>
                                                    ) : activeToday ? (
                                                        <span className="shrink-0 px-2 py-0.5 text-[9px] font-extrabold tracking-wider bg-amber-100 text-amber-700 rounded uppercase">
                                                            Today
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                                    {formatReminderDate(reminder.reminder_date)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;