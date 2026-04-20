import { useState } from 'react'

import { axios } from '../lib/axios'

export const useViewFile = () => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null)

    const viewFile = async (key: string): Promise<void> => {
        const response = await axios.post('/storage/get-presigned-url', {
            key: key,
            expiresIn: 3600,
        });

        const { signedUrl: url } = response.data;

        setSignedUrl(null);

        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        setSignedUrl(url);
    }

    return {
        signedUrl,
        viewFile,
    }
}