import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";



const PORT = process.env.PORT || 5000;

connectDB();
app.use("/api/resume", resumeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});