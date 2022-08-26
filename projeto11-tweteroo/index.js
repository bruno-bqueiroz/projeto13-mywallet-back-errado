import express from 'express';
import cors from 'cors';


const server = express();
server.use(cors());
server.use(express.json());

let usuario = [];
let twits = [];

server.post('/sign-up', (req, res) =>{
	usuario = [...usuario, req.body];
	res.send('OK');
})

server.post('/tweets', (req, res) =>{
	console.log(req.body);
	twits = [...twits, req.body];
	console.log(twits);
	res.send('OK');
})

server.get('/tweets', (req, res) =>{
	if(twits.length >= 10){
    	res.send(twits.slice(twits.length -10));
	} else res.send(twits);
})


server.listen(5000, () => console.log('listen on 5000'));