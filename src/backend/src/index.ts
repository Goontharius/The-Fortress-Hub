import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health';
import receiptsRouter from './routes/receipts';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/health', healthRouter);
app.use('/receipts', authMiddleware, receiptsRouter);

app.get('/', (req, res) => {
  res.send('The Fortress Hub backend is running.');
});

app.listen(port, () => {
  const tokenNote = process.env.API_TOKEN
    ? 'Using configured API token.'
    : 'Using default API token for local development.';
  console.log(`Backend running at http://localhost:${port}`);
  console.log(tokenNote);
});
