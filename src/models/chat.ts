import mongoose from "mongoose";
const { Types: { ObjectId } } = mongoose;

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    sender: {
      type: ObjectId,
      required: true,
      ref: 'users'
    },
    recipient: {
       type: ObjectId,
       required: true,
       ref: 'users'
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

const clientModel = mongoose.model("Chats", chatSchema);

export default clientModel;
