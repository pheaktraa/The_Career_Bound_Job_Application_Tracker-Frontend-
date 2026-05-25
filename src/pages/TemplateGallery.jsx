import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

const TemplateGallery = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/template');
                const data =
                    response.data.templates ||
                    response.data.data ||
                    response.data ||
                    [];
                setTemplates(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch templates:', err);
                setTemplates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleUseTemplate = (template) => {
        const id = template.template_id ?? template.id;
        navigate(`/cv-builder?template_id=${id}`);
    };

    /* ───────────── Skeleton card ───────────── */
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-56 bg-gray-100" />
            <div className="p-6 space-y-3">
                <div className="h-5 w-3/5 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-4/5 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-5">
                    <FileText className="w-7 h-7" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    Choose Your CV Template
                </h1>
                <p className="text-gray-500 mt-3 text-lg leading-relaxed">
                    Select a professional design to build your resume.
                    <br className="hidden sm:block" />
                    Expertly curated for your career growth.
                </p>
            </div>

            {/* ── Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : templates.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                        No templates available yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        Check back soon — new designs are added regularly.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {templates.map((template) => {
                        const id = template.template_id ?? template.id;
                        return (
                            <div
                                key={id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Preview Image */}
                                <div className="relative h-56 bg-gray-50 overflow-hidden">
                                    {template.image_url ? (
                                        <img
                                            src={template.image_url}
                                            alt={template.template_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${
                                            template.image_url ? 'hidden' : ''
                                        }`}
                                        style={template.image_url ? { display: 'none' } : {}}
                                    >
                                        <ImageIcon className="w-14 h-14 text-blue-200 mb-2" />
                                        <span className="text-sm text-blue-300 font-medium">
                                            Preview
                                        </span>
                                    </div>
                                </div>

                                {/* Info + Action */}
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 text-lg truncate">
                                        {template.template_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 min-h-[2.5rem]">
                                        {template.description || 'A beautifully designed resume template.'}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => handleUseTemplate(template)}
                                        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all cursor-pointer group/btn"
                                    >
                                        Use Template
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TemplateGallery;
