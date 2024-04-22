const express = require('express'); //load express module
const nebd = require("nedb-promises"); //load nebd module
const app = express() // init app
const db = nebd.create('hits.json'); // init db

app.use(express.static('public'));

var hits = 0; //hit counter
db.findOne({hits: {$exists:true}}).then((doc)=>{
    if (doc){
        hits=doc.hits;
    }
});


app.get('/hits', (req, res)=> {
 hits +=1;
db.updateOne(
    {hits: {$exists:true}},
    {hits },
    {upsert:true}
   );
 res.contentType('text/plain').send( (hits).toString() );
});

app.listen(3000);