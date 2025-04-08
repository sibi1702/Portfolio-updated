import React, { useState, useRef } from 'react';

const VideoBackground: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    console.log('VideoBackground mounted');
    console.log('Video path:', '/videos/background.mp4');
    return () => console.log('VideoBackground unmounted');
  }, []);

  const handleVideoError = () => {
    const video = videoRef.current;
    if (video?.error) {
      setError(video.error.message || 'Error loading video');
      console.error('Video error:', video.error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-transparent flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-transparent flex items-center justify-center text-white">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => {
          setIsLoading(false);
          console.log('Video loaded successfully');
        }}
        onError={handleVideoError}
        className="absolute min-h-full min-w-full object-cover"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      {/* Very subtle overlay to ensure text readability without darkening the video too much */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default VideoBackground;
