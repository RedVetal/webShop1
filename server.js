// Загружаем переменные окружения из .env
require('dotenv').config();

// Импортируем нужные библиотеки
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Настраиваем приложение
const app = express();
app.use(cors());
app.use(express.json());

// Подключаемся к PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Проверка подключения
pool.connect()
  .then(() => console.log('✅ Подключено к PostgreSQL'))
  .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

// ======= Маршруты API =======

// Получить все товары
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении товаров:', err);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// Добавить товар
app.post('/api/products', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Название и цена обязательны' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при добавлении товара:', err);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

// Удалить товар по ID
app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    console.error('Ошибка при удалении товара:', err);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// ============================

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
