const express = require('express'), app = express();
const cors = require('cors') 
  
// enabling CORS for any unknown origin(https://xyz.example.com) 
app.use(cors()); 
app.use(express.static('public'));


const randInt = n=>Math.floor(n*Math.random());  // returns random integer between 0 and n, not including n
const getRandomItemFromArray = arr=>arr[randInt(arr.length)];  // returns a random item from an array

const breeds = {
    "husky":["imgs/husky.jpg"],
    "boxer":["imgs/boxer.jpg", "imgs/beagle.jpg"], 
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
    console.log(photo);
    res.send({photo});
});

app.listen(3000);