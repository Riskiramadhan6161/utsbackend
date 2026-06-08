import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import pembicaraRoute from './routes/pembicaraRoute.js';
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoutes.js"

const app = express();
const port = 3000;

// 1. Aktifkan CORS terlebih dahulu
app.use(cors());

// 2. Body parser untuk JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 3. Registrasi Routes
app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes); 
app.use("/speakers", pembicaraRoute); // Diakses lewat http://localhost:3000/speakers
app.use("/users", userRoute);          // Diakses lewat http://localhost:3000/users
app.use("/login", authRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});