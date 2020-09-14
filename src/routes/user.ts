import express, {Request, Response } from 'express';
import asyncHandler from '../middleware/async';
import usersModel from '../models/user';
import { getAllUsers, getUser } from '../query/usersAggregate';
import { getIsUserOnline } from '../utils/users';

const router = express.Router();

router.get('/single/:userId', asyncHandler(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const [user] = await usersModel.aggregate(getUser(userId))

    res.send({success: true, data: user})
}))

router.get('/:userId', asyncHandler(async (req: Request, res: Response) => {
    const {userId} = req.params;
    let users = await usersModel.aggregate(getAllUsers(userId))

    users = users.map(user => {
        user.isOnline = getIsUserOnline(user.userId);
        return user;
    })

    res.send({success: true, data: users})
}))

export default router;