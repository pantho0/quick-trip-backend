/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api,
  api_secret: config.cloud_api_secret,
});

export const uploadImage = async (
  imageName: string,
  path: string,
): Promise<UploadApiResponse | undefined> => {
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((_error) => {
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('File deleted');
        }
      });
    });

  if (uploadResult) {
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('File deleted');
      }
    });

    return uploadResult;
  }
};

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
