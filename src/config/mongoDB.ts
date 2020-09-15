import mongoose from 'mongoose';
import config from 'config';
import { Config } from '../shared/models/config.model';

const dBConnection = async () =>{
    try {
        const { mongoUserName, mongoPassword } = config as Config;
        const options = {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify:false };
        const connection = await mongoose.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0-mbclo.gcp.mongodb.net/chatBuddy?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`)  
    } catch (error) {
        console.log(error.message)
    }   
}

export default dBConnection;