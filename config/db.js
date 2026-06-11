const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'team_platform'
});

db.connect((err) => {
    if (err) {
        console.log('DB 연결 실패');
        console.log(err);
        return;
    }

    console.log('DB 연결 성공');
});

module.exports = db;