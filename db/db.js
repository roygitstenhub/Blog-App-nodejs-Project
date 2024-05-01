import mongoose from "mongoose";

const database = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "storybookbase",
        })
 
        console.log("Connected to mongodb")

    } catch (error) {
        console.log(error)
    }
}

export default database;