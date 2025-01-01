import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'djey5j3lt',
  api_key: '447741478258655',
  api_secret: '<your_api_secret>', // Click 'View API Keys' above to copy your API secret
});

export const uploadImage = async ({
  imageName,
  path,
}: {
  imageName: string;
  path: string;
}): Promise<any> => {
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
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
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
