'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Amazon-style Country Selector
 * - Closed: Shows "ISO2 DialCode" (e.g., "IN +91")
 * - Open: Shows "Name (DialCode)" (e.g., "India (+91)")
 */
export default function CountrySelector({ value, onChange, countryCodes }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Find the currently selected country object
    const selectedCountry = countryCodes.find(c => c.dialCode === value) || countryCodes[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (dialCode) => {
        onChange(dialCode);
        setIsOpen(false);
    };

    return (
        <div className="relative h-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-full flex items-center pl-3 pr-2 bg-transparent border-none text-gray-900 font-medium text-sm focus:outline-none whitespace-nowrap rounded-l-xl"
            >
                {/* Closed State: ISO2 + DialCode */}
                <span>{selectedCountry?.iso2} {selectedCountry?.dialCode}</span>

                {/* Chevron */}
                <svg
                    className={`ml-1 h-3 w-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1">
                        {countryCodes.map((country) => (
                            <li key={country.code}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(country.dialCode)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${country.dialCode === value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                        }`}
                                >
                                    {/* Open State: Name (DialCode) */}
                                    {country.name} ({country.dialCode})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
