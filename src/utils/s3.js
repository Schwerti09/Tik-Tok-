/**
 * AWS S3 helper utilities.
 *
 * Required environment variables:
 *   AWS_REGION          - e.g. "us-east-1"
 *   AWS_ACCESS_KEY_ID
 *   AWS_SECRET_ACCESS_KEY
 *   S3_BUCKET_NAME      - bucket that holds source uploads and processed clips
 */

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

let s3Client;

/**
 * Returns a shared S3Client instance.
 * @returns {S3Client}
 */
function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

/**
 * Uploads a buffer or readable stream to S3.
 * @param {string} key          - S3 object key (path inside the bucket)
 * @param {Buffer|Readable} body
 * @param {string} contentType  - MIME type, e.g. "video/mp4"
 * @returns {Promise<string>} Public HTTPS URL of the uploaded object
 */
async function uploadToS3(key, body, contentType) {
  const bucket = process.env.S3_BUCKET_NAME;
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
}

/**
 * Generates a pre-signed URL for downloading an S3 object.
 * @param {string} key           - S3 object key
 * @param {number} [expiresIn]   - Validity in seconds (default: 3600)
 * @returns {Promise<string>}
 */
async function getPresignedDownloadUrl(key, expiresIn = 3600) {
  const bucket = process.env.S3_BUCKET_NAME;
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(getS3Client(), command, { expiresIn });
}

/**
 * Downloads an S3 object and returns it as a Buffer.
 * @param {string} key
 * @returns {Promise<Buffer>}
 */
async function downloadFromS3(key) {
  const bucket = process.env.S3_BUCKET_NAME;
  const response = await getS3Client().send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  );
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Deletes an object from S3.
 * @param {string} key
 * @returns {Promise<void>}
 */
async function deleteFromS3(key) {
  const bucket = process.env.S3_BUCKET_NAME;
  await getS3Client().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  );
}

module.exports = { uploadToS3, getPresignedDownloadUrl, downloadFromS3, deleteFromS3 };
