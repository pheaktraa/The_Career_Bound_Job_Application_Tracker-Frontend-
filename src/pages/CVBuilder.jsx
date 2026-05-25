import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
    User,
    Briefcase,
    Mail,
    Phone,
    FileText,
    BookOpen,
    Sparkles,
    Heart,
    Loader2,
    ArrowLeft,
    Image as ImageIcon,
    AlertCircle,
    Send,
} from 'lucide-react';
import api from '../api/axios';

const INITIAL_FORM = {
    template_id: '',
    fullname: '',
    job_title: '',
    email: '',
    phone_number: '',
    introduction: '',
    project_name: '',
    describe_project: '',
    education: '',
    skills: '',
    hobbies: '',
};

const inputClass =
    'w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all';

/* ── Reusable field ── */
const Field = ({ label, icon: Icon, children }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            {label}
        </label>
        {children}
    </div>
);

/* ── Section header ── */
const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
    </div>
);

const CVBuilder = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const templateId = searchParams.get('template_id') || '';

    const [formData, setFormData] = useState({
        ...INITIAL_FORM,
        template_id: templateId,
    });
    const [templateInfo, setTemplateInfo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    /* ── Fetch selected template info for the sidebar ── */
    useEffect(() => {
        if (!templateId) return;
        const fetchTemplate = async () => {
            try {
                const response = await api.get('/template');
                const list =
                    response.data.templates ||
                    response.data.data ||
                    response.data ||
                    [];
                const arr = Array.isArray(list) ? list : [];
                const match = arr.find(
                    (t) =>
                        String(t.template_id ?? t.id) === String(templateId)
                );
                if (match) setTemplateInfo(match);
            } catch (err) {
                console.error('Failed to fetch template info:', err);
            }
        };
        fetchTemplate();
    }, [templateId]);

    /* ── Handlers ── */
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setSubmitting(true);
            await api.post('/generatecv', formData);
            alert('CV Generated Successfully!');
            navigate('/');
        } catch (err) {
            console.error('Failed to generate CV:', err);
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to generate CV. Please check your inputs and try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Page header ── */}
            <div className="flex items-center gap-4">
                <Link
                    to="/templates"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        Build Your CV
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Fill in your details and generate a professional resume
                        in seconds.
                    </p>
                </div>
            </div>

            {/* ── Error banner ── */}
            {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ────────── Left: Form (2 cols) ────────── */}
                <form
                    onSubmit={handleSubmit}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* ── Personal Info ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <SectionHeader
                            title="Personal Information"
                            subtitle="Basic details that appear at the top of your CV."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Full Name" icon={User}>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    required
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Job Title" icon={Briefcase}>
                                <input
                                    type="text"
                                    name="job_title"
                                    value={formData.job_title}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Developer"
                                    required
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Email" icon={Mail}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Phone Number" icon={Phone}>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    required
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Summary ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <SectionHeader
                            title="Professional Summary"
                            subtitle="A brief introduction about yourself and your career goals."
                        />
                        <Field label="Introduction" icon={FileText}>
                            <textarea
                                name="introduction"
                                rows={4}
                                value={formData.introduction}
                                onChange={handleChange}
                                placeholder="Write a short summary highlighting your experience and strengths..."
                                className={`${inputClass} resize-none`}
                            />
                        </Field>
                    </div>

                    {/* ── Experience ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <SectionHeader
                            title="Experience & Activities"
                            subtitle="Highlight your work history, volunteer roles, or key projects.."
                        />
                        <div className="space-y-5">
                            <Field label="Role / Position" icon={Briefcase}>
                                <input
                                    type="text"
                                    name="project_name"
                                    value={formData.project_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Intern at TechCorp"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Description" icon={FileText}>
                                <textarea
                                    name="describe_project"
                                    rows={4}
                                    value={formData.describe_project}
                                    onChange={handleChange}
                                    placeholder="Describe your responsibilities, achievements, and impact..."
                                    className={`${inputClass} resize-none`}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Details ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <SectionHeader
                            title="Additional Details"
                            subtitle="Education, skills, and personal interests."
                        />
                        <div className="space-y-5">
                            <Field label="Education" icon={BookOpen}>
                                <textarea
                                    name="education"
                                    rows={3}
                                    value={formData.education}
                                    onChange={handleChange}
                                    placeholder="e.g. BSc Computer Science, University of Example (2020–2024)"
                                    className={`${inputClass} resize-none`}
                                />
                            </Field>
                            <Field label="Skills" icon={Sparkles}>
                                <textarea
                                    name="skills"
                                    rows={3}
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="e.g. React, Node.js, Figma, Team Leadership"
                                    className={`${inputClass} resize-none`}
                                />
                            </Field>
                            <Field label="Hobbies" icon={Heart}>
                                <textarea
                                    name="hobbies"
                                    rows={2}
                                    value={formData.hobbies}
                                    onChange={handleChange}
                                    placeholder="e.g. Reading, Photography, Open-source contributions"
                                    className={`${inputClass} resize-none`}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shadow-blue-200"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        {submitting ? 'Generating...' : 'Generate CV'}
                    </button>
                </form>

                {/* ────────── Right: Template Info (1 col) ────────── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Template preview */}
                            <div className="relative h-52 bg-gray-50 overflow-hidden">
                                {templateInfo?.image_url ? (
                                    <img
                                        src={templateInfo.image_url}
                                        alt={templateInfo.template_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${
                                        templateInfo?.image_url ? 'hidden' : ''
                                    }`}
                                    style={
                                        templateInfo?.image_url
                                            ? { display: 'none' }
                                            : {}
                                    }
                                >
                                    <ImageIcon className="w-12 h-12 text-blue-200 mb-2" />
                                    <span className="text-sm text-blue-300 font-medium">
                                        Template Preview
                                    </span>
                                </div>
                            </div>

                            {/* Template details */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Selected Template
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                                        {templateInfo?.template_name ||
                                            `Template #${templateId || '—'}`}
                                    </h3>
                                </div>

                                {templateInfo?.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {templateInfo.description}
                                    </p>
                                )}

                                {templateId && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="inline-block px-2.5 py-1 text-xs font-mono text-blue-700 bg-blue-50 rounded-lg">
                                            ID: {templateId}
                                        </span>
                                        {templateInfo?.template_file && (
                                            <span className="inline-block px-2.5 py-1 text-xs font-mono text-gray-500 bg-gray-50 rounded-lg">
                                                {templateInfo.template_file}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <Link
                                    to="/templates"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mt-2"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Change Template
                                </Link>
                            </div>
                        </div>

                        {/* Tips card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                            <h4 className="text-sm font-bold text-blue-900 mb-2">
                                💡 Quick Tips
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    Keep your summary under 3 sentences.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    Use action verbs in your project descriptions.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    List skills relevant to your target role.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVBuilder;
