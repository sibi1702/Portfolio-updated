# Setting Up CORS for Amazon S3 to Load 3D Models

This guide explains how to configure CORS (Cross-Origin Resource Sharing) on your Amazon S3 bucket to allow your portfolio website to load 3D models.

## What is CORS?

CORS is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the web page. When you try to load a 3D model from an S3 bucket on your website, the browser blocks this request unless the S3 bucket explicitly allows it.

## Step 1: Prepare Your CORS Configuration

Create a file named `cors-config.json` with the following content:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Cache-Control"],
    "MaxAgeSeconds": 86400
  }
]
```

Also, set the following metadata on your GLB files in S3:

- Cache-Control: max-age=31536000 (1 year)
- Content-Type: model/gltf-binary

For production, you should replace `"*"` in `"AllowedOrigins"` with your actual domain, like `"https://www.sibichandrasekar.com"`.

## Step 2: Apply CORS Configuration to Your S3 Bucket

### Using AWS Management Console

1. Sign in to the AWS Management Console
2. Navigate to the S3 service
3. Select your bucket from the list
4. Click on the "Permissions" tab
5. Scroll down to "Cross-origin resource sharing (CORS)"
6. Click "Edit"
7. Paste the JSON configuration from Step 1
8. Click "Save changes"

### Using AWS CLI

If you have the AWS CLI installed, you can run:

```bash
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration file://cors-config.json
```

Replace `your-bucket-name` with your actual bucket name.

## Step 3: Verify CORS Configuration

1. Wait a few minutes for the CORS settings to propagate
2. Restart your development server
3. Check if the 3D model loads correctly
4. If it still doesn't work, check browser console for specific CORS errors

## Additional Tips

1. Make sure your S3 bucket objects are publicly accessible or have appropriate permissions
2. Set the correct content type for your GLB files (application/octet-stream)
3. Consider enabling S3 bucket website hosting for better performance
4. Use CloudFront with your S3 bucket for better caching and performance

## Troubleshooting

If you still encounter CORS issues:

1. Verify that the CORS configuration is correctly applied
2. Check if your S3 bucket policy allows public access to the objects
3. Try accessing the S3 URL directly in the browser to check if it's accessible
4. Check if your domain is correctly specified in the AllowedOrigins
5. Clear browser cache and try again

For more information, refer to the [AWS S3 CORS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html).
