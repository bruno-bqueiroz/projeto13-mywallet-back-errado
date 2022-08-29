import express from 'express';
import cors from 'cors';


const server = express();
server.use(cors());
server.use(express.json());

let usuario = [{
    	username: "bobesponja",
		avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info"
		},
		{
		username: "patrick",
		avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info"
		}
	];
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
	if (!req.headers.username || !req.body.tweet){
		return res.status(400).send('Todos os Campos são obrigatórios!');
	}

	const avatar = usuario.find((value) => value.username === req.headers.username) 
	const twiti = req.body;
	
	 twiti.avatar = avatar.avatar;
	 twiti.username = req.headers.username;
	 tweets = [...tweets, twiti];
	 console.log(tweets);
	res.status(201).send('OK');
})

// API DE RESPONDE COM OS TWEETS DE TODOS OS USUÁRIOS
server.get('/tweets', (req, res) =>{
	
	if (req.query.USERNAME){
		const { USERNAME } = req.query;
		let tweetsDoUsuario = tweets.filter((value) => value.username === USERNAME);
		return res.send(tweetsDoUsuario);
		
	}
	if(tweets.length >= 10){
    	res.send(tweets.slice(tweets.length -10));
	} else res.send(tweets);
})



server.listen(5000, () => console.log('listen on 5000'));