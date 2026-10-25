import { useState } from 'react';
import { validateApiKey } from '../../chat/services/geminiService';

export function useOnboarding(onSetupComplete) {
    const [isSavingSetup, setIsSavingSetup] = useState(false);
    const [setupError, setSetupError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSavingSetup) return;

        const formData = new FormData(event.currentTarget);
        const displayName = formData.get('displayName')?.toString().trim();
        const apiKey = formData.get('apiKey')?.toString().trim();

        if (!displayName || !apiKey) {
            setSetupError('Please enter your display name and API key.');
            return;
        }

        setIsSavingSetup(true);
        setSetupError('');

        try {
            await validateApiKey(apiKey);

            localStorage.setItem('display_name', displayName);
            localStorage.setItem('gemini_api_key', apiKey);

            onSetupComplete();
        } catch (error) {
            console.error('Setup validation failed:', error);
            setSetupError(
                'Could not validate your API key. Check it and try again.'
            );
        } finally {
            setIsSavingSetup(false);
        }
    };

    return {
        isSavingSetup,
        setupError,
        setSetupError,
        handleSubmit,
    };
}