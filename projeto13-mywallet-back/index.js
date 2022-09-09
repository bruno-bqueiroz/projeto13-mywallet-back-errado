import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import Joi from 'joi';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());


const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(()=>{
    db = mongoClient.db('controle');
});

server.post ('/cadastro', async (req, res) =>{
    const {name, email, password} = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        
        await db.collection('users').insertOne({
            name,
            email,
            password: hashPassword,
        });
        
        
    } catch (error) {
        console.error(error);
        res.sendStatus(error);
    }
    res.sendStatus(201);
});

server.post ('/', async(req, res) =>{

    const { email, password } = req.body;
    try {
        const user = await db.collection('users').findOne({
          email,
        });
        const isValid = bcrypt.compareSync(password, user.password);
  
        if(!user || !isValid) {
          return res.status(404).send('Usuário ou senha não encontrada');
        }

        const token = uuid();

        await db.collection('sessions').insertOne({
            email,
			token
        });

        res.status(200).send(token);
  
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});



server.post('/registros', async (req, res)=>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { valor, descricao } = req.body;
    try {
        const user = await db.collection('sessions').find({
        }).toArray();
        
        const retorno = await user.find((value) => value.token === token)


        if (!retorno){
            console.log(token);
            console.log('entrou');
            return res.status(404).send('Usuário não encontrado');
        }
        console.log(retorno.email);

        await db.collection('registros').insertOne({
            email: retorno.email,
            valor,
            descricao,
            date: dayjs().format('DD/MM')
        });
        console.log(user)
        res.status(201).send(user);

    } catch (error) {
        console.log(error);
    }
});

server.get('/registros', async (req, res) =>{
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const user = await db.collection('sessions').find({
        }).toArray();

        const retorno = await user.find((value) => value.token === token)
        
        if (!retorno){
            return res.status(404).send('Usuário não encontrado');
        }

        console.log(retorno.email);
        

        const result = await db.collection('registros').find({
            
        }).toArray();

        const registros = await result.filter((value)=> {
            value.email === retorno.email
        })
        res.send(result);
        
    } catch (error) {
        console.error(error);
    }
});

server.listen(5000, ()=> console.log('listen on port 5000'));