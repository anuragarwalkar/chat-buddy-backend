import mongoose from 'mongoose';

const dBConnection = async () =>{
    try {
        const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;
        const options = {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify:false };
        const connection = await mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0-mbclo.gcp.mongodb.net/chatBuddy?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`)  
    } catch (error) {
        console.log(error.message)
    }   
}

export default dBConnection;