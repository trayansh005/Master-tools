import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    // Fallback: if no extension, derive from mimetype
    if (!ext) {
      const mimeExt = file.mimetype.split("/")[1]; // e.g. "jpeg", "png"
      ext = "." + mimeExt;
    }

    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const upload = multer({ storage });

export default upload;
