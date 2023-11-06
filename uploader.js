import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

import { THUMBNAILS_DIR, UPLOAD_DIR } from './const.js';

fs.promises.mkdir(THUMBNAILS_DIR, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    let cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]+/g, '_');
    cleanFileName = cleanFileName.replace(/_+/g, '_');

    const fileExtension = path.extname(cleanFileName);
    const baseName = path.basename(cleanFileName, fileExtension);

    const newFileName = `${baseName}-${Date.now()}${fileExtension}`;
    cb(null, newFileName);
  },
});

export const uploadStorage = multer({ storage });

export const imageUploader = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { filename } = req.file; // The filename as stored by multer
  const originalImagePath = req.file.path; // The full path to the uploaded image
  const thumbnailPath = path.join(THUMBNAILS_DIR, filename); // Path where the thumbnail will be saved

  try {
    await sharp(originalImagePath)
      .resize(200) // width = 200, keep-ratio
      .toFile(thumbnailPath);

    const remoteEndpoint = req.get('Host');
    const imageUrl = `${req.protocol}://${remoteEndpoint}/images/${filename}`;
    const thumbnailUrl = `${req.protocol}://${remoteEndpoint}/images/thumbnails/${filename}`;

    res.status(200).json({
      url: imageUrl,
      imgUrl: thumbnailUrl,
    });
  } catch (error) {
    console.error('Error processing the image:', error);
    res.status(500).send('Error processing the image.');
  }
};

export const multerExceptionCatcher = (error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
    return next({ message: 'Multiple images are not allowed. Please upload only one image.', error: 'error' });
  }
  next(error);
};
