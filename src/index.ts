import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import pembicaraRoute from './routes/pembicaraRoute.js';

const app = express();
const port = 3000;

// ️ PERBAIKAN: Mengizinkan domain localhost dan domain Vercel Live Anda
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://utsfrontend-kohl.vercel.app'
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes); 
app.use("/speakers", pembicaraRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});