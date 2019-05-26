import '@babel/polyfill';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import './database/index';

dotenv.config();
const { log } = console;
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router);

// Handle errors
app.use((err, req, res, next) => {
  log(err.message);
  res.status(500).json({ status: res.statusCode, error: "Oops! Something's not right!" });
  next();
});

router.use('/*', (req, res) => {
  res.status(404).json({
    status: res.statusCode,
    message: 'Endpoint not found! Go to the homepage using: /api/v1',
  });
});

app.listen(port, () => {
  log(`Sever running on port ${port}`);
});

export default app;
