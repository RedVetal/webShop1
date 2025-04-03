const express = require('express');
const router = express.Router();

let products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Smartphone", price: 30000 }
];

// Получение всех товаров
router.get('/', (req, res) => {
    res.json(products);
});

// Добавление товара
router.post('/', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.json(newProduct);
});

// Обновление товара по ID
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    res.json(products[productIndex]);
});

// Удаление товара по ID
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    res.json({ message: "Product deleted" });
});

module.exports = router;
