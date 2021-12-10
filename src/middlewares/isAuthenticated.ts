import { Request, Response, NextFunction, response} from 'express';
import { verify } from 'jsonwebtoken';


import authConfig from '../config/auth';

export default function isAuthenticated(
        req: Request, 
        res: Response, 
        next: NextFunction
    ) {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: 'JWT Token is missing.'});
    }

    const [, token] = authHeader.split(' ');
    
console.log(token)
    try {
        const decodedToken = verify(token, authConfig.jwt.secret);

        console.log(decodedToken);
        
        return next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid JWT Token.'});
    }
}