const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module
const bcrypt = require('bcrypt');

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder


//TODO:
app.use(express.json());// automatically decode all requests from JSON and encode all responses into JSON


//TODO:
// create route to get all user records (GET /users)
//   use db.find to get the records, then send them
//   use .catch(error=>res.send({error})) to catch and send errors
app.get('/users', (req, res)=>{
    db.find({}).then(user => {
        res.send(users);
    }).catch(error => {
        res.send({error});
    });
});
//TODO:
// create route to get user record (GET /users/:username)
//   use db.findOne to get user record
//     if record is found, send it
//     otherwise, send {error:'Username not found.'}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.post('/auth',(req,res)=>{
    db.findOne({
        username:req.body.username
    }).then(user => {
        if(user&&bcrypt.compareSync(req.body.password, user.password)){
            delete user.password;
            res.send(user);
        }else{
            res.send({error:'Username not Found.'});
        }
    }).catch(error =>{
        res.send({error});
    })
});
app.get('/users/:username',(req,res)=>{
    db.findOne({
        username:req.params.username
    }).then(user => {
        if(user){
            res.send(user);
        }else{
            res.send({error:'Username not Found.'});
        }
    }).catch(error =>{
        res.send({error});
    })
});
//TODO:
// create route to register user (POST /users)
//   ensure all fields (username, password, email, name) are specified; if not, send {error:'Missing fields.'}
//   use findOne to check if username already exists in db
//     if username exists, send {error:'Username already exists.'}
//     otherwise,
//       use insertOne to add document to database
//       if all goes well, send returned document
//   use .catch(error=>res.send({error})) to catch and send other errors
app.post('/users',(req,res)=>{
        if(!req.body.username||!req.body.password||!req.body.Fdog||!req.body.name){
            res.send({error:'Missing fields.'});
        }
        else{
            db.findOne({username:req.body.username}).then(user=>{
                if(user){
                    res.send({error:'Username already exists.'});
                }
                else{
                    req.body.password= bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
                    db.insertOne(req.body).then(whateverinserted=>{
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
//TODO:
// create route to update user doc (PATCH /users/:username)
//   use updateOne to update document in database
//     updateOne resolves to 0 if no records were updated, or 1 if record was updated
//     if 0 records were updated, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.patch('/users/:username',(req,res)=>{
    db.updateOne(
        {username:req.params.username},
        { $set: req.body }
        ).then(result=>{
            if(result==0){
                res.send({error:'Something went Wrong'})
            }
            else{
                res.send({ok:true})
            }})
        .catch(error=>res.send({error}));
        
});
//TODO:
// create route to delete user doc (DELETE /users/:username)
//   use deleteOne to update document in database
//     deleteOne resolves to 0 if no records were deleted, or 1 if record was deleted
//     if 0 records were deleted, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.delete('/users/:username',(req,res)=>{
    db.deleteOne(
        {username:req.params.username}
    ).then(
        result=>{
            if(result==0){
                res.send({error:'Something went wrong.'})
            }
            else(
                res.send({ok:true})
            )
        }
    ).catch(error=>res.send({error}));
});
// dog API stuff
const randInt = n=>Math.floor(n*Math.random());  // returns random integer between 0 and n, not including n
const getRandomItemFromArray = arr=>arr[randInt(arr.length)];  // returns a random item from an array

const breeds = {
    "husky":["imgs/husky.jpg"],
    "boxer":["imgs/boxer.jpg"], 
    "beagle":["imgs/beagle.jpg"],
    "corgi":["imsg/corgi.jpg"],
    "collie":["imgs/collie.jpg"]
}
app.get('/breeds/',(req,res)=>{ // show all users
    res.send(breeds);
});

app.get('/image/:breed',(req,res)=>{
    const b=req.params.breed; // show tweets for one user
    let photo=getRandomItemFromArray(breeds[b]);
    res.send({photo});
});




// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});

// start server
app.listen(3000,()=>console.log("Server started on http://localhost:3000"));
