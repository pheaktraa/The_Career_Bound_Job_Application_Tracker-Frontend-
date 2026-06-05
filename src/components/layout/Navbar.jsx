import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    // Get initials for the avatar (e.g., "John Doe" -> "JD")
    // const getInitials = (name, firstName, lastName) => {
    //     if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    //     if (name) return name.substring(0, 2).toUpperCase();
    //     return 'U';
    // };
    // setUser(prev => ({
    //     ...prev,
    //     profile_image: prev?.profile_image
    // }));

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 sticky top-0 z-10">

            {/* Right side: Notifications and Profile */}
            <div className="flex items-center gap-5">

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {/* {getInitials(user?.name, user?.first_name, user?.last_name)} */}
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className="font-bold">JD</span>
                        )}
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
