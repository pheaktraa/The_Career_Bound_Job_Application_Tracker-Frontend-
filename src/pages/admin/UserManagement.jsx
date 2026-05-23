import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const getFullName = (user) =>
    `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';

const getInitials = (user) => {
    const first = (user.first_name || '')[0] || '';
    const last = (user.last_name || '')[0] || '';
    return `${first}${last}`.toUpperCase() || 'U';
};

const getActivityLevel = (id) => {
    const seed =
        typeof id === 'number'
            ? id
            : String(id ?? '')
                  .split('')
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 20 + (seed % 76);
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                const data = response.data.users || response.data.data || response.data || [];
                const list = Array.isArray(data) ? data : [];
                setUsers(
                    list.map((user) => ({
                        ...user,
                        activityLevel: getActivityLevel(user.user_id ?? user.id),
                    }))
                );
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return users;

        return users.filter((user) => {
            const name = getFullName(user).toLowerCase();
            const email = (user.email || '').toLowerCase();
            return name.includes(query) || email.includes(query);
        });
    }, [users, searchQuery]);

    const handleDelete = (id) => {
        console.log('Deleting user ID:', id);
        window.alert('User deleted successfully (mock).');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    User Management
                </h1>
                <p className="text-gray-500 mt-3 text-lg">
                    Manage credentials and track platform engagement.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Engagement
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                                                    <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="h-2 w-full max-w-xs bg-gray-100 rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        {searchQuery
                                            ? 'No users match your search.'
                                            : 'No users found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const userId = user.user_id ?? user.id;
                                    const isAdmin = user.role === 'admin';

                                    return (
                                        <tr
                                            key={userId}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {getInitials(user)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {getFullName(user)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                                        isAdmin
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                >
                                                    {isAdmin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="max-w-xs">
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all"
                                                            style={{ width: `${user.activityLevel}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(userId)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    aria-label={`Delete ${getFullName(user)}`}
                                                >
                                                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
