import { useState } from 'react'

import { axios } from '../lib/axios'

export const useUpload = () => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null)

    const uploadFile = async (file: File, key: string): Promise<string> => {
        const response = await axios.post('/storage/put-presigned-url', {
            key: key,
            expiresIn: 3600,
        })

        const { signedUrl: url } = response.data

        setSignedUrl(url)

        const result = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        })

        if (!result.ok) {
            throw new Error('Failed to upload file')
        }

        return `${key}`
    }

    return {
        signedUrl,
        uploadFile,
    }
}