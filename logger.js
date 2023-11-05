import fs from 'fs';

const pad = (number) => ((number < 10) ? `0${number}` : number);

export const getTimeString = () => {
  const event = new Date();
  return `${event.getFullYear()}-${pad(event.getMonth() + 1)}-${pad(event.getDate())} ${pad(event.getHours())}:${pad(event.getMinutes())}:${pad(event.getSeconds())}`;
};

let logInfo;
let logError;

if (process.env.NODE_ENV === 'development') {
  logInfo = { write: console.log };
  logError = { write: console.error };
} else {
  logInfo = fs.createWriteStream('./logs/stdout.log');
  logError = fs.createWriteStream('./logs/stderr.log');
}

export const logger = {
  info: (message) => {
    logInfo.write(`${getTimeString()} | [INFO] ${message}\n`);
  },
  error: (message) => {
    logError.write(`${getTimeString()} | [ERROR] ${message}\n`);
  },
};

export default logger;
