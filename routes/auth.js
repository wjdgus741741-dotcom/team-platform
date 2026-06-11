const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users(username,password)
            VALUES (?,?)
        `;

        db.query(
            sql,
            [username, hashedPassword],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('회원가입 실패');
                }

                res.send('회원가입 성공');
            }
        );

    } catch {
        res.status(500).send('오류');
    }
});

router.post('/login', (req, res) => {

    const { username, password } = req.body;

    const sql =
    'SELECT * FROM users WHERE username=?';

    db.query(
        sql,
        [username],

        async (err, result) => {

            if (err) {
                return res.send('오류');
            }

            if (result.length === 0) {
                return res.send('아이디 없음');
            }

            const user = result[0];

            const compare =
            await bcrypt.compare(
                password,
                user.password
            );

            if (!compare) {
                return res.send(
                    '비밀번호 틀림'
                );
            }

            const token = jwt.sign(
                {
                    id:user.id,
                    username:user.username
                },
                'secretKey',
                {
                    expiresIn:'1h'
                }
            );

            res.json({
                message:'로그인 성공',
                token
            });

        }
    );

});

module.exports = router;