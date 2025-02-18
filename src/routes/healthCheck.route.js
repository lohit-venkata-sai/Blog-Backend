import { healthCheck } from "../controllers/healthCheck.js";
import express from 'express'
// import { Router } from "express";

const router = express.Router();

router.route('/').get(healthCheck);

export default router;
