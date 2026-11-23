import React from "react";
import { Search } from "lucide-react";

const AdminSearchBar = ({ value, onChange, placeholder = "Search…" }) => {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F665E]/60" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3.5 py-2 rounded-md border border-[#E7DED3] bg-white text-xs font-sans text-[#2F241D] focus:outline-none focus:border-[#B85C38] transition placeholder:text-[#6F665E]/50"
      />
    </div>
  );
};

export default AdminSearchBar;
