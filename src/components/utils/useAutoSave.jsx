import { useState, useEffect, useCallback } from 'react';

export const useAutoSave = (key, initialData = {}, saveDelay = 2000) => {
    const [data, setData] = useState(() => {
        // Load from localStorage on init
        try {
            const saved = localStorage.getItem(`autosave_${key}`);
            return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
        } catch {
            return initialData;
        }
    });

    const [lastSaved, setLastSaved] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-save effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsSaving(true);
            try {
                localStorage.setItem(`autosave_${key}`, JSON.stringify(data));
                setLastSaved(new Date());
            } catch (error) {
                console.warn('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, saveDelay);

        return () => clearTimeout(timeoutId);
    }, [data, key, saveDelay]);

    const clearAutoSave = useCallback(() => {
        try {
            localStorage.removeItem(`autosave_${key}`);
            setLastSaved(null);
        } catch (error) {
            console.warn('Clear auto-save failed:', error);
        }
    }, [key]);

    const updateData = useCallback((newData) => {
        setData(prevData => ({ ...prevData, ...newData }));
    }, []);

    return {
        data,
        updateData,
        setData,
        lastSaved,
        isSaving,
        clearAutoSave
    };
};