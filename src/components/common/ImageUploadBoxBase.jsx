import { useRef, useState, useEffect } from 'react';
import { File, CloudUpload, X, FolderOpen } from 'lucide-react';

const ImageUploadBoxBase = ({ src, onChange, onDelete }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(src || null);

    useEffect(() => {
        setPreview(src || null);
    }, [src]);

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        onChange?.({
            previewUrl: objectUrl,
            file,
            isNewFile: true
        });
    }
};

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange({ target: { files: [file] } });
    };

    const handleDragOver = (e) => e.preventDefault();
    const triggerFileInput = () => fileInputRef.current?.click();

    const clearImage = () => {
        setPreview(null);
        onDelete?.();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={triggerFileInput}
            className={`pt-6 p-3 mb-4 text-center cursor-pointer transition-all duration-200
                ${preview ? '' : 'border-2 border-dashed rounded-lg border-gray-300'}
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {preview ? (
                <div className='relative bg-gray-100 border border-gray-300'>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerFileInput();
                            }}
                            title='Đổi ảnh'
                            className="p-2 bg-green-500 text-white rounded-3xl hover:bg-green-700 transition absolute top-3 right-13"
                        >
                        <FolderOpen className='w-4 h-4' />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            title='Xóa ảnh'
                            className="p-2 bg-red-500 text-white rounded-3xl hover:bg-red-700 transition absolute top-3 right-3"
                        >
                            <X className='w-4 h-4'/>
                        </button>
                    </div>
                    <img src={preview} alt="Preview" className="mx-auto rounded-md" />
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                        <File className="w-16 h-16 text-gray-300" strokeWidth={0.5} />
                        <CloudUpload className="w-7 h-7 text-white absolute bottom-0 right-0 bg-amber-500 rounded-xl p-1 shadow" />
                    </div>

                    <div>
                        <span className="text-gray-900 underline cursor-pointer mt-2">
                            Nhấn để chọn ảnh
                        </span>
                        <span className="text-gray-900"> hoặc kéo thả ảnh từ thư mục</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploadBoxBase;
