import mongoose from "mongoose";

const ConnectMongoDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${process.env.MONGODB_NAME}`);
        console.log('mongo db connected successfully');
        return connection
    } catch (error) {
        console.log('error at mongodb connection');
    }
}

export default ConnectMongoDb;