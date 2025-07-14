import { createServer } from 'http';
import { API_URL } from './src/utils/variables.js';

const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
    if (req.method === 'POST' && req.url === API_URL) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk
        });
        req.on('end', () => {
            console.log('Получены данные формы:', body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Форма отправлена' }));
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
