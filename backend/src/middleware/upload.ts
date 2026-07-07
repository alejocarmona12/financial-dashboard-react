import multer from "multer";
import path from "path";

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },

  filename: (req, file, cb) => {
    const nombre =
      Date.now() + path.extname(file.originalname);

    cb(null, nombre);
  },
});

// Solo aceptar PDFs
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;