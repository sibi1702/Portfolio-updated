import React from 'react';

import Home from './pages/home';
import VideoBackground from './components/common/VideoBackground';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <VideoBackground />
      <div className="fixed inset-0 bg-black/50 z-10" />
      <div className="relative z-20">
        <Home />
      </div>


    </div>
  );
};

export default App;
