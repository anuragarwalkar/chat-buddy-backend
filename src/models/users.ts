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
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

clientSchema.methods.generateAuthToken = function (username: string, fullName: string, email: string) {
  return jwt.sign({ username, fullName, email }, 'anurag');
}

const clientModel = mongoose.model("Users", clientSchema);

export default clientModel;
