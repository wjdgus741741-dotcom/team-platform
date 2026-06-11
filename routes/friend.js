const express = require('express');

const router = express.Router();

const db = require('../config/db');

// 친구 추가

router.post(
'/friend/add',

(req,res)=>{

const body =
req.body || {};

const user =
body.user;

const target =
body.target;

if(
!user||
!target
){

console.log(
'body:',
req.body
);

return res.send(
JSON.stringify(
req.body
)
);

}

db.query(

`
INSERT INTO friends(

user1,

user2

)

VALUES(?,?)
`,

[
user,
target
],

(err)=>{

if(err){

console.log(
err
);

return res.send(
'추가 실패'
);

}

res.send(
'친구 추가 완료'
);

}

);

});

// 친구 목록

router.get(
'/friend/:user',

(req,res)=>{

const user=
req.params.user;

db.query(

`

SELECT *

FROM friends

WHERE

user1=?

OR

user2=?

`,

[
user,
user
],

(err,result)=>{

res.json(
result
);

}

);

});

// 친구 삭제

router.post(
'/friend/delete',

(req,res)=>{

const body=
req.body||{};

const user=
body.user;

const target=
body.target;

db.query(

`

DELETE FROM friends

WHERE

(

user1=?

AND user2=?

)

OR

(

user1=?

AND user2=?

)

`,

[
user,
target,
target,
user
],

(err)=>{

if(err){

return res.send(
'삭제 실패'
);

}

res.send(
'친구 삭제 완료'
);

}

);

});

module.exports=
router;