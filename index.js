require('dotenv').config()
const express = require("express");

const {courseRouter} = require("./routes/course");
const {userRouter} = require("./routes/user");
const {adminRouter} = require("./routes/admin");
const mongoose = require("mongoose");

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
    await mongoose.connect(process.env.DB_KEY);
    app.listen(port, ()=> {
        console.log(`Listening to port ${port}`);
    })
}

main();