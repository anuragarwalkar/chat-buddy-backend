import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middleware/async';
import chatModel from '../models/chat';
import ErrorResponse from '../shared/errorResponse';
import {getChatHistory} from '../query/chatsAggregate';

const router = express.Router();

router.post('/history', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { sender, recipient } = req.body;

    if (!sender && !recipient) {
        return next(new ErrorResponse('Please send valid sender and recepient details', 400));
    }

    const chats = await chatModel.aggregate(getChatHistory(sender, recipient))

    res.send({ success: true, data: chats })
}));

export default router;