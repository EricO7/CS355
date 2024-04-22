const express = require('express'), app = express();
const cors = require('cors') 
  
// enabling CORS for any unknown origin(https://xyz.example.com) 
app.use(cors()); 
const breeds = {
    "husky":["../husky.jpg"],
    "boxer":["../boxer.jpg"], 
    "beagle":["../beagle.jpg"],
    "corgi":["../corgi.jpg"],
    "collie":["../collie.jpg"]
}
app.get('/breeds/',(req,res)=>{ // show all users
    res.send(breeds);
});

app.get('/image/:breed',(req,res)=>{
    const b=req.params.breed; // show tweets for one user
    console.log(breeds[b]);
    res.send(breeds[b]);
});

app.listen(3000);