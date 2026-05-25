import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    // Get initials for the avatar (e.g., "John Doe" -> "JD")
    const getInitials = (name, firstName, lastName) => {
        if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
        if (name) return name.substring(0, 2).toUpperCase();
        return 'U';
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 sticky top-0 z-10">
            
            {/* Right side: Notifications and Profile */}
            <div className="flex items-center gap-5">
                {/* Notification Bell */}
                <button className="text-gray-400 hover:text-blue-600 transition-colors relative cursor-pointer">
                    <Bell className="w-5 h-5" />
                    {/* A tiny red dot to make it look like there are unread notifications */}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {getInitials(user?.name, user?.first_name, user?.last_name)}
                    </div>
                    <div className="hidden sm:block text-sm">
                        <p className="font-semibold text-gray-900 leading-none">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                            {user?.role || 'User'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
