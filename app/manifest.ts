import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development'

    return {
        name: isDev ? 'NWZ Dev' : 'NWZ & CO.',
        short_name: isDev ? 'NWZ Dev' : 'NWZ',
        description: 'NWZ Shop System',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: isDev ? '/logo-dev.jpg' : '/logo.jpg',
                sizes: '192x192',
                type: 'image/jpeg',
            },
            {
                src: isDev ? '/logo-dev.jpg' : '/logo.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
            },
        ],
    }
}
