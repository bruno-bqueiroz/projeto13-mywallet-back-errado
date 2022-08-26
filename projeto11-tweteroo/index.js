import express from 'express';

const server = express();

let twits = [];


server.get('/tweets', (req, res) =>{
    res.send(twits.slice(twits.length -10));
})


server.listen(5000, () => console.log('listen on 5000'));