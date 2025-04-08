export const S3_CONFIG = {
  BUCKET_URL: 'https://market-assets.fra1.cdn.digitaloceanspaces.com',

  MODEL_URLS: {
    // Using a publicly available 3D model for testing
    SPACE_STATION: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/satellite/model.gltf'
  }
};

export const getS3ModelUrl = (modelKey: keyof typeof S3_CONFIG.MODEL_URLS): string => {
  return S3_CONFIG.MODEL_URLS[modelKey];
};