import express from 'express'
import { UserRouter } from '../controller/user.controller.js';
const Routes = express.Router();


Routes.use("/user", UserRouter);


export { Routes }