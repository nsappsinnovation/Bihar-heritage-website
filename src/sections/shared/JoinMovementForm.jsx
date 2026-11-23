import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUpload,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck,
  FiUsers,
  FiHeart,
  FiBookOpen,
  FiShield
} from "react-icons/fi";

const actionConfig = {
  volunteer: {
    title: "Become a Volunteer",
    description: "Contribute your time and skills to preserve our history.",
    badge: "Volunteer",
    icon: FiUsers,
    accent: "#7A3E3E"
  },
  report: {
    title: "Report a Heritage Site",
    description: "Help us identify and protect neglected heritage sites.",
    badge: "Heritage Report",
    icon: FiMapPin,
    accent: "#7A3E3E"
  },
  support: {
    title: "Support Restoration",
    description: "Your support makes a lasting impact on conservation.",
    badge: "Restoration Support",
    icon: FiHeart,
    accent: "#7A3E3E"
  },
  educate: {
    title: "Educate & Spread Awareness",
    description: "Inspire others to value our shared heritage.",
    badge: "Awareness Program",
    icon: FiBookOpen,
    accent: "#7A3E3E"
  },
  preserve: {
    title: "Preserve Local Stories",
    description: "Document oral histories for future generations.",
    badge: "Local Stories",
    icon: FiShield,
    accent: "#7A3E3E"
  }
};

const JoinMovementForm = ({ isOpen, onClose, selectedAction }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    actionType: selectedAction || "",
    pledge: "",
    location: "",
    siteDescription: "",
    sitePhotos: [],
    story: "",
    storyPhotos: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({ ...prev, actionType: selectedAction || "" }));
  }, [selectedAction]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const removeFile = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.actionType)
      newErrors.actionType = "Action type is missing";

    if (formData.actionType === "volunteer" && !formData.pledge.trim()) {
      newErrors.pledge = "Pledge is required";
    }

    if (formData.actionType === "report") {
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (!formData.siteDescription.trim())
        newErrors.siteDescription = "Site description is required";
    }

    if (formData.actionType === "preserve" && !formData.story.trim()) {
      newErrors.story = "Story is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Thank you for joining the movement! We'll be in touch soon.");
      onClose();
    }
  };

  if (!isOpen || !selectedAction) return null;

  const currentConfig = actionConfig[selectedAction] || actionConfig.volunteer;
  const HeaderIcon = currentConfig.icon;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#2D2926]/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#F5F1EA] rounded-[32px] shadow-[0_20px_60px_rgba(45,41,38,0.2)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-8 py-8 flex-shrink-0 flex items-start justify-between border-b border-[#D3B28C]/30 relative overflow-hidden">
            <div className="relative z-10 flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-[#F8F2EA] flex items-center justify-center text-[#7A3E3E] shrink-0 border border-[#D3B28C]/50">
                <HeaderIcon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#7A3E3E] text-[#F5F1EA] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {currentConfig.badge}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2926]">
                  {currentConfig.title}
                </h2>
                <p className="mt-2 text-sm text-[#2D2926]/70 font-sans">
                  {currentConfig.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="relative z-10 p-2 hover:bg-[#F8F2EA] rounded-full text-[#2D2926]/50 hover:text-[#7A3E3E] transition-all cursor-pointer border border-transparent hover:border-[#D3B28C]/50"
              aria-label="Close form"
            >
              <FiX size={24} />
            </button>
            {/* Subtle graphic in header */}
            <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
               <FiShield size={200} />
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 px-8 py-8 custom-scrollbar bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-5">
                <h3 className="text-[#7A3E3E] text-xs font-bold uppercase tracking-widest border-b border-[#D3B28C]/30 pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2926]/40" size={16} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                          errors.name ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                        } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2926]/40" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                          errors.phone ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                        } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2926]/40" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                          errors.email ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                        } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Dynamic Context Fields */}
              <AnimatePresence mode="wait">
                {formData.actionType === "volunteer" && (
                  <motion.div
                    key="volunteer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <h3 className="text-[#7A3E3E] text-xs font-bold uppercase tracking-widest border-b border-[#D3B28C]/30 pb-2">
                      Volunteer Commitment
                    </h3>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                        Your Pledge *
                      </label>
                      <textarea
                        name="pledge"
                        value={formData.pledge}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                          errors.pledge ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                        } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all resize-none`}
                        placeholder="Describe your volunteer commitment, skills, and how you would like to contribute..."
                      />
                      {errors.pledge && <p className="text-red-500 text-xs mt-1.5">{errors.pledge}</p>}
                    </div>
                  </motion.div>
                )}

                {formData.actionType === "report" && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <h3 className="text-[#7A3E3E] text-xs font-bold uppercase tracking-widest border-b border-[#D3B28C]/30 pb-2">
                      Heritage Site Details
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                          Site Location *
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2926]/40" size={16} />
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                              errors.location ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                            } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all`}
                            placeholder="Enter the site location address"
                          />
                        </div>
                        {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                          Condition & Historical Description *
                        </label>
                        <textarea
                          name="siteDescription"
                          value={formData.siteDescription}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                            errors.siteDescription ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                          } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all resize-none`}
                          placeholder="Describe the current physical condition and historical background of the site"
                        />
                        {errors.siteDescription && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.siteDescription}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                          Upload Photos (Optional)
                        </label>
                        <div className="border-2 border-dashed border-[#D3B28C] hover:border-[#7A3E3E] rounded-2xl p-8 text-center transition-all bg-[#F5F1EA]/30 relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "sitePhotos")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            id="sitePhotos"
                          />
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[#7A3E3E]">
                            <FiUpload size={20} />
                          </div>
                          <span className="text-sm font-bold text-[#2D2926] block">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-[#2D2926]/60 block mt-1">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </span>
                        </div>

                        {formData.sitePhotos.length > 0 && (
                           <div className="mt-4 grid grid-cols-3 gap-4">
                            {formData.sitePhotos.map((file, index) => (
                              <div
                                key={index}
                                className="relative group bg-white rounded-xl overflow-hidden border border-[#D3B28C]/50 shadow-sm"
                              >
                                <img loading="lazy" decoding="async"
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-24 object-cover"
                                />
                                <div className="absolute inset-0 bg-[#2D2926]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index, "sitePhotos")}
                                    className="w-8 h-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                                  >
                                    <FiX size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.actionType === "preserve" && (
                  <motion.div
                    key="preserve"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <h3 className="text-[#7A3E3E] text-xs font-bold uppercase tracking-widest border-b border-[#D3B28C]/30 pb-2">
                      Story Preservation
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                          Share your story, tradition, or cultural memory *
                        </label>
                        <textarea
                          name="story"
                          value={formData.story}
                          onChange={handleInputChange}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F5F1EA]/50 border ${
                            errors.story ? "border-red-500 focus:border-red-500" : "border-[#D3B28C]/50 focus:border-[#7A3E3E]"
                          } text-[#2D2926] text-sm focus:outline-none focus:bg-white transition-all resize-none`}
                          placeholder="Share your local story, tradition, or historic account in detail"
                        />
                        {errors.story && <p className="text-red-500 text-xs mt-1.5">{errors.story}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#2D2926]/70 mb-2 uppercase tracking-wider">
                          Upload Related Photos (Optional)
                        </label>
                        <div className="border-2 border-dashed border-[#D3B28C] hover:border-[#7A3E3E] rounded-2xl p-8 text-center transition-all bg-[#F5F1EA]/30 relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "storyPhotos")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            id="storyPhotos"
                          />
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[#7A3E3E]">
                            <FiUpload size={20} />
                          </div>
                          <span className="text-sm font-bold text-[#2D2926] block">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-[#2D2926]/60 block mt-1">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </span>
                        </div>

                        {formData.storyPhotos.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {formData.storyPhotos.map((file, index) => (
                              <div
                                key={index}
                                className="relative group bg-white rounded-xl overflow-hidden border border-[#D3B28C]/50 shadow-sm"
                              >
                                <img loading="lazy" decoding="async"
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-24 object-cover"
                                />
                                <div className="absolute inset-0 bg-[#2D2926]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index, "storyPhotos")}
                                    className="w-8 h-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                                  >
                                    <FiX size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end pt-6 border-t border-[#D3B28C]/30 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full border border-[#D3B28C] hover:bg-[#F8F2EA] text-[#2D2926]/70 hover:text-[#2D2926] text-sm font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#7A3E3E] hover:bg-[#8f4a4a] text-[#F5F1EA] rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <FiCheck className="mr-2" size={18} />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default JoinMovementForm;