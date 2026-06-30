import React, { useState, useEffect } from "react";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import ImageUploadBoxBase from "../../components/common/ImageUploadBoxBase";
import AlertModal from "../../components/modal/AlertModal"
import ConfirmModal from "../../components/modal/ConfirmModal";
import WaitingModal from "../../components/modal/WaitingModal"
import { Globe, GlobeLock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { createBlogApi } from "../../services/blog";
import { getDefaultCategoryApi } from "../../services/category";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = () => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    contentJson: "",
    contentHtml: "",
    isPublished: true,
    thumbnailUrl: null,
    categoryId: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [awaitResponse, setAwaitResponse] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categories || categories.length === 0) {
        const data = await getDefaultCategoryApi();
        setCategories(data.items);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0 && !form.categoryId) {
      setForm(prev => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Tiêu đề không được để trống.";
    if (!form.categoryId) newErrors.categoryId = "Vui lòng chọn thể loại.";
    if (!form.thumbnailUrl) newErrors.thumbnailUrl = "Ảnh bìa là bắt buộc.";
    if (!form.contentHtml?.trim()) newErrors.contentHtml = "Nội dung không được để trống.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleImageChange = (data) => {
    setForm((prev) => ({ ...prev, thumbnailUrl: data.file }));
    setErrors((prev) => ({ ...prev, thumbnailUrl: "" }));
  };

  const handleImageDelete = () => {
    setForm((prev) => ({ ...prev, thumbnailUrl: null }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, isPublished: value === "true" }));
  };

  const handleEditorChange = (val) => {
    const rawHtml = val.html || "";

    const cleaned = rawHtml
      .replace(/<p><\/p>/g, "")
      .replace(/<p><br><\/p>/g, "")
      .replace(/<br>/g, "")
      .trim();

    const isEmpty = cleaned.length === 0;

    setForm((prev) => ({
      ...prev,
      contentJson: JSON.stringify(val.json),
      contentHtml: rawHtml
    }));

    if (isEmpty) {
      setErrors((prev) => ({
        ...prev,
        contentHtml: "Nội dung không được để trống"
      }));
    } else {
      setErrors((prev) => ({ ...prev, contentHtml: "" }));
    }
  };


  const handleSave = async (e) => {
    setLoading(true);
    setAwaitResponse(true);
    try {
      const formData = new FormData();
      formData.append("Title", form.title);
      formData.append("ContentJson", form.contentJson);
      formData.append("ContentHtml", form.contentHtml);
      formData.append("IsPublished", String(form.isPublished));
      formData.append("ThumbnailUrl", form.thumbnailUrl);
      formData.append("CategoryId", form.categoryId);

      const response = await createBlogApi(formData);
      setAwaitResponse(false);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Tạo bài viết thành công!",
      });

      setForm({
        title: "",
        contentJson: "",
        contentHtml: "",
        isPublished: true,
        thumbnailUrl: null,
        categoryId: "",
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        navigate(`/admin/blogs/${response}`);
      }, 3000);

    } catch (err) {
      console.error("Error:", err);
      setAlert({
        isOpen: true,
        type: "error",
        message: "Tạo bài viết thất bại!",
      });
    }

    setLoading(false);
  };

  return (
    <div className='lg:space-y-8 lg:p-6 space-y-4 p-3 sm:space-y-6 sm:p-4 bg-slate-50 min-h-screen'>
      <form className="max-w-4xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            setModalOpen(true);
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
              placeholder="Chủ đề của hôm nay là gì?"
              value={form.title}
              onChange={handleChange}
              className={`w-full p-3 text-md mb-2 rounded border ${errors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2 bg-white mb-3 p-6 lg:col-span-1 sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">
              Thể loại *
            </label>
            <Select value={form.categoryId} onValueChange={handleSelectChange}>
              <SelectTrigger className={`w-full bg-white text-sm ${errors.categoryId ? "border-red-500" : ""
                }`}>
                <SelectValue placeholder="Chọn thể loại">
                  <span className="category-icon">{categories?.[0]?.icon}</span> {categories?.[0]?.name || "Chọn thể loại"}
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
                <SelectValue value="true" className="flex" placeholder="Lọc theo trạng thái">
                  <Globe size={14} className="mr-2" />
                  Công khai
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
        <div className="space-y-2 bg-white mb-3 p-6">

          <label className="block text-sm font-medium text-gray-700">
            Ảnh bìa *
          </label>
          <ImageUploadBoxBase
            src={
              form.thumbnailUrl instanceof File
                ? URL.createObjectURL(form.thumbnailUrl)
                : form.thumbnailUrl || null
            }
            onChange={handleImageChange}
            onDelete={handleImageDelete}
          />
          {errors.thumbnailUrl && (
            <p className="text-red-500 text-sm">{errors.thumbnailUrl}</p>
          )}
        </div>

        <div className="space-y-2 bg-white mb-3 p-6">
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

          <button
            type="submit"
            className={`px-6 py-2 rounded transition-colors ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-amber-200 hover:bg-amber-300'}`}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo bài viết"}
          </button>
        </div>
      </form>

      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSave}
        title="Tạo bài viết"
        description="Bạn có chắc muốn tạo bài viết này?"
        confirmText="Có"
        confirmColor="green"
      />

      <WaitingModal isOpen={awaitResponse} />
    </div>
  );
};

export default CreateBlogPage;