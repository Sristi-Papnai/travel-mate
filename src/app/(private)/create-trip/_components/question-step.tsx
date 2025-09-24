"use client";

import * as React from "react";
import type { QuestionField } from "@/interfaces/openapi";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionStepProps {
  title: string;
  fields: QuestionField[];
  formData: any;
  updateField: (key: string, value: string | number) => void;
  errors?: Record<string, string>;
}

export default function QuestionStep({
  title,
  fields,
  formData,
  updateField,
  errors = {},
}: QuestionStepProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-xl font-semibold">{title}</h2>
      {fields.map((f, idx) => (
        <div key={idx} className="flex flex-col gap-1 w-full p-2">
          <label className="text-sm font-medium">
            {f.label}
            {f.required && <span className="text-red-500"> *</span>}
          </label>

          {f.type === "select" && f.options ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full text-left flex justify-between items-center text-sm py-3 px-2 rounded-lg border border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50 ${
                    errors[f.key]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                >
                  {formData[f.key] || `Select ${f.label}`}
                  <IoIosArrowDown size={16} className="ml-2 text-black" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full text-sm bg-white rounded-lg border border-purple-300 shadow-md p-2 mt-2 ml-0 text-black">
                {f.options.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-300 "
                    onSelect={() => updateField(f.key, opt)}
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <input
              type={f.type}
              value={formData[f.key] || ""}
              onChange={(e) => updateField(f.key, e.target.value)}
              className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                errors[f.key]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
          )}

          {errors[f.key] && (
            <span className="text-red-500 text-sm">{errors[f.key]}</span>
          )}
        </div>
      ))}
    </div>
  );
}
