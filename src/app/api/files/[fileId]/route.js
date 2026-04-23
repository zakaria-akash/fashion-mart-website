import mongoose from "mongoose";
import { errorResponse } from "@/lib/api-response";
import { getGridFSBucket } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/files/[fileId]
 * Streams a file (usually a product image) directly from MongoDB GridFS.
 * Includes high-performance caching headers for efficient asset delivery.
 */
export async function GET(_request, { params }) {
  try {
    const { fileId } = await params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return errorResponse("INVALID_FILE_ID", "Invalid file id.", 400);
    }

    const bucket = await getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    
    // Look up file metadata in the bucket's .files collection
    const files = await bucket.find({ _id: objectId }).toArray();

    if (files.length === 0) {
      return errorResponse("FILE_NOT_FOUND", "File not found.", 404);
    }

    const file = files[0];
    const chunks = [];

    // Accumulate stream chunks into a single buffer
    await new Promise((resolve, reject) => {
      bucket
        .openDownloadStream(objectId)
        .on("data", (chunk) => chunks.push(chunk))
        .on("error", reject)
        .on("end", resolve);
    });

    // Return the file content with appropriate mime-type and cache control
    return new Response(Buffer.concat(chunks), {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return errorResponse("FILE_STREAM_FAILED", error.message, 500);
  }
}
