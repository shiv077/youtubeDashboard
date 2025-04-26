"use client";

import { useState } from "react";
import { videos } from "@/lib/videoData";

export default function Sidebar({ onVideoSelect }) {
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const videosPerPage = 10;

  const filteredVideos = videos.items.filter((video) => {
    const title = video.snippet.title.toLowerCase();
    const description = video.snippet.description.toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || description.includes(search);
  });

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col w-full">
      <div className="p-4">
        <input
          type="text"
          placeholder="🔍 Search videos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-y-auto overflow-x-hidden p-4 flex-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {currentVideos.length > 0 ? (
          currentVideos.map((video, index) => {
            const globalIndex = indexOfFirstVideo + index;
            const videoKey = `${video.id.videoId}_${globalIndex}`;

            return (
              <div
                key={videoKey}
                onClick={() => {
                  onVideoSelect({ videoId: video.id.videoId, videoKey });
                  setSelectedVideoKey(videoKey);
                }}
                className={`group flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 w-full ${
                  selectedVideoKey === videoKey
                    ? "bg-blue-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-md"
                />

                <div className="flex flex-col justify-between flex-1 overflow-hidden">
                  <p className="font-semibold text-sm text-white leading-tight line-clamp-2">
                    {video.snippet.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {video.snippet.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 w-full">
                    <span className="text-xs font-medium text-gray-300 truncate max-w-[50%]">
                      {video.snippet.channelTitle}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(video.snippet.publishTime).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center mt-10">
            No videos found.
          </div>
        )}
      </div>

      {filteredVideos.length > 0 && (
        <div className="flex items-center justify-center space-x-3 p-4 border-t border-gray-700">
          <PaginationButton
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            Icon={FirstIcon}
          />
          <PaginationButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            Icon={PrevIcon}
          />
          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <PaginationButton
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            Icon={NextIcon}
          />
          <PaginationButton
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            Icon={LastIcon}
          />
        </div>
      )}
    </div>
  );
}

function PaginationButton({ onClick, disabled, Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full ${
        disabled
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      <Icon />
    </button>
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
