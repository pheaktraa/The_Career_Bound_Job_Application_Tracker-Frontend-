import React, { useState, useEffect } from 'react';
import { Users, FileText, Zap } from 'lucide-react';
import api from '../../api/axios';

const statCards = [
    {
        label: 'Total Users',
        key: 'total_users',
        subtext: 'Registered students',
        icon: Users,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        label: 'Global Applications',
        key: 'total_applications',
        subtext: 'Total job applications tracked',
        icon: FileText,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        label: 'Generated CVs',
        key: 'total_cvs',
        subtext: 'Professional CVs generated',
        icon: Zap,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                const data = response.data.data || response.data;
                setStats({
                    total_users: data.total_users ?? 0,
                    total_applications: data.total_applications ?? 0,
                    total_cvs: data.total_cvs ?? 0,
                });
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
                setStats({
                    total_users: 0,
                    total_applications: 0,
                    total_cvs: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-10 p-4">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    Overview
                </h1>
                <p className="text-gray-500 mt-3 text-lg">
                    Here&apos;s what&apos;s happening across Career-Bound today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map(({ label, key, subtext, icon: Icon, iconBg, iconColor }) => (
                    <div
                        key={key}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                    {label}
                                </p>
                                {loading ? (
                                    <>
                                        <div className="h-12 w-28 bg-gray-100 rounded-xl mt-3 animate-pulse" />
                                        <div className="h-4 w-40 bg-gray-100 rounded-lg mt-4 animate-pulse" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-5xl font-extrabold text-gray-900 mt-3 tabular-nums">
                                            {(stats[key] ?? 0).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-4">
                                            {subtext}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${iconBg} shrink-0`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
