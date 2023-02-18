import mongoose from 'mongoose';
import config from 'config';
import { Config } from '../shared/models/config.model';

const dBConnection = async () =>{
    try {
        const { mongoUserName, mongoPassword } = config as Config;
        const options = {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify:false };
        const connection = await mongoose.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0.gxn0le4.mongodb.net/?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`)  
    } catch (error) {
        console.log(error.message)
    }   
}

export default dBConnection;