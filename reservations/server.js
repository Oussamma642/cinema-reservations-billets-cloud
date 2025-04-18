
let express = require('express');
let app = express();

const port = 3000;

app.listen(port, (req, res)=>{
    console.log('Server runs on: ' + port);
})

app.get('/', (req,res)=>{
    res.send("Hi");
})


