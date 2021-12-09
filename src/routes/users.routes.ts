import { response, Router } from 'express';
import knex from '../database/connection';
import { hash } from 'bcryptjs';

const usersRouter = Router();

usersRouter.get('/', async (req,res) => {
    const users = await knex('users').select('*');

    return res.json(users);
});

usersRouter.post('/', async (req, res) => {
 const {name , email, password} = req.body;

 

 const passwordHashed = await hash(password,8);

 const user = {name , email, password: passwordHashed};

 const newIds = await knex('users').insert(user);
 
 return res.json({
     id: newIds[0],
     ... user
 });
});

usersRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const newId = await knex('users').delete().where('id',id);

    if (newId>0){
    return res.json({"message": "Usuario excluido"});
    }else{
        res.status(400).json({"message": "usuário não encontrado!"});
    }
});

export default usersRouter;