import React from "react";

/**
 * Simple image URL input with preview.
 * In production this would be a real file uploader.
 */
const ImageUploader = ({ label = "Image URL", value, onChange, name }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold font-sans text-[#6F665E] uppercase tracking-wider">
        {label}
      </label>
      <input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-3 rounded-2xl border border-[#E7DED3] bg-white text-[#2F241D] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B85C38]/30 focus:border-[#B85C38] transition placeholder:text-[#6F665E]/50"
      />
      {value && (
        <div className="mt-2 rounded-xl overflow-hidden border border-[#E7DED3] bg-neutral-50">
          <img loading="lazy" decoding="async"
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
