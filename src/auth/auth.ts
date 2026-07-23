import express, { Request, Response } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const collectionName = 'users';

const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, callback: any) => {
    const user = await Mongo.db
        .collection(collectionName)
        .findOne({ email: email })

    if(!user) {
        return callback(null, false);
    }

    const saltBuffer = user.salt.buffer;

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

authRouter.post('/signup', async(req: Request, res: Response) => {
    const checkUser = await Mongo.db
        .collection(collectionName)
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

    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (error: any, hashedPassword: Buffer) => {
        if(error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypto password!',
                }
            });
        }

        const result = await Mongo.db
            .collection(collectionName)
            .insertOne({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
                salt,
            })

        if(result.insertedId) {
            const user = await Mongo.db
                .collection(collectionName)
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
        } else {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: { text: 'Failed to create user.' }
            });
        }
    });
});

authRouter.post('/login', (req: Request, res: Response) => {
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
