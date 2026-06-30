import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertModal from "../../components/modal/AlertModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { Globe, GlobeLock, SquarePen, Trash2, Save, X, Edit2 } from 'lucide-react';
import isEqual from "lodash.isequal";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import ImageUploadBoxBase from "../../components/common/ImageUploadBoxBase";
import WaitingModal from "../../components/modal/WaitingModal"
import { getDefaultCategoryApi } from "../../services/category";
import { getBlogDetailApi, deleteBlogApi, updateBlogApi } from "../../services/blog";

const MODAL_CONTENT = {
    EDIT: {
        title: "Cập nhập bài viết",
        description: "Bạn có chắc muốn lưu lại thay đổi của bài viết này?",
        confirmText: "Có",
        confirmColor: "green",
    },
    DELETE: {
        title: "Xóa bài viết",
        description: "Bạn có chắc muốn xóa bài viết này?",
        confirmText: "Xóa",
        confirmColor: "red",
    },
};

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newFile, setNewFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [blog, setBlog] = useState(null);
    const [awaitResponse, setAwaitResponse] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        isOpen: false,
        type: "success",
        message: "",
    });

    const [form, setForm] = useState({
        title: "",
        contentJson: "",
        contentHtml: "",
        isPublished: "",
        thumbnailUrl: null,
        categoryId: "",
    });

    // Kiểm tra xem form edit đã có chỉnh sửa chưa
    const normalizedForm = {
        ...form,
        contentJson: typeof form.contentJson === "string"
            ? form.contentJson
            : JSON.stringify(form.contentJson),
        thumbnailUrl: form.thumbnailUrl?.startsWith("blob:")
            ? blog?.thumbnailUrl
            : form.thumbnailUrl,
    };

    const parsedFormContent = safeParse(normalizedForm.contentJson);
    const parsedBlogContent = safeParse(blog?.contentJson);

    function safeParse(value) {
        try {
            return JSON.parse(value || "{}");
        } catch {
            return value;
        }
    }
    const isChanged = blog
        ? !isEqual(
            {
                title: normalizedForm.title?.trim(),
                contentJson: parsedFormContent,
                thumbnailUrl: normalizedForm.thumbnailUrl,
                categoryId: normalizedForm.categoryId,
                isPublished: normalizedForm.isPublished,
            },
            {
                title: blog.title?.trim(),
                contentJson: parsedBlogContent,
                thumbnailUrl: blog.thumbnailUrl,
                categoryId: blog.category?.id,
                isPublished: blog.isPublished,
            }
        )
        : false;

    //-------------------------------------------------------

    useEffect(() => {
        const fetchCategories = async () => {
            if (!categories || categories.length === 0) {
                const data = await getDefaultCategoryApi();
                setCategories(data.items);
            }
        };

        fetchCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (form.title == null) newErrors.title = "Tiêu đề không được để trống.";
        if (form.categoryId == null) newErrors.categoryId = "Vui lòng chọn thể loại.";
        if (form.thumbnailUrl == null) newErrors.thumbnailUrl = "Ảnh bìa là bắt buộc.";
        if (form.contentHtml == null) newErrors.contentHtml = "Nội dung không được để trống.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleImageChange = ({ previewUrl, file }) => {
        setForm((prev) => ({ ...prev, thumbnailUrl: previewUrl }));
        setNewFile(file);
        setErrors((prev) => ({ ...prev, thumbnailUrl: "" }));
    };

    const handleImageDelete = () => {
        setForm((prev) => ({ ...prev, thumbnailUrl: null }));
        setNewFile(null);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (value) => {
        setForm((prev) => ({ ...prev, categoryId: value }));
        setErrors((prev) => ({ ...prev, categoryId: "" }));
    };

    const handleStatusChange = (value) => {
        setForm((prev) => ({ ...prev, isPublished: value === "true" }));
    };

    const handleEditorChange = (val) => {
        setForm((prev) => ({
            ...prev,
            contentJson: JSON.stringify(val.json),
            contentHtml: val.html
        }));
        if (html) setErrors((prev) => ({ ...prev, contentHtml: "" }));
    };

    const handleConfirm = async () => {
        setLoading(true);
        setAwaitResponse(true);
        return new Promise(async (resolve) => {
            try {
                if (modalType === "EDIT") {
                    const formData = new FormData();
                    formData.append("Title", form.title);
                    formData.append("ContentJson", typeof form.contentJson === "string" ? form.contentJson : JSON.stringify(form.contentJson));
                    formData.append("ContentHtml", form.contentHtml);
                    formData.append("IsPublished", form.isPublished);
                    formData.append("CategoryId", form.categoryId);
                    if (newFile instanceof File) {
                        formData.append("ThumbnailUrl", newFile);
                    }
                    await updateBlogApi(id, formData);

                    setForm({
                        title: "",
                        contentJson: "",
                        contentHtml: "",
                        isPublished: null,
                        thumbnailUrl: null,
                        categoryId: "",
                    });
                    setAwaitResponse(false);
                    setLoading(false);
                    setAlert({
                        isOpen: true,
                        type: "success",
                        message: "Cập nhập bài viết thành công!",
                    });

                    setTimeout(() => {
                        setAlert((prev) => ({ ...prev, isOpen: false }));
                        setIsEditing(false);
                        fetchData();
                    }, 3000);

                }

                if (modalType === "DELETE") {
                    await deleteBlogApi(blog.id);
                    setAwaitResponse(false);
                    setLoading(false);
                    setAlert({
                        isOpen: true,
                        type: "success",
                        message: "Xóa bài viết thành công!",
                    });

                    setTimeout(() => {
                        setAlert((prev) => ({ ...prev, isOpen: false }));
                        navigate("/admin/blogs");
                    }, 3000);
                }
            } catch (error) {
                setAlert({
                    isOpen: true,
                    type: "error",
                    message: `${modalType === "EDIT" ? "Cập nhập" : "Xóa"} bài viết thất bại!`,
                });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, isOpen: false }));
                }, 3000);
                console.log(error);
            } finally {
                setLoading(false);
                resolve();
            }
        });
    };

    const content = MODAL_CONTENT[modalType] || {};

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const data = await getBlogDetailApi(id);
            setBlog(data);
        } catch (error) {
            console.error("API failed:", error);
        }
    };

    // Initialize form when starting edit mode
    const startEditing = () => {
        setForm({
            title: blog.title,
            contentJson: JSON.parse(blog.contentJson) || { type: "doc", content: [] },
            contentHtml: blog.contentHtml ?? "",
            thumbnailUrl: blog.thumbnailUrl,
            categoryId: blog.category.id,
            isPublished: blog.isPublished,
        });
        setIsEditing(true);
    };

    // Reset form when canceling edit
    const cancelEditing = () => {
        setIsEditing(false);
        setForm({
            title: "",
            contentJson: null,
            thumbnailUrl: "",
            imageFile: null,
            categoryId: null,
            isPublished: null,
        });
    };

    // Check if form is valid
    const isFormValid = form.title && form.contentJson && form.thumbnailUrl;

    if (!blog) {
        return <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center z-10 rounded">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
            </div>
            <p className="text-black text-xs font-medium mt-2">Đang tải ảnh lên...</p>
        </div>;
    }

    return (
        <div className="lg:space-y-8 lg:p-6 space-y-4 p-3 sm:space-y-6 sm:p-4 bg-slate-50 min-h-screen">
            <AlertModal
                isOpen={alert.isOpen}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, isOpen: false })}
            />
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                title={content.title}
                description={content.description}
                confirmText={content.confirmText}
                confirmColor={content.confirmColor}
            />
            <WaitingModal isOpen={awaitResponse} />
            <div className={`flex flex-col items-center justify-center` +
                (isEditing
                    ? ''
                    : ' bg-white rounded-2xl max-w-3xl m-auto p-6')}>
                <div className="text-right space-x-2">
                    {/* Delete Button */}
                    <button
                        onClick={() => openModal("DELETE")}
                        className="text-red-500 text-sm hover:text-red-800"
                    >
                        <Trash2 />
                    </button>

                    {/* Edit/Save Button */}
                    <button
                        onClick={() => {
                            if (isEditing) {
                                openModal("EDIT");
                            } else {
                                startEditing();
                            }
                        }}
                        disabled={isEditing && !isFormValid}
                        className={
                            `px-2 py-2 text-sm rounded ` +
                            (isEditing
                                ? 'text-green-500 hover:text-green-600'
                                : 'text-blue-500 hover:text-blue-600') +
                            (isEditing && !isFormValid
                                ? ' opacity-50 cursor-not-allowed'
                                : '')
                        }
                    >
                        {isEditing ? <Save /> : <SquarePen />}
                    </button>

                    {/* Cancel Button (only show when editing) */}
                    {isEditing && (
                        <button
                            onClick={cancelEditing}
                            className="py-2 text-sm rounded text-gray-400 hover:text-gray-500"
                        >
                            <X />
                        </button>
                    )}
                </div>
                {isEditing ? (
                    <form className="max-w-4xl mx-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (validateForm()) {
                                openModal("EDIT");
                            }
                        }}>
                        <div className="grid grid-cols-1 sm:grid-cols-9 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            <div className="space-y-2 bg-white mb-3 p-6 lg:col-span-2 sm:col-span-5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tiêu đề *
                                </label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Enter title..."
                                    value={form.title}
                                    onChange={handleChange}
                                    className={`w-full p-3 text-lg mb-2 rounded border ${errors.title ? "border-red-500" : "border-gray-300"
                                        } focus:outline-none focus:ring-2`}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            </div>
                            <div className="space-y-2 bg-white mb-3 p-6 lg:col-span-1 sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Thể loại *
                                </label>
                                <Select
                                    value={form.categoryId}
                                    onValueChange={handleSelectChange}>
                                    <SelectTrigger className={`w-full bg-white text-sm ${errors.categoryId ? "border-red-500" : ""
                                        }`}>
                                        <SelectValue key={blog.category.id} placeholder="Chọn thể loại">
                                            <>{blog.category.icon}</> {blog.category.name || "Chọn thể loại"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                <>{category.icon}</> {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && (
                                    <p className="text-red-500 text-sm">{errors.categoryId}</p>
                                )}
                                <label className="block text-sm font-medium text-gray-700">
                                    Trạng thái *
                                </label>
                                <Select value={form.isPublished} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-full bg-white text-sm">
                                        <SelectValue value={form.isPublished ? "true" : "false"} className="flex" placeholder="Lọc theo trạng thái">
                                            {form.isPublished ? (
                                                <>
                                                    <Globe size={14} className="mr-2" />
                                                    Công khai
                                                </>
                                            ) : (
                                                <>
                                                    <GlobeLock size={14} className="mr-2" />
                                                    Riêng tư
                                                </>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="true" onSelect={handleStatusChange}>
                                            <Globe size={14} className="mr-2" />
                                            Công khai
                                        </SelectItem>
                                        <SelectItem value="false" onSelect={handleStatusChange}>
                                            <GlobeLock size={14} className="mr-2" />
                                            Riêng tư
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full space-y-2 bg-white mb-3 p-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Ảnh bìa *
                            </label>
                            <ImageUploadBoxBase
                                src={newFile ? URL.createObjectURL(newFile) : form.thumbnailUrl}
                                onChange={handleImageChange}
                                onDelete={handleImageDelete}
                            />
                            {errors.thumbnailUrl && (
                                <p className="text-red-500 text-sm">{errors.thumbnailUrl}</p>
                            )}
                        </div>

                        <div className="w-full space-y-2 bg-white mb-3 p-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Nội dung *
                            </label>
                            <RichTextEditor
                                value={form.contentJson}
                                onChange={handleEditorChange}
                            />
                            {errors.contentHtml && (
                                <p className="text-red-500 text-sm">{errors.contentHtml}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded transition-colors ${loading || !isChanged ? 'bg-gray-100 cursor-not-allowed' : 'bg-amber-200 hover:bg-amber-300'}`}
                            disabled={loading || !isChanged}
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </form>
                ) : (
                    <>
                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-snug">
                            {blog.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-sm mb-6 pb-4 border-b border-slate-200">
                            {/* Status */}
                            {blog.isPublished ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md font-medium">
                                    <Globe size={14} />
                                    Công khai
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md font-medium">
                                    <GlobeLock size={14} />
                                    Riêng tư
                                </span>
                            )}

                            {/* Category */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md font-medium">
                                {blog.category.icon} {blog.category.name}
                            </span>

                            {/* Last Updated */}
                            <span className="text-slate-600">
                                • Cập nhật: {blog.lastUpdatedTime}
                            </span>
                        </div>

                        {/* Image */}
                        {blog.thumbnailUrl && (
                            <img
                                src={blog.thumbnailUrl}
                                alt={blog.title}
                                className="w-full h-auto rounded-xl mb-6 shadow-sm border border-slate-100"
                            />
                        )}

                        {/* Content */}
                        <div className="prose prose-slate max-w-none tiptap">
                            <div dangerouslySetInnerHTML={{ __html: blog.contentHtml }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogDetailPage;