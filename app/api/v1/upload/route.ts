// File: /app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; // Your configured Cloudinary instance
import { Readable } from "stream";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"; // Import Cloudinary types

// Helper function to convert Node.js Readable stream to Buffer
async function streamToBuffer(readableStream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (data) => {
      // Ensure data is Buffer
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject); // Handle stream errors
  });
}

// Define the expected structure of a successful upload result we care about
interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  original_filename: string;
  width: number;
  height: number;
}

export async function POST(req: NextRequest) {
  console.log("--- /api/upload START ---"); // Log start

  try {
    // 1. Get FormData
    const formData = await req.formData();
    console.log("FormData parsed.");

    // 2. Extract Files under the key 'files'
    // Use getAll to handle multiple files with the same key
    const files = formData.getAll("files") as File[];
    console.log(`Found ${files.length} file(s) under the key 'files'.`);

    if (!files || files.length === 0) {
      console.error("No files found in FormData under key 'files'.");
      return NextResponse.json(
        { error: 'No files provided under key "files"' },
        { status: 400 }
      );
    }

    // 3. Process each file upload concurrently
    const uploadPromises = files.map(
      async (file): Promise<CloudinaryUploadResult> => {
        console.log(
          `Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
        );

        // Convert File stream (Web API) to Node.js Readable stream, then to Buffer
        // Note: file.stream() returns a Web ReadableStream. We need Buffer for Cloudinary SDK's upload_stream.
        const nodeReadableStream = Readable.fromWeb(file.stream() as never); // Type assertion needed for fromWeb
        const buffer = await streamToBuffer(nodeReadableStream);
        console.log(`Buffer created for ${file.name}`);

        // Upload buffer to Cloudinary using upload_stream
        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER || "eventspace_uploads", // Use environment variable or default
              resource_type: "image", // Ensure it's treated as an image
              // Optional: Add tags, context, transformations etc.
              // tags: ['venue', 'upload'],
            },
            (
              error: UploadApiErrorResponse | undefined,
              result: UploadApiResponse | undefined
            ) => {
              if (error) {
                console.error(
                  `Cloudinary Upload Error for ${file.name}:`,
                  error
                );
                // Reject with a more specific error message
                reject(
                  new Error(
                    `Cloudinary upload failed for ${file.name}: ${
                      error.message || "Unknown Cloudinary error"
                    }`
                  )
                );
              } else if (result) {
                console.log(
                  `Cloudinary Upload Success for ${file.name}: ${result.public_id}`
                );
                // Resolve with the structured data we need
                resolve({
                  url: result.secure_url, // Always use secure_url
                  public_id: result.public_id,
                  original_filename: file.name, // Keep for reference if needed later
                  width: result.width,
                  height: result.height,
                });
              } else {
                // This case should ideally not happen if no error occurred, but handle defensively
                console.error(
                  `Cloudinary upload for ${file.name} finished without error or result.`
                );
                reject(
                  new Error(
                    `Cloudinary upload failed unexpectedly for ${file.name}.`
                  )
                );
              }
            }
          );

          // Pipe the buffer to the upload stream
          uploadStream.end(buffer);
        });
      }
    );

    // 4. Wait for all uploads to complete
    // Promise.allSettled might be better if you want partial success
    const results = await Promise.all(uploadPromises);
    console.log("All uploads processed.");

    // 5. Extract URLs (or full results if needed) for the response
    // The frontend currently expects { urls: string[] }
    const urls = results.map((result) => result.url);

    console.log("--- /api/upload END (Success) ---");
    // Return the array of URLs
    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("API Upload Route Error:", error);
    console.log("--- /api/upload END (Error) ---");
    // Provide a generic error message, log the specific details on the server
    return NextResponse.json(
      {
        error: "Failed to process file uploads.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET, PUT, DELETE handlers if needed, otherwise they default to 405 Method Not Allowed
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
// }
