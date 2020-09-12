import mongoose from "mongoose";
import config from 'config';
import jwt from 'jsonwebtoken';

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      unique:true
    },
    clientSecret: {
      type: String,
      required: true,
      minlength: 16
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

clientSchema.methods.generateAuthToken = function(cecId, name, role){
  const clientId = this.clientId;
  return jwt.sign({ clientId, name, cecId, role }, config.get('jwtPrivateKey'), { expiresIn:'1h' });
}

const clientModel = mongoose.model("Client", clientSchema);

export default clientModel;
