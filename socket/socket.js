const users = {};
const friends = {};

const db =
    require('../config/db');

module.exports = (io) => {

    io.on('connection', (socket) => {

        console.log('유저 연결');

        // 유저 등록
        socket.on('registerUser', (username) => {

            users[username] = socket.id;

            if (!friends[username]) {
                friends[username] = [];
            }

            console.log(username + ' 등록 완료');
        });

        // 채팅방 입장
        socket.on('joinRoom', (roomName) => {

            socket.join(roomName);

            // 이전 채팅 불러오기
            db.query(
                `
                SELECT * FROM messages
                WHERE room = ?
                ORDER BY created_at ASC
                `,
                [roomName],
                (err, results) => {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    socket.emit(
                        'loadMessages',
                        results
                    );

                }
            );

        });

        // 일반 채팅
        socket.on('chatMessage', (data) => {

            // DB 저장
            db.query(
                `
                INSERT INTO messages
                (username, tier, room, message)
                VALUES (?, ?, ?, ?)
                `,
                [
                    data.username,
                    data.tier,
                    data.room,
                    data.message
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                    }

                }
            );

            // 실시간 전송
            io.to(data.room).emit(
                'chatMessage',
                data
            );

        });

        // DM
        socket.on('privateMessage', (data) => {

            const targetSocketId =
                users[data.target];

            if (targetSocketId) {

                io.to(targetSocketId)
                    .emit(
                        'privateMessage',
                        data
                    );

            }

        });

        // 친구 요청
        socket.on('friendRequest', (data) => {

            const targetSocketId =
                users[data.target];

            if (targetSocketId) {

                io.to(targetSocketId)
                    .emit(
                        'friendRequest',
                        {
                            from: data.from
                        }
                    );

            }

        });

        // 친구 수락
        socket.on('acceptFriend', (data) => {

            friends[data.from]
                .push(data.target);

            friends[data.target]
                .push(data.from);

            io.to(users[data.from])
                .emit(
                    'friendList',
                    friends[data.from]
                );

            io.to(users[data.target])
                .emit(
                    'friendList',
                    friends[data.target]
                );

        });

        socket.on('disconnect', () => {

            console.log('유저 연결 종료');

        });

    });

};