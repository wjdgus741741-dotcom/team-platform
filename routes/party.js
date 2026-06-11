const express = require('express');

const router = express.Router();

const db = require('../config/db');

router.post(

'/friend/delete',

(req,res)=>{

console.log(
req.body
);

const {

user,

target

} = req.body || {};

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

(err,result)=>{

if(err){

console.log(
err
);

return res.send(
'삭제 실패'
);

}

res.send(
'친구 삭제 완료'
);

}

);

}

);

module.exports = router;