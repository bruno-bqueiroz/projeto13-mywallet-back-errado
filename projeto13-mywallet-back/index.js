import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import Joi from 'joi';
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
    db = mongoClient.db('test');
});

server.post ('/sign-up', async (req, res) =>{
    const {name, email, password} = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        
        await db.collection('users').insertOne({
            name,
            email,
            password: hashPassword});
        
        
    } catch (error) {
        console.error(error);
        res.sendStatus(error);
    }
    res.sendStatus(201);
});

server.post ('/sign-in', async(req, res) =>{

    const { email, password } = req.body;
    try {
        const user = await db.collection('users').findOne({
          email,
        });
  
        if(!user) {
          return res.status(404).send('Usuário ou senha não encontrada');
        }
  
        const isValid = bcrypt.compareSync(password, user.password);
  
        if (!isValid){
          return res.status(404).send('Usuário ou senha não encontrada');
        }
  
        res.send(user.password);
  
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
})





server.listen(5000, ()=> console.log('listen on port 5000'));