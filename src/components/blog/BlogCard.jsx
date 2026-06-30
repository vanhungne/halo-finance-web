import { Link } from "react-router-dom";
import { ArrowRight, Globe, GlobeLock, Clock, Tag } from "lucide-react";

const BlogCard = ({ mockBlogs }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {mockBlogs.map((blog) => (
                <div key={blog.id} className="p-6 shadow-md rounded-xl bg-white hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                        <div className="w-full aspect-[16/9] overflow-hidden rounded-lg border border-slate-200">
                            <img
                                src={blog.thumbnailUrl}
                                alt="blog cover"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {blog.isPublished ? (
                                <Globe className="w-7 h-7 text-white absolute top-2 right-2 bg-emerald-500 rounded-xl p-1 shadow-md" />
                            ) : (
                                <GlobeLock className="w-7 h-7 text-white absolute top-2 right-2 bg-rose-500 rounded-xl p-1 shadow-md" />
                            )}
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">Cập nhập lần cuối: {blog.lastUpdatedTime}</span>
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-amber-600" />
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-semibold shadow-sm">
                                <span>{blog.category.icon}</span>
                                <span>{blog.category.name}</span>
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 mt-2">
                            {blog.title}
                        </h2>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <Link
                            to={blog.id}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <span>Xem chi tiết</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogCard;
