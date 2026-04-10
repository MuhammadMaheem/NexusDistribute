import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Buffer, folder: string = "nexus-distribute"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    uploadStream.end(file);
  });
}

export function getCloudinaryUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
  });
}

export function getThumbnailUrl(publicId: string, width: number = 300): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [{ width, crop: "fill" }],
  });
}
