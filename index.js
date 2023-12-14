import "dotenv/config";
import express from "express";
import bodyParser from "body-parser"; 
import cors from "cors";
import mongoose from "mongoose";
import booksRouter from "./routes/booksRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

const DB = process.env.CONNECTION_STRING;
mongoose.connect(DB);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/books", booksRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});