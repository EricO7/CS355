const express = require('express'); // load express module
const nedb = require("nedb-promises"); // load nedb module
const bcrypt = require('bcrypt');
const app = express(); // init app
const db = nedb.create('users.jsonl'); // init db

app.use(express.static('public')); // enable static routing to "./public" folder
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());
// create route to get all user records (GET /users)
// use db.find to get the records, then send them
// use .catch(error=>res.send({error})) to catch and send errors

app.get('/users', (req, res)=>{
db.find({}).then(users => {
res.send(users);
}).catch(error => {
res.send({error});
});
});
// create route to get user record (GET /users/:username)
// use db.findOne to get user record
// if record is found, send it
// otherwise, send {error:'Username not found.'}
// use .catch(error=>res.send({error})) to catch and send other errors
app.post('/users/:username',(req,res)=>{
const authtoken = Math.random().toString(36);
db.findOne({
username:req.params.username
}).then(userfound => {
const {username, password, name, email} = userfound;
if(bcrypt.compareSync(req.body.password, userfound.password)){
db.updateOne({username}, {$set:{authtoken}})
res.send({username, name, email, authtoken});
} else {
res.send({error: 'Incorrect password!'})
}
}).catch(error => {
res.send({error});
})
});

app.post('/users',(req,res)=>{
if(!req.body.username||!req.body.password||!req.body.email||!req.body.name){
res.send({error:'Missing fields.'});
}
else{
db.findOne({username:req.body.username}).then(user=>{
if(user){
res.send({error:'Username already exists.'});
}
else{
var hashp = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
db.insertOne(
{username: req.body.username,
password: hashp,
name: req.body.name,
email: req.body.email}
).then(whateverinserted=>{
res.send(whateverinserted);
}).catch(error=>{
res.send({error});
})
}
}
).catch(error=>{
res.send({error});
})
}
});
app.patch('/users/:username',(req,res)=>{
db.updateOne(
{"username":req.params.username}, // find doc with given :id
{ $set: req.body } // update it with new data
).then(
(result)=>{
const aT = req.headers.authorization
if (aT != result.authtoken){
res.send({error: 'Not authorized!'})
}
if(result==0){
res.send({error:'Something went wrong.'})
}
else{
res.send({ok:true})
}
})
.catch(error=>res.send({error}));
});

app.delete('/users/:username',(req,res)=>{
db.deleteOne(
{username:req.params.username}
).then(
result=>{
const aT = req.headers.authorization
if (aT != result.authtoken){
res.send({error: 'Not authorized!'})
}
if(result==0){
res.send({error:'Something went wrong.'})
}
else{
res.send({ok:true})
}
}
).catch(error=>res.send({error}));
});

// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});

// start server
app.listen(3001,()=>console.log("Server started on http://localhost:3001"))