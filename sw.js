// Service Worker для перехвата запросов к видео Google Drive
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Перехватываем только запросы потокового видео нашего приложения
    if (url.origin === 'https://www.googleapis.com' && url.pathname.includes('/drive/v3/files/') && url.searchParams.has('stream')) {
        const token = url.searchParams.get('token');
        url.searchParams.delete('stream');
        url.searchParams.delete('token');

        // Клонируем заголовки и добавляем токен авторизации
        const headers = new Headers(event.request.headers);
        headers.set('Authorization', `Bearer ${token}`);

        // Перенаправляем запрос с авторизацией и поддержкой Range-запросов
        event.respondWith(
            fetch(url.toString(), {
                method: event.request.method,
                headers: headers,
                mode: 'cors',
                credentials: 'omit'
            })
        );
    }
});
