import express, { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { promisify } from 'util';
import { Mongo } from '../database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { IUser } from '../types/index.js';
import { signupValidation, loginValidation } from '../validation/authValidation.js';

const pbkdf2Async = promisify(crypto.pbkdf2);

const collectionName = 'users';

const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, callback: any) => {
    const user = await Mongo.db
        .collection<IUser>(collectionName)
        .findOne({ email })

    if(!user) {
        return callback(null, false);
    }

    const saltBuffer = Buffer.from(user.salt.buffer);

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (error: any, hashedPassword: Buffer) => {
        if(error) {
            return callback(error);
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer);
        if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
            return callback(null, false);
        }

        const { password: _p, salt: _s, ...safeUser } = user;

        return callback(null, safeUser);
    });
}));

authRouter.post('/signup', signupValidation, async(req: Request, res: Response) => {
    const checkUser = await Mongo.db
        .collection<IUser>(collectionName)
        .findOne({ email: req.body.email });

    if(checkUser) {
        return res.status(409).send({
            success: false,
            statusCode: 409,
            body: {
                text: 'User already exists!',
            }
        });
    }

    const salt = crypto.randomBytes(15);

    try {
        const hashedPassword = await pbkdf2Async(req.body.password, salt, 310000, 16, 'sha256');

        const result = await Mongo.db
            .collection<IUser>(collectionName)
            .insertOne({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
                salt,
            })

        if(!result.insertedId) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: { text: 'Failed to create user.' }
            });
        }

        const user = await Mongo.db
            .collection<IUser>(collectionName)
            .findOne({ _id: new ObjectId(result.insertedId) })

        if(!user) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: { text: 'Failed to retrieve user after creation.' }
            });
        }

        const { password: _p, salt: _s, ...safeUser } = user;
        const token = jwt.sign(safeUser, JWT_SECRET);

        return res.send({
            success: true,
            statusCode: 200,
            body: {
                text: 'User registered correctly!',
                token,
                user: safeUser,
                logged: true
            }
        });
    } catch (_error) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: { text: 'Error during user creation.' }
        });
    }
});

authRouter.post('/login', loginValidation, (req: Request, res: Response) => {
    passport.authenticate('local', (error: any, user: any) => {
        if(error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error during authentication.',
                }
            });
        }

        if(!user) {
            return res.status(401).send({
                success: false,
                statusCode: 401,
                body: {
                    text: 'Credentials are not correct',
                }
            });
        }

        const token = jwt.sign(user, JWT_SECRET);
        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: 'User logged in correctly.',
                user,
                token
            }
        });
    })(req, res)
});

export default authRouter;
