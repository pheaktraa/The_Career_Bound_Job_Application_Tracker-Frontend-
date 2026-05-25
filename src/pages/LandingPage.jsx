import React, { useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../context/AuthContext'; // Added useAuth
import {
    Briefcase,
    BarChart3,
    Bell,
    FileText,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Play,
    Users,
    Mail,
    Phone,
    Shield,
    Sparkles,
    Compass,
    Plus,
} from 'lucide-react';


const teamMembers = [
    {
        name: "Nhor SokSoPheakTra",
        role: "Frontend Developer",
        desc: "Team Member 1",
        image: "https://i.pinimg.com/736x/1f/43/3b/1f433b6f944fda6464e9b807ae48567d.jpg" // Paste your URL here
    },
    {
        name: "Chhay MengKim",
        role: "Frontend Developer",
        desc: "Team Member 2",
        image: "https://i.pinimg.com/736x/44/07/91/44079103a2a31cdb1e07bbc42c1a4171.jpg"
    },
    {
        name: "Choub Vichet",
        role: "Backend Developer",
        desc: "Team Member 3",
        image: "https://i.pinimg.com/736x/d2/04/d7/d204d7256977f11f733a7ddd73c92e5e.jpg"
    }
];


const LandingPage = () => {

    // 1. Get the current token and the navigation tool
    const { token } = useAuth();
    const navigate = useNavigate();

    // 2. Check for the token as soon as the page loads
    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800">
            {/* ────────── Public Navbar ────────── */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-all">
                            <Briefcase className="w-5.5 h-5.5" />
                        </div>
                        <span className="font-extrabold text-xl bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 bg-clip-text text-transparent">
                            Career-Bound
                        </span>
                    </Link>

                    {/* CTAs */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-sm shadow-blue-100 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ────────── Hero Section ────────── */}
            <header className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background decorative blobs */}
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Left text column */}
                    <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Next-Gen Application CRM
                        </div>

                        <h1 className="text-5xl lg:text-6.5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Track Your Job Applications{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Smartly
                            </span>
                        </h1>

                        <p className="text-gray-500 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Stop losing opportunities in messy spreadsheets. Keep your resume, job history, and reminders organized in one premium, consolidated platform.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all active:scale-[0.98] group"
                            >
                                Get Started Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-base font-semibold rounded-2xl hover:border-gray-300 transition-all"
                            >
                                <Play className="w-4 h-4 fill-current text-gray-400" />
                                View Demo
                            </Link>
                        </div>
                    </div>

                    {/* Right interactive dashboard mockup (HTML/CSS) */}
                    <div className="lg:col-span-6 flex justify-center lg:justify-end">
                        <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200/80 shadow-2xl p-6 relative overflow-hidden animate-[float_6s_ease-in-out_infinite]">
                            {/* Dashboard header mock */}
                            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold text-gray-900 leading-none">John Doe</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Frontend Developer</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">
                                    Active Hunt
                                </span>
                            </div>

                            {/* Stat cards mock */}
                            <div className="grid grid-cols-3 gap-3 my-5">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Tracked</p>
                                    <p className="text-xl font-extrabold text-gray-900 mt-0.5">14</p>
                                </div>
                                <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-purple-500 uppercase">Interviews</p>
                                    <p className="text-xl font-extrabold text-purple-600 mt-0.5">3</p>
                                </div>
                                <div className="bg-green-50/30 border border-green-100 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-green-500 uppercase">Offers</p>
                                    <p className="text-xl font-extrabold text-green-600 mt-0.5">1</p>
                                </div>
                            </div>

                            {/* Jobs mock */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Recent opportunities</p>
                                
                                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Stripe</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Product Engineer</p>
                                    </div>
                                    <span className="px-2.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                                        Applied
                                    </span>
                                </div>

                                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Google</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">UX Designer</p>
                                    </div>
                                    <span className="px-2.5 py-0.5 text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-100 rounded-full">
                                        Interview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ────────── Features Grid ────────── */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-gray-500 mt-3 text-base">
                            Organize your credentials, monitor ongoing applications, and set smart reminders to stay ahead of recruiters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Applications</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Keep a tidy workspace of all active jobs, application notes, and dates in an interactive CRM layout.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Analytics</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Visualize your application success metrics, offers received, and pipeline dynamics on a sleek overview board.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Interview Reminders</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Get visual alerts for overdue tasks, upcoming follow-ups, and calendar deadlines due today.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Management</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Select and map professional templates to instantly generate tailored resumes for specific job listings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────── Mission Section ("The Chaos of the Hunt") ────────── */}
            <section className="py-20 lg:py-28 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold mb-4">
                            <XCircle className="w-3.5 h-3.5" />
                            The Chaos of the Hunt
                        </div>
                        <h2 className="text-3.5xl lg:text-4.5xl font-extrabold text-gray-900 leading-tight">
                            Messy Sheets & Lost Emails are Costing You Offers
                        </h2>
                        <p className="text-gray-500 mt-4 text-base leading-relaxed">
                            Job hunting is difficult enough. Managing it through plain text files, generic document templates, and missed follow-up notifications turns organization into a second full-time job.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <XCircle className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Losing track of interview dates and recuited contacts.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <XCircle className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Creating brand new resume copies from scratch for every single post.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            The Consolidated Solution
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Say Hello to Career-Bound
                        </h3>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            We consolidate all tracking parameters into a single, cohesive hub. Instantly map custom credentials to pre-approved layouts, log recruiters, and receive smart reminder updates.
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Interactive status selectors update pipelines dynamically.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Urgent overdue detections alert you to missed deadlines.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────── Team Section ────────── */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            The Minds Behind the Mission
                        </h2>
                        <p className="text-gray-500 mt-3 text-base">
                            We build premium productivity platforms to optimize and elevate your career narrative.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden p-6 text-center space-y-4 hover:shadow-md transition-all group">
                                {/* Image Container */}
                                <div className="w-28 h-28 rounded-full mx-auto p-1 border-2 border-blue-100 shadow-sm group-hover:border-blue-500 transition-colors">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-full rounded-full object-cover bg-white"
                                        onError={(e) => {
                                            // If link breaks, show a default gray circle
                                            e.target.src = "https://ui-avatars.com/api/?name=" + member.name;
                                        }}
                                    />
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
                                        {member.role}
                                    </p>
                                </div>
                                <p className="text-gray-400 text-sm italic">
                                    "{member.desc}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── Footer ────────── */}
            <footer className="bg-slate-900 text-gray-400 py-12 border-t border-slate-800 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white">Career-Bound</span>
                    </div>

                    <p className="text-xs">
                        &copy; 2026 Career-Bound. All rights reserved. Created for professional growth.
                    </p>
                </div>
            </footer>

            {/* Float animation definition */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
