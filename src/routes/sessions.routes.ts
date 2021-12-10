import { response, Router } from 'express';
import { compare } from 'bcryptjs';
import knex from '../database/connection';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import auth from '../config/auth';

const sessionsRouter = Router();



sessionsRouter.post('/', async (req, res) => {
 const {email, password} = req.body;

 const user = await knex('users').where('email',email).first();

 if(!user){
    return res.status(400).json({message: 'Credenciais incorretas!'});
 }

 const comparePassword = await compare(password, user.password);

 if (!comparePassword){
    return res.status(400).json({message: 'Credenciais incorretas!'});
 }

 const token = sign( {name: user.name} , authConfig.jwt.secret , {
     subject: user.id.toString(),
     expiresIn: authConfig.jwt.expiresIn
 });

 return res.json({user, token});
});

sessionsRouter.delete('/:email', async (req, res) => {
    const { email } = req.params;

    const newId = await knex('users').delete().where('id',email);

    if (newId>0){
    return res.json({"message": "Usuario excluido"});
    }else{
        res.status(400).json({"message": "usuário não encontrado!"});
    }
});

export default sessionsRouter;