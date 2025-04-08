export const S3_CONFIG = {
  BUCKET_URL: 'https://my-3d-assets.s3.us-east-2.amazonaws.com',

  MODEL_URLS: {
    SPACE_STATION: 'https://my-3d-assets.s3.us-east-2.amazonaws.com/space_station_3.glb'
  }
};

export const getS3ModelUrl = (modelKey: keyof typeof S3_CONFIG.MODEL_URLS): string => {
  return S3_CONFIG.MODEL_URLS[modelKey];
};