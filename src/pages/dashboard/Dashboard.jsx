import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/applications');
                // Extract data depending on how the backend formats the response (with or without a pagination 'data' wrapper)
                const data = response.data.data || response.data || [];
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
                setError("Failed to load applications data.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Calculate Stats
    const totalApps = applications.length;
    const interviews = applications.filter(a => a.status === 'interview').length;
    const offers = applications.filter(a => a.status === 'offer').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // Get the 5 most recent activities based on created_at or fallback to id
    const recentActivity = [...applications]
        .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
        .slice(0, 5);

    // Helper to generate Status Badge mapping
    const getStatusBadge = (status) => {
        const normalized = status?.toLowerCase();
        switch (normalized) {
            case 'applied':
                return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Applied</span>;
            case 'interview':
                return <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Interview</span>;
            case 'offer':
                return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Offer</span>;
            case 'rejected':
                return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Rejected</span>;
            default:
                return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">{status || 'Unknown'}</span>;
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
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Welcome back, {user?.first_name || user?.name || 'Alex'}
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Your application momentum is up <span className="text-green-600 font-semibold">12%</span> this week...
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Card 1: Total Applications */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                    </div>
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1">TOTAL APPLICATIONS</div>
                    <div className="text-4xl font-extrabold text-gray-900">{totalApps}</div>
                    <div className="text-sm text-green-600 font-medium mt-3 flex items-center bg-green-50 w-max px-2 py-1 rounded">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        +4 this week
                    </div>
                </div>

                {/* Card 2: Interviews */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        </div>
                    </div>
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1">INTERVIEWS</div>
                    <div className="text-4xl font-extrabold text-gray-900">{interviews}</div>
                    <div className="text-sm text-green-600 font-medium mt-3 flex items-center bg-green-50 w-max px-2 py-1 rounded">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        +1 this week
                    </div>
                </div>

                {/* Card 3: Offers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1">OFFERS</div>
                    <div className="text-4xl font-extrabold text-gray-900">{offers}</div>
                    <div className="text-sm text-gray-500 font-medium mt-3 flex items-center bg-gray-50 w-max px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                        No change
                    </div>
                </div>

                {/* Card 4: Rejected */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1">REJECTED</div>
                    <div className="text-4xl font-extrabold text-gray-900">{rejected}</div>
                    <div className="text-sm text-gray-500 font-medium mt-3 flex items-center bg-gray-50 w-max px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                        No change
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                </div>
                
                {applications.length === 0 && !error ? (
                    <div className="p-8 text-center text-gray-500">
                        You haven't submitted any applications yet. Time to get started!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Applied</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentActivity.map((app, idx) => (
                                    <tr key={app.id || idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* Company Logo Placeholder */}
                                                <div className="w-10 h-10 rounded bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-lg mr-4 border border-gray-200">
                                                    {(app.company_name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-900">{app.company_name || 'Unknown Company'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                            {app.position || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(app.created_at || app.date_applied || Date.now()).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
