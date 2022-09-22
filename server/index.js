
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv"

dotenv.config();

import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";
import claimRouter from "./routes/claim.js";

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


//first parameter is the starting path
app.use('/posts', postRoutes);
app.use("/user", userRouter);
app.use("/claim", claimRouter);

const CONNECTION_URL = encodeURI(process.env.DATABASE_ACCESS);
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server is active on port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);

//useNewUrlParser true and useUnifiedTopology true are not required, but rather for warning purposes in the console. Same with mongoose.set