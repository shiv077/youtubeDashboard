"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoPlayer from "./components/VideoPlayer";

export default function HomePage() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-80">
        <Sidebar onVideoSelect={setSelectedVideo} />
      </div>

      <div className="flex-1 bg-gray-900">
        {selectedVideo ? (
          <VideoPlayer
            videoId={selectedVideo.videoId}
            videoKey={selectedVideo.videoKey}
          />
        ) : (
          <div className="text-white h-full flex items-center justify-center">
            <h2 className="text-2xl font-bold">Select a video</h2>
          </div>
        )}
      </div>
    </div>
  );
}
