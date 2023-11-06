import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const PORT = process.env.PORT || 3999;

export const UPLOAD_DIR = path.join('.', 'uploads');
export const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

export const PUBLIC_FOLDER = path.join('.', 'public');
export const IMAGE_LIST_TEMPLATE = path.join(PUBLIC_FOLDER, 'image_list.html');
export const FAVICON_FILE = path.join(PUBLIC_FOLDER, 'favicon.ico');

export const { SECURE_USERNAME, SECURE_TOKEN } = process.env;
