const express = require('express'),
 app = express();
app.get('/', (req, res)=>{ // GET / request
 res.send('Hello World!')
});
app.listen(3000, ()=>{ // once server is up and running…
 console.log('Listening at http://localhost:3000/')
});