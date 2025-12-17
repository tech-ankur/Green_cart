import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongodb connected successfully");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}greencart`) }
    catch (error) {
        console.log("Error connecting to database", error);
    }}

    export default connectDB;