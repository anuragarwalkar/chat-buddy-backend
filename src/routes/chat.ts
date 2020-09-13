import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middleware/async';
import chatModel from '../models/chat';
import ErrorResponse from '../shared/errorResponse';
import mongoose from 'mongoose';
const { Types: { ObjectId } } = mongoose;

const router = express.Router();

router.post('/history', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { sender, recipient } = req.body;

    if (!sender && !recipient) {
        return next(new ErrorResponse('Please send valid sender and recepient details', 400));
    }

    const chats = await chatModel.aggregate([
        {
            $match: {
                $or: [{$and: [{ sender: ObjectId(sender) },
                { recipient: ObjectId(recipient) }]},
                {$and: [{ sender: ObjectId(recipient) },
                { recipient: ObjectId(sender) }]}]
            }
        },
        {
            $lookup:
              {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderUserDetails"
              }
        },
        {
            $lookup:
            {
              from: "users",
              localField: "recipient",
              foreignField: "_id",
              as: "recepientUserDetails"
            } 
        },
        {
            $addFields: {
                isSender: {
                    $cond: {
                        if: { $eq: ["$sender", ObjectId(sender)] },
                        then: true,
                        else: false,
                    },
                },
                recepientUserDetails: { "$arrayElemAt": [ "$recepientUserDetails", 0 ] },
                senderUserDetails: { "$arrayElemAt": [ "$senderUserDetails", 0 ] }
            }
        }
        ,
        {
            $project: {
                _id: 0,
                fullName: "$senderUserDetails.fullName",
                message: 1,
                createdAt: 1,
                isSender: 1
            }
        }
    ])

    res.send({ success: true, data: chats })
}));

export default router;