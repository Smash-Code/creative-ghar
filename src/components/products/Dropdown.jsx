import { ArrowDown } from "lucide-react";
import { useState } from "react";

export default function CustomDropdown({ categories, catLoading, formData, handleChange }) {
    const [isOpen, setIsOpen] = useState(false);

    // 🔹 Get display label whether formData.category is id or name
    const selectedCategory =
        categories.find(
            (c) => c.id === formData.category || c.name === formData.category
        )?.name || "Select category";

    return (
        <div className="relative w-full">
            {/* Dropdown Button */}
            <button
                aria-label='Stat'
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-2 border-2 border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            >
                <span>{catLoading ? "Loading categories..." : selectedCategory}</span>
                <ArrowDown className="w-5 h-5 text-gray-500" />
            </button>

            {/* Dropdown Options */}
            {isOpen && !catLoading && (
                <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            onClick={() => {
                                handleChange({
                                    target: { name: "category", value: category.id }, // always store id
                                });
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 ${formData.category === category.id || formData.category === category.name
                                ? "bg-indigo-50 font-medium"
                                : ""
                                }`}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
