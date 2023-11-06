import express, { Router } from 'express';
import fs from 'fs';
import https from 'https';
import favicon from 'serve-favicon';

import logger from './logger.js';
import { FAVICON_FILE, PORT } from './const.js';
import { getImage, getImagesList } from './downloader.js';
import { authChecker, cors, errorHandler, infoLogger, jsonParser, noMatch, urlencodedParser } from './middlewares.js';
import { imageUploader, multerExceptionCatcher, uploadStorage } from './uploader.js';

const app = express();

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors);
app.use(infoLogger);

app.use(favicon(FAVICON_FILE));

// get image / imageList
const getRouter = Router();
getRouter.get('/', authChecker, getImagesList);
getRouter.use('/image', getImage);
app.use(getRouter);

// post image
const postRouter = Router();
postRouter.post('/upload', uploadStorage.single('image'), multerExceptionCatcher, imageUploader);
app.use(postRouter);

app.use(noMatch);
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  const server = https.createServer({
    key: fs.readFileSync('keys/api.key'),
    cert: fs.readFileSync('keys/api.pem'),
  }, app);
  server.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
  });
} else {
  app.listen(PORT);
  logger.info('Under development mode!');
}
