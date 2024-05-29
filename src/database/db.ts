import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI || "mongodb+srv://aamirsaleem1282:admin1234@cluster0.ggjuo2g.mongodb.net/garbagedec?retryWrites=true&w=majority", {
            dbName: "garbagedec",
        });
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
            process.exit();
        });
    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
    }
}
