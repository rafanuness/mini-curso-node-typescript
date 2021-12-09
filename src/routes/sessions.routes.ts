import { response, Router } from 'express';
import { compare } from 'bcryptjs';
import knex from '../database/connection';

const sessionsRouter = Router();



sessionsRouter.post('/', async (req, res) => {
 const {email, password} = req.body;

 const user = await knex('users').where('email',email).first();

 if(!user){
    return res.status(400).json({message: 'Credenciais incorretas!'});
 }

 const comparePassword = compare(password, user.password);

 if (!comparePassword){
    return res.status(400).json({message: 'Credenciais incorretas!'});
 }

 return res.json(user);
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