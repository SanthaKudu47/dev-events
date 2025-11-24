import cloudinary from "cloudinary";
import { url } from "inspector";
import { overwrite } from "zod";

function extractCloudinaryPublicId(url: string): string {
  // Remove everything up to /upload/
  const parts = url.split("/upload/");
  const afterUpload = parts[1]; // e.g. "v1763640319/dev_events/ljf3ztrqjhc96hqtsmge.png"

  // Remove version if present (starts with v123456...)
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");

  // Remove file extension (.jpg, .png, etc.)
  return withoutVersion.replace(/\.[a-zA-Z]+$/, "");
}

export type cloudinaryUploadResponseType = cloudinary.UploadApiResponse;

export async function uploadImage(
  imageFile: File,
  options?: {
    overwrite: boolean;
    existingUrl: string;
  }
): Promise<cloudinaryUploadResponseType | undefined> {
  const imageArrayBuffer = await imageFile.arrayBuffer();
  const dataBuffer = Buffer.from(imageArrayBuffer);
  const additionalOptions: {
    public_id?: string;
    overwrite?: boolean;
    invalidate?: boolean;
  } = {};

  if (options && options.overwrite) {
    additionalOptions.public_id = extractCloudinaryPublicId(
      options.existingUrl
    );
    additionalOptions.overwrite = true;
    additionalOptions.invalidate = true;
  }
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: process.env.CLOUDINARY_FOLDER,
          ...additionalOptions,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          }
          resolve(uploadResult);
        }
      )
      .end(dataBuffer);
  });
}
