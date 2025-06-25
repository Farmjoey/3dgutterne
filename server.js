const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'am4567UHIUT4j3uyodfihgjJIKBHGGK786UHIGHgyuid54697UHIY.json');
const GIFTCARD_FILE = path.join(__dirname, 'amgc45yerHiy6RTKNL6HiofghhjJIKGIK7987456KJHBI67869KJGH546o.json');

app.use(express.json());
app.use(express.static(__dirname));

// Get all discount codes
app.get('/api/discount-codes', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Save all discount codes
app.post('/api/discount-codes', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), err => {
        if (err) return res.status(500).json({ error: 'Failed to save data' });
        res.json({ success: true });
    });
});

// Get all gift cards
app.get('/api/gift-cards', (req, res) => {
    fs.readFile(GIFTCARD_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Save all gift cards
app.post('/api/gift-cards', (req, res) => {
    fs.writeFile(GIFTCARD_FILE, JSON.stringify(req.body, null, 2), err => {
        if (err) return res.status(500).json({ error: 'Failed to save data' });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 