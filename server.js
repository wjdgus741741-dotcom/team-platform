const partyRouter = require('./routes/party');

const express = require('express');

const http = require('http');

const { Server } = require('socket.io');

const cors = require('cors');

const authRouter =
require('./routes/auth');

const postRouter =
require('./routes/post');

const app = express();

const server =
http.createServer(app);

const io =
new Server(

server,

{

cors:{

origin:'*'

}

}

);

require(
'./socket/socket'
)(io);

app.use(
cors()
);

app.use(
express.json()
);

app.use(
express.static(
'public'
)
);

app.use(
'/',
authRouter
);

app.use(
'/',
postRouter
);

app.use(
'/',
partyRouter
);

server.listen(

3000,

()=>{

console.log(
'서버 실행 중'
);

}

);