import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'SMS Service Docs',
    description: 'Пользовательская документация SMS Service',
    head: [
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/sms.ico' }]
    ],
    base: '/docs/',

    themeConfig: {
        nav: [
            { text: 'Главная', link: '/' },
            { text: 'Мобильное приложение', link: '/mobile' },
            { text: 'Веб-приложение', link: '/web' },
            { text: 'Работа с API', link: '/api' },
        ],

        sidebar: [
            {
                text: 'Документация',
                items: [
                    { text: 'Главная', link: '/' },
                    { text: 'Мобильное приложение', link: '/mobile' },
                    { text: 'Веб-приложение', link: '/web' },
                    { text: 'Работа с API', link: '/api' },
                ],
            },
        ],
    },
});