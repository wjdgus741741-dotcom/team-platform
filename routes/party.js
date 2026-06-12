const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/party/create', (req, res) => {

    const {
        title,
        game,
        max
    } = req.body;

    const id = Math.floor(Math.random() * 1000000);
    const sql = `
        INSERT INTO parties
        (id, title, game, max_members)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [id, title, game, max],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('파티 생성 실패');
            }

            res.send('파티 생성 성공');
        }
    );
});

module.exports = router;