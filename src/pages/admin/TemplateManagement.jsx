import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Trash2, Edit3, Plus, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const EMPTY_FORM = {
    template_name: '',
    description: '',
    image_url: '',
    template_file: '',
};

const TemplateManagement = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    /* ───────────── Fetch ───────────── */
    const fetchTemplates = useCallback(async () => {
        try {
            setLoading(true);
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
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    /* ───────────── Modal helpers ───────────── */
    const openAddModal = () => {
        setEditingTemplate(null);
        setFormData(EMPTY_FORM);
        setModalOpen(true);
    };

    const openEditModal = (template) => {
        setEditingTemplate(template);
        setFormData({
            template_name: template.template_name || '',
            description: template.description || '',
            image_url: template.image_url || '',
            template_file: template.template_file || '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTemplate(null);
        setFormData(EMPTY_FORM);
    };

    /* ───────────── CRUD ───────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingTemplate) {
                const id = editingTemplate.template_id ?? editingTemplate.id;
                // FIXED: Send 'id' and 'template_id' as query parameters to satisfy the backend
                await api.put('/template', formData, { 
                    params: { id: id, template_id: id } 
                });
            } else {
                await api.post('/template', formData);
            }
            closeModal();
            await fetchTemplates();
        } catch (err) {
            console.error('Failed to save template:', err);
            alert('Failed to save template. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (template) => {
        const id = template.template_id ?? template.id;
        if (!window.confirm(`Delete "${template.template_name}"? This cannot be undone.`)) return;

        try {
            // FIXED: Send both 'id' and 'template_id' so Laravel validation doesn't block it
            await api.delete('/template', { 
                params: { id: id, template_id: id } 
            });
            await fetchTemplates();
        } catch (err) {
            console.error('Failed to delete template:', err);
            alert('Failed to delete template.');
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    /* ───────────── Skeleton cards ───────────── */
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-100" />
            <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
            <div className="px-5 pb-5 flex gap-3">
                <div className="h-9 flex-1 bg-gray-100 rounded-xl" />
                <div className="h-9 flex-1 bg-gray-100 rounded-xl" />
            </div>
        </div>
    );

    /* ───────────── Render ───────────── */
    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <LayoutGrid className="w-8 h-8 text-blue-600" />
                        Template Management
                    </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Create and manage resume templates for your users.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New Template
                </button>
            </div>

            {/* ── Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : templates.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center">
                    <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No templates yet.</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Click "+ Add New Template" to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {templates.map((template) => {
                        const id = template.template_id ?? template.id;
                        return (
                            <div
                                key={id}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {/* Preview Image */}
                                <div className="relative h-48 bg-gray-50 overflow-hidden">
                                    {template.image_url ? (
                                        <img
                                            src={template.image_url}
                                            alt={template.template_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${
                                            template.image_url ? 'hidden' : ''
                                        }`}
                                        style={template.image_url ? { display: 'none' } : {}}
                                    >
                                        <ImageIcon className="w-12 h-12 text-blue-300" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                                        {template.template_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
                                        {template.description || 'No description provided.'}
                                    </p>
                                    {template.template_file && (
                                        <span className="inline-block mt-3 px-2.5 py-1 text-xs font-mono text-blue-700 bg-blue-50 rounded-lg">
                                            {template.template_file}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-5 pb-5 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(template)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 active:scale-[0.97] transition-all cursor-pointer"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(template)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 active:scale-[0.97] transition-all cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Panel */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingTemplate ? 'Edit Template' : 'Add New Template'}
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Template Name */}
                            <div>
                                <label
                                    htmlFor="template_name"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Template Name
                                </label>
                                <input
                                    id="template_name"
                                    name="template_name"
                                    type="text"
                                    required
                                    value={formData.template_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Modern Professional"
                                    className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-gray-200 transition-shadow"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of this template..."
                                    className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-gray-200 transition-shadow resize-none"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label
                                    htmlFor="image_url"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Preview Image URL
                                </label>
                                <input
                                    id="image_url"
                                    name="image_url"
                                    type="text"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/preview.png"
                                    className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-gray-200 transition-shadow"
                                />
                            </div>

                            {/* Template File */}
                            <div>
                                <label
                                    htmlFor="template_file"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Template File Identifier
                                </label>
                                <input
                                    id="template_file"
                                    name="template_file"
                                    type="text"
                                    required
                                    value={formData.template_file}
                                    onChange={handleChange}
                                    placeholder="e.g. modern_professional"
                                    className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-mono placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-200 border border-gray-200 transition-shadow"
                                />
                                <p className="text-xs text-gray-400 mt-1.5">
                                    The Laravel Blade file name without the extension.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {submitting && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {editingTemplate ? 'Save Changes' : 'Create Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal keyframe (injected once) ── */}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default TemplateManagement;
