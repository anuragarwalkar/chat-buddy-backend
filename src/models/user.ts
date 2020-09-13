import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const clientSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    fullName: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

clientSchema.methods.generateAuthToken = function (userId: string, username: string, fullName: string, email: string) {
  return jwt.sign({ user: { username, fullName, email, userId } }, process.env.JWT_PRIVATE_KEY || 'dummyKey');
}

const clientModel = mongoose.model("Users", clientSchema);

export default clientModel;
