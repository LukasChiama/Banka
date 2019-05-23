import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes';
import './database/index';

dotenv.config();
const { log } = console;
const app = express();
const PORT = process.env || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

// Handle errors
app.use((err, req, res, next) => {
  log(err.stack);
  res.status(500).json({ status: 500, error: "Oops! Something's not right!" });
  next();
});

router.use('/*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found! Go to the homepage using: /api/v1',
  });
});

app.listen(PORT, () => {
  log(`Sever running on port ${PORT}`);
});

export default app;
