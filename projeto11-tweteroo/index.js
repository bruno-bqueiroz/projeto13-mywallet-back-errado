import express from 'express';
import cors from 'cors';


const server = express();
server.use(cors());
server.use(express.json());

let usuario = [];
let tweets = [];

server.post('/sign-up', (req, res) =>{
	usuario = [...usuario, req.body];
	console.log(usuario);
	res.send('OK');
})

server.post('/tweets', (req, res) =>{

	const avatar = usuario.find((value) => value.username === req.body.username) 
	const twiti = req.body;
	

	 twiti.avatar = avatar.avatar;
	 tweets = [...tweets, twiti];
	 console.log(tweets);
	res.send('OK');
})

server.get('/tweets', (req, res) =>{
	if(tweets.length >= 10){
    	res.send(tweets.slice(tweets.length -10));
	} else res.send(tweets);
})


server.listen(5000, () => console.log('listen on 5000'));