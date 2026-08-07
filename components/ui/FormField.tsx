// components/ui/FormField.tsx

"use client";

import { ReactNode } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  type?: "text" | "email" | "textarea";
};

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon,
  type = "text",
}: Props) {
  return (
    <div className="space-y-1">
      {/* LABEL */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div className={`flex items-center border rounded-lg px-3 py-2 bg-white 
        focus-within:ring-2 focus-within:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"}`}>

        {icon && <span className="text-gray-400 mr-2">{icon}</span>}

        {type === "textarea" ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full outline-none resize-none h-24"
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full outline-none"
          />
        )}
      </div>

      {/* ERROR */}
      {error && <p className="!text-red-500 !text-sm">{error}</p>}
    </div>
  );
}