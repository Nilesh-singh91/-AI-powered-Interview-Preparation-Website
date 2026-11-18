import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "AI-Interview-Platform/Resumes",
    resource_type: "raw",
    public_id: Date.now().toString(),
  }),
});

const fileFilter = (req, file, cb) => {
  console.log("Original Name :", file.originalname);
  console.log("Mime Type :", file.mimetype);

  const lowerName = file.originalname.toLowerCase();
  const isPdf = file.mimetype === "application/pdf" || lowerName.endsWith(".pdf");
  const isDocx =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/octet-stream" ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc");

  if (isPdf || isDocx) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;