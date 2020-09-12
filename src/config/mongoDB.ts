import mongoose from 'mongoose';
import config from 'config';

const dBConnection = async () =>{
    try {
        const { mongoUserName, mongoPassword } = config as any;
        const options = {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify:false };
        const connection = await mongoose.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0-mbclo.gcp.mongodb.net/chatBuddy?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`)  
    } catch (error) {
        console.log(error.message)
    }   
}

export default dBConnection;