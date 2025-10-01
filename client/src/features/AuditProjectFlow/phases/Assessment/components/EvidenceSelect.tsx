import React, { useState, useRef, useEffect } from "react";
import "./EvidenceSelect.css";

interface Option {
  label: string;
  value: string;
}

interface EvidenceSelectProps {
  placeholder?: string;
  isMultiple?: boolean;
  options?: Option[];
  value: string[] | string;
  onChange: (e: { target: { value: string[] | string } }) => void;
  className?: string;
}

const EvidenceSelect: React.FC<EvidenceSelectProps> = ({
  placeholder = "Select options",
  isMultiple = false,
  options = [],
  value = [],
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentValue = isMultiple ? (value as string[]) : value as string;

  const handleOptionClick = (optionValue: string) => {
    let newValue: string[] | string;

    if (isMultiple) {
      if ((value as string[]).includes(optionValue)) {
        newValue = (value as string[]).filter((v) => v !== optionValue);
      } else {
        newValue = [...(value as string[]), optionValue];
      }
    } else {
      newValue = optionValue;
      setIsOpen(false);
    }

    onChange({ target: { value: newValue } });
  };

  const removeTag = (tagValue: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newValue = (value as string[]).filter((v) => v !== tagValue);
    onChange({ target: { value: newValue } });
  };

  const getDisplayText = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) return placeholder;

    if (!isMultiple) {
      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption ? selectedOption.label : value;
    }

    return `${(value as string[]).length} selected`;
  };

  return (
    <div className={`select-dropdown-container ${className}`} ref={dropdownRef}>
      {/* Main dropdown trigger */}
      <div
        className={`select-dropdown-trigger ${isOpen ? "select-dropdown-trigger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select-dropdown-content">
          <span
            className={
              currentValue && (Array.isArray(currentValue) ? currentValue.length > 0 : true)
                ? "select-dropdown-text"
                : "select-dropdown-placeholder"
            }
          >
            {getDisplayText()}
          </span>
        </div>
        <div className={`select-dropdown-arrow ${isOpen ? "select-dropdown-arrow--rotated" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Selected items below dropdown */}
      {isMultiple && (value as string[]).length > 0 && (
        <div className="select-dropdown-selected-container">
          <div className="select-dropdown-selected-items">
            {(value as string[]).map((val) => {
              const option = options.find((opt) => opt.value === val);
              return (
                <span key={val} className="select-dropdown-tag">
                  <span className="select-dropdown-tag-text">
                    {option ? option.label : val}
                  </span>
                  <button
                    type="button"
                    className="select-dropdown-tag-remove"
                    onClick={(e) => removeTag(val, e)}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M4.293 4.293a1 1 0 011.414 0L7 5.586l1.293-1.293a1 1 0 111.414 1.414L8.414 7l1.293 1.293a1 1 0 01-1.414 1.414L7 8.414l-1.293 1.293a1 1 0 01-1.414-1.414L5.586 7 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="select-dropdown-menu">
          {options.length > 5 && (
            <div className="select-dropdown-search-container">
              <input
                type="text"
                placeholder="Search options..."
                className="select-dropdown-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="select-dropdown-options">
            {filteredOptions.length === 0 ? (
              <div className="select-dropdown-no-options">No options found</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = isMultiple
                  ? (value as string[]).includes(option.value)
                  : value === option.value;

                return (
                  <div
                    key={option.value}
                    className={`select-dropdown-option ${
                      isSelected ? "select-dropdown-option--selected" : ""
                    }`}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    <span className="select-dropdown-option-text">{option.label}</span>
                    {isSelected && isMultiple && (
                      <div className="select-dropdown-option-check">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceSelect;
