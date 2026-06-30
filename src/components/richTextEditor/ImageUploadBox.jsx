import { NodeViewWrapper } from "@tiptap/react";
import ImageUploadBoxBase from "../common/ImageUploadBoxBase";
import { uploadBlogImageApi } from "../../services/blog";
import { useState } from "react";

const ImageUploadBox = ({ node, updateAttributes, deleteNode }) => {
  const [uploading, setUploading] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("imageFile", file);
    const response = await uploadBlogImageApi(formData);
    return response.url;
  };

  return (
    <NodeViewWrapper className="relative inline-block w-full max-w-auto">
      <ImageUploadBoxBase
        src={node.attrs.src}
        onChange={async ({ previewUrl, file }) => {

          updateAttributes({ src: previewUrl });
          setUploading(true);

          try {
            const cloudUrl = await uploadImageToCloudinary(file);
            updateAttributes({ src: cloudUrl });
            console.log("Upload success");
          } catch (err) {
            console.error("Upload failed", err);
          } finally {
            setUploading(false);
          }
        }}
        onDelete={deleteNode}
      />

      {uploading && (
        <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center z-10 rounded">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
          </div>
          <p className="text-black text-xs font-medium mt-2">Đang tải ảnh lên...</p>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ImageUploadBox;
