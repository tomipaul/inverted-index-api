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
  return process.env.PORT_PROD || process.env.PORT;
};

dotenv.config();
const app = express();
const port = setPort();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods',
   'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', `accept, content-type,
   x-parse-application-id, x-parse-rest-api-key, x-parse-session-token`);
  next();
});
routes(app);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send('Request could not be completed. Please try again');
});
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${port}`);
});

export default server;
