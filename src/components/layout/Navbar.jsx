import React from 'react';

const Navbar = () => {
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-gray-600 relative">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="flex items-center space-x-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        AM
                    </div>
                    <span className="text-sm font-medium text-gray-700">Alex Mercer</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
