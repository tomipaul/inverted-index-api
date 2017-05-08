import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';

const setPort = () => {
  if (process.env.NODE_ENV === 'DEV') {
    return process.env.PORT_DEV;
  } else if (process.env.NODE_ENV === 'TEST') {
    return process.env.PORT_TEST;
  }
  return process.env.PORT_PROD || 8080;
};

dotenv.config();
const app = express();
const port = setPort();
app.use(bodyParser.json());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send('Request could not be completed. Please try again');
});
routes(app);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${port}`);
});

export default app;
