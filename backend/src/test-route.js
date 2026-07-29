import express from "express";
import instagramRoutes from "./routes/instagram.routes.js";
const app = express();
app.use("/api/instagram", instagramRoutes);
console.log(app._router.stack.map(l => l.regexp));
