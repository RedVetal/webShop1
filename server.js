// Загружаем переменные окружения из .env
require('dotenv').config(); 

// Импортируем нужные библиотеки
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // Позволяет серверу работать с JSON

// Подключаемся к PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // URL из .env
    ssl: { rejectUnauthorized: false } // Render требует SSL
});

// Проверяем подключение к базе данных
pool.connect()
    .then(() => console.log('✅ Подключено к PostgreSQL'))
    .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

// Подключаем маршруты API (например, для работы с товарами)
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
