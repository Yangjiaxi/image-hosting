import path from 'path';
import fs from 'fs';
import express from 'express';
import moment from 'moment-timezone';
import { THUMBNAILS_DIR, UPLOAD_DIR, IMAGE_LIST_TEMPLATE } from './const.js';

const htmlTemplate = fs.readFileSync(IMAGE_LIST_TEMPLATE, 'utf8');
export const getImage = express.static(UPLOAD_DIR);

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const getFileData = async (uploadsDir, thumbnailsDir) => {
  const files = await fs.promises.readdir(uploadsDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

  const filesWithData = await Promise.all(imageFiles.map(async (file) => {
    const stats = await fs.promises.stat(path.join(uploadsDir, file));
    const thumbnailExists = await fs.promises.access(path.join(thumbnailsDir, file)).then(() => true).catch(() => false);
    return {
      name: file,
      size: formatBytes(stats.size),
      mtime: stats.mtime, // Keep as Date object for sorting
      thumbnail: thumbnailExists ? `/images/thumbnails/${file}` : null,
    };
  }));

  // Now sort by the mtime property, newest first
  filesWithData.sort((a, b) => b.mtime - a.mtime);

  return filesWithData.map((fileData) => ({
    ...fileData,
    mtime: moment(fileData.mtime).tz('Asia/Shanghai').format('YYYY-MM-DD, HH:mm:ss'),
  }));
};

const renderHTML = (filesData) => {
  let content = '';

  filesData.forEach((file) => {
    content += `<tr>
               <td><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></td>
               <td class='file-name'><a href="/images/${file.name}">${file.name}</a></td>
               <td>${file.size}</td>
               <td>${file.mtime}</td>
               <td>${file.thumbnail ? `<img class="lazy" data-src="${file.thumbnail}" src="" alt="Thumbnail" loading="lazy" style="width:100px;">` : 'No thumbnail'}</td>
             </tr>`;
  });

  return htmlTemplate.replace('<!-- Image_List_Content-->', content);
};

// export const getImagesList = (req, res) => {
//   getFileData(UPLOAD_DIR)
//     .then((filesData) => {
//       res.send(renderHTML(filesData));
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Server Error');
//     });
// };

export const getImagesList = async (req, res) => {
  try {
    const filesData = await getFileData(UPLOAD_DIR, THUMBNAILS_DIR);
    res.send(renderHTML(filesData));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
