"use client";

import { useState } from "react";
import { videos } from "@/lib/videoData";

export default function Sidebar({ onVideoSelect }) {
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const videosPerPage = 10;
  const totalPages = Math.ceil(videos.items.length / videosPerPage);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.items.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search videos..."
          onChange={() => {}}
          className="w-full p-2 rounded bg-white text-black"
        />
      </div>

      <div className="overflow-y-auto p-4 flex-1 space-y-2">
        {currentVideos.map((video, index) => {
          const globalIndex = indexOfFirstVideo + index;
          const videoKey = `${video.id.videoId}_${globalIndex}`;
          return (
            <div
              key={videoKey}
              onClick={() => {
                onVideoSelect({ videoId: video.id.videoId, videoKey });
                setSelectedVideoKey(videoKey);
              }}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                selectedVideoKey === videoKey
                  ? "bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt=""
                className="w-16 h-16 rounded"
              />
              <div>
                <p className="font-bold text-sm">{video.snippet.title}</p>
                <p className="text-xs text-gray-400">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {new Date(video.snippet.publishTime).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center space-x-3 p-4 border-t border-gray-700">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FirstIcon />
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <PrevIcon />
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <NextIcon />
        </button>

        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <LastIcon />
        </button>
      </div>
    </div>
  );
}

function FirstIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 17L6 12l5-5M18 17V7"
      />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function LastIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5-5 5M6 7v10"
      />
    </svg>
  );
}
