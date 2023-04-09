// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            title: 'WebGL Shopping App',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
                { name: 'format-detection', content: 'telephone=no' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
            script: [
            ]
        }
    },
    modules: ['@nuxtjs/google-fonts'],
    googleFonts: {
        families: {
            Inter: true,
            'Noto Sans JP': true
        }
    },
    css: [
        '@/assets/global.css'
    ],
    server: {
        port: process.env.PORT || 8000,
        host: process.env.HOST || "0.0.0.0",
        timing: false
    }
})
