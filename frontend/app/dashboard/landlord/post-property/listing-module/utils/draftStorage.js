const DRAFT_KEY = 'landlord_listing_draft';

/**
 * Saves current form state to localStorage
 * @param {Object} data - Form data
 * @param {number} step - Current step index
 */
export const saveDraft = (data, step) => {
    if (typeof window === 'undefined') return;

    try {
        // Exclude large binary data (files) if stored directly in state
        // Since we store File objects which don't serialize well, we strip them or handle separately
        // For Draft persistence, usually we only store metadata and text fields
        // Re-uploading files is safer/standard for drafts to avoid quota limits

        const safeData = { ...data };

        // Remove file objects to prevent storage overflow & serialization errors
        const textOnlyData = Object.keys(safeData).reduce((acc, key) => {
            const val = safeData[key];
            // Check if value is a File or contains Files (arrays of images)
            if (val instanceof File || (val && val.file instanceof File)) {
                return acc; // Skip file fields
            }
            if (Array.isArray(val) && val.length > 0 && val[0].file instanceof File) {
                return acc; // Skip image arrays
            }
            // Retain other fields
            acc[key] = val;
            return acc;
        }, {});

        const payload = JSON.stringify({
            data: textOnlyData,
            step: step,
            updatedAt: new Date().toISOString()
        });

        localStorage.setItem(DRAFT_KEY, payload);
    } catch (error) {
        console.warn('Failed to save draft:', error);
    }
};

/**
 * Retrieves draft from localStorage
 * @returns {Object|null} - { data, step, updatedAt }
 */
export const getDraft = () => {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(DRAFT_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (error) {
        console.warn('Failed to load draft:', error);
        return null;
    }
};

/**
 * Clears the draft from localStorage
 */
export const clearDraft = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DRAFT_KEY);
};
