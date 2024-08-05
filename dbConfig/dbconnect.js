import mongoose from "mongoose"


export const dbConnection = () => {
    mongoose.connect(process.env.Mongo_URI, {
        dbName: "Unique_Bazar",
    }).then(() => {
        console.log("Successfully Connected to database!..........");
    }).catch(err => {
        console.log(`Error occur while connecting to database ${err}`);
    })
}