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

    console.log('파티 생성 요청:', {
    id,
    title,
    game,
    max
});

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

router.get('/party', (req, res) => {

    db.query(
        'SELECT * FROM parties',
        (err, result) => {

            if (err) {
                console.log(err);
                return res.json([]);
            }

            res.json(result);
        }
    );

});

router.post('/party/delete', (req, res) => {

    const { id } = req.body;

    console.log('삭제 요청:', id);

    db.query(
        'DELETE FROM parties WHERE id=?',
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send('삭제 실패');
            }

            res.send('삭제 완료');
        }
    );

});

router.post('/party/join', (req, res) => {

    const { id, username } = req.body;

    console.log('참가 요청:', id, username);

    db.query(
        'UPDATE parties SET current_members = current_members + 1 WHERE id=?',
        [id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('참가 실패');
            }

            res.send('참가 완료');
        }
    );

});

module.exports = router;