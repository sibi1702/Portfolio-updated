export const S3_CONFIG = {
  BUCKET_URL: 'https://my-3d-assets.s3.us-east-2.amazonaws.com',

  MODEL_URLS: {
    // Primary model - your spacecraft
    SPACE_STATION: 'https://my-3d-assets.s3.us-east-2.amazonaws.com/space_station_3.glb',

    // Fallback model from a CDN with proper CORS configuration
    FALLBACK_MODEL: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'
  }
};

export const getS3ModelUrl = (modelKey: keyof typeof S3_CONFIG.MODEL_URLS): string => {
  return S3_CONFIG.MODEL_URLS[modelKey];
};