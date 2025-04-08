export const S3_CONFIG = {
  BUCKET_URL: 'https://cdn.jsdelivr.net',

  MODEL_URLS: {
    SPACE_STATION: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/LittlestTokyo.glb'
  }
};

export const getS3ModelUrl = (modelKey: keyof typeof S3_CONFIG.MODEL_URLS): string => {
  return S3_CONFIG.MODEL_URLS[modelKey];
};