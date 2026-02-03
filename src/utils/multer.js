const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadFolder = path.join(__dirname, "../public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

exports.upload = multer({ storage });
