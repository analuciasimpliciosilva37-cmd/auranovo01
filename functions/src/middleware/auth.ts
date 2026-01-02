
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const split = authorization.split('Bearer ');
    if (split.length !== 2) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = split[1];

    try {
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        console.log('decodedToken', JSON.stringify(decodedToken));
        req.user = decodedToken;
        return next();
    } catch (err) {
        console.error(`${err.code} -  ${err.message}`);
        return res.status(401).send({ message: 'Unauthorized' });
    }
};