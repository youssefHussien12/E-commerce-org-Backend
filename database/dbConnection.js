import mongoose from "mongoose";




export const dbConn = async () => {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log("database connected successfully.");
    }).catch((err) => {
        console.error("database disconnected.", err);
    })
};


