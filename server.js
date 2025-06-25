const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// File paths
const discountFile = path.join(__dirname, 'am4567UHIUT4j3uyodfihgjJIKBHGGK786UHIGHgyuid54697UHIY.json');
const giftcardFile = path.join(__dirname, 'amgc45yerHiy6RTKNL6HiofghhjJIKGIK7987456KJHBI67869KJGH546o.json');

// Helper functions
function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        return [];
    }
}
function writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Discount Codes API
app.get('/api/discount-codes', (req, res) => {
    res.json(readJson(discountFile));
});
app.post('/api/discount-codes', (req, res) => {
    const codes = readJson(discountFile);
    const { code, percentage } = req.body;
    if (!code || !percentage) return res.status(400).json({ error: 'Missing fields' });
    if (codes.find(dc => dc.code.toLowerCase() === code.toLowerCase())) {
        return res.status(400).json({ error: 'Code exists' });
    }
    const newCode = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        code: code.toUpperCase(),
        percentage: parseInt(percentage),
        active: true,
        created: new Date().toISOString(),
        used: 0
    };
    codes.push(newCode);
    writeJson(discountFile, codes);
    res.json(newCode);
});
app.delete('/api/discount-codes/:id', (req, res) => {
    let codes = readJson(discountFile);
    const idx = codes.findIndex(dc => dc.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = codes.splice(idx, 1)[0];
    writeJson(discountFile, codes);
    res.json(deleted);
});
app.patch('/api/discount-codes/:id/toggle', (req, res) => {
    let codes = readJson(discountFile);
    const code = codes.find(dc => dc.id === req.params.id);
    if (!code) return res.status(404).json({ error: 'Not found' });
    code.active = !code.active;
    writeJson(discountFile, codes);
    res.json(code);
});

// Gift Cards API
app.get('/api/gift-cards', (req, res) => {
    res.json(readJson(giftcardFile));
});
app.post('/api/gift-cards', (req, res) => {
    const cards = readJson(giftcardFile);
    const { code, amount } = req.body;
    if (!code || !amount) return res.status(400).json({ error: 'Missing fields' });
    if (cards.find(gc => gc.code.toLowerCase() === code.toLowerCase())) {
        return res.status(400).json({ error: 'Code exists' });
    }
    const newCard = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        code: code.toUpperCase(),
        amount: parseFloat(amount),
        active: true,
        created: new Date().toISOString(),
        used: 0
    };
    cards.push(newCard);
    writeJson(giftcardFile, cards);
    res.json(newCard);
});
app.delete('/api/gift-cards/:id', (req, res) => {
    let cards = readJson(giftcardFile);
    const idx = cards.findIndex(gc => gc.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = cards.splice(idx, 1)[0];
    writeJson(giftcardFile, cards);
    res.json(deleted);
});
app.patch('/api/gift-cards/:id/toggle', (req, res) => {
    let cards = readJson(giftcardFile);
    const card = cards.find(gc => gc.id === req.params.id);
    if (!card) return res.status(404).json({ error: 'Not found' });
    card.active = !card.active;
    writeJson(giftcardFile, cards);
    res.json(card);
});
app.patch('/api/gift-cards/:id/add', (req, res) => {
    let cards = readJson(giftcardFile);
    const card = cards.find(gc => gc.id === req.params.id);
    const { amount } = req.body;
    if (!card || !amount) return res.status(400).json({ error: 'Invalid' });
    card.amount += parseFloat(amount);
    writeJson(giftcardFile, cards);
    res.json(card);
});
app.patch('/api/gift-cards/:id/remove', (req, res) => {
    let cards = readJson(giftcardFile);
    const card = cards.find(gc => gc.id === req.params.id);
    const { amount } = req.body;
    if (!card || !amount) return res.status(400).json({ error: 'Invalid' });
    if (card.amount - parseFloat(amount) < 0) return res.status(400).json({ error: 'Not enough funds' });
    card.amount -= parseFloat(amount);
    writeJson(giftcardFile, cards);
    res.json(card);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 