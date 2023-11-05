import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3999;

export const UPLOAD_DIR = path.join('.', 'uploads');
export const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

export const IMAGE_LIST_TEMPLATE = path.join('.', 'image_list.html');

export const { SECURE_USERNAME, SECURE_TOKEN } = process.env;
