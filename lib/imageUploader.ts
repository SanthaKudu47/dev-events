import cloudinary from "cloudinary";
import { extractCloudinaryPublicId } from "./utils";

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

export async function removeImage(imageUrl: string) {
  return cloudinary.v2.uploader.destroy(
    extractCloudinaryPublicId(imageUrl),
    {
      resource_type: "image",
    }
  );

  
}
