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
        await db.collection('saldo').insertOne({email, valor: 0});
        
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



server.post('/registrodeentrada', async (req, res)=>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { valor, descricao } = req.body;
    try {
        const user = await db.collection('sessions').find({
        }).toArray();
        const retorno = await user.find((value) => value.token === token)
        const saldo  = await db.collection('saldo').find({email: retorno.email}).toArray();
        console.log(saldo[0].valor);

        const novoSaldo = saldo[0].valor+parseInt(valor);
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
            type: "entrada",
            date: dayjs().format('DD/MM'),
            });

        await db.collection('saldo').updateOne({email: retorno.email},{$set:{valor: novoSaldo}})

        /* console.log(user) */
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
    }
});

server.post('/registrodesaida', async (req, res) =>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { valor, descricao } = req.body;
    try {
        const user = await db.collection('sessions').find({
        }).toArray();
        const retorno = await user.find((value) => value.token === token)
        const saldo  = await db.collection('saldo').find({email: retorno.email}).toArray();
        console.log(saldo[0].valor);
        const novoSaldo = saldo[0].valor-parseInt(valor);
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
            type: "saida",
            date: dayjs().format('DD/MM'),
            });

        await db.collection('saldo').updateOne({email: retorno.email},{$set:{valor: novoSaldo}})

        /* console.log(user) */
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

        const retorno = await user.find((value) => value.token === token);
        const valor = await db.collection('saldo').find({
            email:retorno.email
        }).toArray();
        console.log(valor);
        if (!retorno){
            return res.status(404).send('Usuário não encontrado');
        }


        console.log(retorno.email);
        const result = await db.collection('registros').find({
            email:retorno.email
        }).toArray();

        let extrato = valor;
        extrato = [ ...extrato, result];

        res.send(extrato);
    } catch (error) {
        console.error(error);
    }
});

server.listen(5000, ()=> console.log('listen on port 5000'));