import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration Cloudflare R2
const R2_CONFIG = {
  accountId: process.env.EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '',
  accessKeyId: process.env.EXPO_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.EXPO_PUBLIC_CLOUDFLARE_SECRET_ACCESS_KEY || '',
  bucketName: process.env.EXPO_PUBLIC_CLOUDFLARE_BUCKET_NAME || '',
  region: 'auto', // Cloudflare R2 utilise 'auto'
};

// Client S3 compatible avec R2
const r2Client = new S3Client({
  region: R2_CONFIG.region,
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

// Upload d'image vers R2
export const uploadImageToR2 = async (
  file: File | Blob,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: `profile-images/${fileName}`,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read', // Rendre l'image publique
    });

    await r2Client.send(command);
    
    // Retourner l'URL publique de l'image
    return `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/profile-images/${fileName}`;
  } catch (error) {
    console.error('Erreur lors de l\'upload vers R2:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
};

// Générer une URL signée pour upload direct
export const generateUploadUrl = async (
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: `profile-images/${fileName}`,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 heure
    return signedUrl;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL signée:', error);
    throw new Error('Erreur lors de la génération de l\'URL d\'upload');
  }
};

// Vérifier si la configuration est complète
export const isR2Configured = (): boolean => {
  return !!(R2_CONFIG.accountId && R2_CONFIG.accessKeyId && R2_CONFIG.secretAccessKey && R2_CONFIG.bucketName);
};
