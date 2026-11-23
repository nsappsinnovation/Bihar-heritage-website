import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Right-side sliding drawer for Create / Edit forms.
 *
 * Props:
 *   isOpen     — boolean
 *   onClose    — () => void
 *   title      — string
 *   onSave     — () => void
 *   children   — form fields
 */
const AdminDrawer = ({ isOpen, onClose, title = "New Item", onSave, children }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-[520px] bg-white shadow-2xl border-l border-[#E7DED3] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7DED3] bg-[#FAF8F3] shrink-0">
          <h3 className="font-cormorant text-xl font-bold text-[#2F241D]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6F665E] hover:text-[#B85C38] hover:bg-[#B85C38]/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-grow overflow-y-auto px-6 py-6 space-y-5">
          {children}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E7DED3] bg-[#FAF8F3] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold font-sans text-[#6F665E] hover:text-[#2F241D] border border-[#E7DED3] hover:border-[#2F241D]/20 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold font-sans text-white bg-[#B85C38] hover:bg-[#A0502F] transition shadow-sm cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDrawer;
