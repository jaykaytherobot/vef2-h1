import cloudinary from 'cloudinary';
import multer from 'multer';

import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  folder: '',
  allowedFormats: ['jpg', 'png', 'gif'],
});

const upload = multer({ storage });

export { upload };
