import express from 'express';
import cors from 'cors';


const server = express();
server.use(cors());
server.use(express.json());

let usuario = [];
let tweets = [];
// API DE LOGIN
server.post('/sign-up', (req, res) =>{

	if (!req.body.username || !req.body.avatar){
		return res.status(400).send('Todos os Campos são obrigatórios!');
	}
	usuario = [...usuario, req.body];
	console.log(usuario);
	res.status(201).send('OK');
})

// API QUE ARMAZENA OS TWEETS DE TODOS OS USUÁRIOS
server.post('/tweets', (req, res) =>{
	console.log(req.headers.user)
	if (!req.headers.user || !req.body.tweet){
		return res.status(400).send('Todos os Campos são obrigatórios!');
	}

	const avatar = usuario.find((value) => value.username === req.headers.user) 
	const twiti = req.body;
	
	 twiti.avatar = avatar.avatar;
	 twiti.username = req.headers.user;
	 tweets = [...tweets, twiti];
	 console.log(tweets);
	res.status(201).send('OK');
})

// API DE RESPONDE COM OS TWEETS DE TODOS OS USUÁRIOS
server.get('/tweets', (req, res) =>{
console.log(req.query.username)
	if (req.query.username){
		
		const { username ,page } = req.query;
		let tweetsDoUsuario = tweets.filter((value) => value.username === username);
		console.log('inicio' + tweets);
		console.log('tam maior que 10')
		return res.send(tweets.slice(tweets.length-(10*page), tweets.length-(10*(page-1))));
		
	}
	if(tweets.length >= 10){
		const { page } = req.query;
		console.log(page);
    	res.send(tweets.slice(tweets.length-(10*page), tweets.length-(10*(page-1))));
		
	} else res.send(tweets);
})


server.listen(5000, () => console.log('listen on 5000'));