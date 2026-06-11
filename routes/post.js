const express = require('express');
const router = express.Router();

const db = require('../config/db');

router.post('/post', (req, res) => {

    const {
        title,
        content
    } = req.body;

    const sql = `
        INSERT INTO posts
        (title,content)
        VALUES (?,?)
    `;

    db.query(
        sql,
        [title,content],

        (err) => {

            if(err){
                return res.send(
                    '작성 실패'
                );
            }

            res.send(
                '작성 성공'
            );

        }

    );

});

router.get(
    '/posts',
    (req,res)=>{

        db.query(
            'SELECT * FROM posts',

            (err,result)=>{

                if(err){
                    return res.send(
                        '조회 실패'
                    );
                }

                res.json(
                    result
                );

            }

        );

    }
);

module.exports = router;