import React, { useState, useEffect } from 'react';
import api from "../api/axios"; 
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/applications');
                // FIXED: Handle Laravel's response structure
                const data = response.data.applications || response.data.data || response.data || [];
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

    // Calculate Stats based on your status enum
    const totalApps = applications.length;
    const interviews = applications.filter(a => a.status === 'interview').length;
    const offers = applications.filter(a => a.status === 'offer').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // FIXED: Use application_id as fallback for sorting
    const recentActivity = [...applications]
        .sort((a, b) => new Date(b.created_at || b.application_id) - new Date(a.created_at || a.application_id))
        .slice(0, 5);

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
        <div className="space-y-8 p-4">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Welcome back, {user?.first_name || 'there'}
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    You have <span className="text-blue-600 font-semibold">{totalApps}</span> total applications tracked.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1 uppercase">Total Applications</div>
                    <div className="text-4xl font-extrabold text-gray-900">{totalApps}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1 uppercase">Interviews</div>
                    <div className="text-4xl font-extrabold text-purple-600">{interviews}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1 uppercase">Offers</div>
                    <div className="text-4xl font-extrabold text-green-600">{offers}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs font-bold tracking-wider text-gray-500 mb-1 uppercase">Rejected</div>
                    <div className="text-4xl font-extrabold text-red-600">{rejected}</div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                </div>
                
                {applications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No applications found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Position</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentActivity.map((app) => (
                                    <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{app.company_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.job_title}</td>
                                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{app.application_date}</td>
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