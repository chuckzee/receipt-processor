import express from 'express';
import receiptsRoutes from './routes/Receipts.routes';

const app = express();
const port = 3000;

// Apply middleware
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('hello fetch!');
});

// Apply routes
app.use('/receipts', receiptsRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}. Happy testing, Fetch!`);
});