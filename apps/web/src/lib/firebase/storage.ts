import { adminStorage } from './admin'
import { getStorage } from 'firebase-admin/storage'

/**
 * Generates a signed URL for a file in Firebase Storage.
 * @param path The path to the file in the bucket.
 * @param expiresAt The expiration date for the signed URL.
 */
export async function getSignedUrl(path: string, expiresAt: Date = new Date(Date.now() + 3600000)) {
  const bucket = adminStorage.bucket()
  const file = bucket.file(path)
  
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: expiresAt,
  })
  
  return url
}

/**
 * Deletes a file from Firebase Storage.
 * @param path The path to the file in the bucket.
 */
export async function deleteFile(path: string) {
  const bucket = adminStorage.bucket()
  await bucket.file(path).delete()
}

/**
 * Checks if a file exists in Firebase Storage.
 * @param path The path to the file in the bucket.
 */
export async function fileExists(path: string) {
  const bucket = adminStorage.bucket()
  const [exists] = await bucket.file(path).exists()
  return exists
}
