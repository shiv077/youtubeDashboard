// "use client";

// import { useEffect, useRef, useState } from "react";

// // Load YouTube API globally only once
// if (typeof window !== "undefined" && !window.YT) {
//   const tag = document.createElement("script");
//   tag.src = "https://www.youtube.com/iframe_api";
//   document.body.appendChild(tag);
// }

// export default function VideoPlayer({ videoId, videoKey, externalPlayerRef }) {
//   const playerRef = useRef(null);
//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [playerState, setPlayerState] = useState(null);

//   useEffect(() => {
//     if (!videoId || !videoKey) return;

//     let intervalId;

//     window.onYouTubeIframeAPIReady = () => {
//       loadPlayer();
//     };

//     if (window.YT && window.YT.Player) {
//       loadPlayer();
//     }

//     function loadPlayer() {
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }

//       playerRef.current = new window.YT.Player("player", {
//         videoId: videoId,
//         playerVars: {
//           controls: 0,
//           modestbranding: 1,
//           rel: 0,
//           fs: 0,
//           disablekb: 1,
//           playsinline: 1,
//           showinfo: 0,
//         },
//         events: {
//           onReady: (event) => {
//             setIsPlayerReady(true);
//             setDuration(event.target.getDuration());

//             if (externalPlayerRef) {
//               externalPlayerRef.current = event.target;
//             }

//             const savedTime = localStorage.getItem(
//               `video-progress-${videoKey}`
//             );
//             if (savedTime) {
//               event.target.seekTo(parseFloat(savedTime));
//             }

//             intervalId = setInterval(updateTime, 1000);
//           },
//           onStateChange: (event) => {
//             setPlayerState(event.data);
//           },
//         },
//       });
//     }

//     function updateTime() {
//       if (
//         playerRef.current &&
//         typeof playerRef.current.getCurrentTime === "function"
//       ) {
//         const time = playerRef.current.getCurrentTime();
//         setCurrentTime(time);

//         if (videoKey && playerRef.current.getPlayerState() === 1) {
//           localStorage.setItem(`video-progress-${videoKey}`, time.toString());
//         }
//       }
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//       if (playerRef.current) playerRef.current.destroy();
//     };
//   }, [videoId, videoKey, externalPlayerRef]);

//   const handleTogglePlayPause = () => {
//     if (!isPlayerReady || !playerRef.current) return;
//     const state = playerRef.current.getPlayerState();
//     if (state === 1) {
//       playerRef.current.pauseVideo();
//     } else {
//       playerRef.current.playVideo();
//     }
//   };

//   const handleSeek = (e) => {
//     if (!playerRef.current || !duration) return;
//     const rect = e.target.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const newTime = (clickX / rect.width) * duration;
//     playerRef.current.seekTo(newTime);
//     setCurrentTime(newTime);
//   };

//   const formatTime = (seconds) => {
//     if (isNaN(seconds)) return "00:00:00";
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${hrs.toString().padStart(2, "0")}:${mins
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const progressPercent = duration ? (currentTime / duration) * 100 : 0;

//   if (!videoId) return <div className="text-white">No video selected.</div>;

//   return (
//     <div className="flex flex-col items-center w-full h-full p-4">
//       <div className="w-full aspect-video bg-black max-w-4xl mx-auto">
//         <div id="player" className="w-full h-full"></div>
//       </div>

//       <div className="flex space-x-4 mt-4">
//         <button
//           onClick={handleTogglePlayPause}
//           className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-full flex items-center justify-center"
//         >
//           {playerState === 1 ? <PauseIcon /> : <PlayIcon />}
//         </button>
//       </div>

//       <div className="w-full max-w-4xl mt-6">
//         <div className="text-white mb-2 text-center">
//           {formatTime(currentTime)} / {formatTime(duration)}
//         </div>
//         <div
//           className="relative w-full h-2 bg-gray-300 rounded cursor-pointer"
//           onClick={handleSeek}
//         >
//           <div
//             className="absolute top-0 left-0 h-2 bg-red-600 rounded"
//             style={{ width: `${progressPercent}%` }}
//           />
//           <div
//             className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"
//             style={{ left: `${progressPercent}%`, marginLeft: "-8px" }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function PlayIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-8 w-8"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M14.752 11.168l-5.197-3.028A1 1 0 008 9.028v5.944a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z"
//       />
//     </svg>
//   );
// }

// function PauseIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-8 w-8"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
//     </svg>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoPlayer({ videoId, videoKey }) {
  const iframeContainerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (!iframeContainerRef.current) return;

    if (typeof window !== "undefined" && window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (player) player.destroy();
    };
  }, [videoId]);

  function createPlayer() {
    if (!iframeContainerRef.current) return;

    if (player) player.destroy();

    const newPlayer = new window.YT.Player(iframeContainerRef.current, {
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          const totalDuration = event.target.getDuration();
          setDuration(totalDuration);

          const savedTrim = localStorage.getItem(`trim-${videoKey}`);
          if (savedTrim) {
            const { start, end } = JSON.parse(savedTrim);
            setTrimStart(start);
            setTrimEnd(end);
          } else {
            setTrimStart(0);
            setTrimEnd(totalDuration);
          }

          setPlayerReady(true);
        },
      },
    });

    setPlayer(newPlayer);
  }

  useEffect(() => {
    if (playerReady && player && typeof player.seekTo === "function") {
      // player.seekTo(trimStart);
      setCurrentTime(trimStart);
    }
  }, [playerReady, videoId, trimStart]);

  const startMonitoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === "function") {
        const time = player.getCurrentTime();
        setCurrentTime(time);

        if (time >= trimEnd) {
          player.pauseVideo();
          setIsPlaying(false);
          player.seekTo(trimStart);
          clearInterval(intervalRef.current);
        }
      }
    }, 300);
  };

  const handlePlayPause = () => {
    if (!player) return;

    const time = player.getCurrentTime();
    if (time < trimStart || time >= trimEnd) {
      player.seekTo(trimStart);
    }

    const state = player.getPlayerState();
    if (state === 1) {
      player.pauseVideo();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      player.playVideo();
      setIsPlaying(true);
      startMonitoring();
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingHandle || !duration) return;

    const bar = document.getElementById("trim-bar");
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const time = percent * duration;

    if (draggingHandle === "start" && time < trimEnd) {
      setTrimStart(time);
    } else if (draggingHandle === "end" && time > trimStart) {
      setTrimEnd(time);
    }
  };

  const handleMouseUp = () => {
    setDraggingHandle(null);

    localStorage.setItem(
      `trim-${videoKey}`,
      JSON.stringify({ start: trimStart, end: trimEnd })
    );
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!videoId) return <div className="text-white">No video selected</div>;

  const trimmedWidth = trimEnd - trimStart;
  const progressPercent = trimmedWidth
    ? ((currentTime - trimStart) / trimmedWidth) * 100
    : 0;

  return (
    <div
      className="flex flex-col items-center w-full p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="w-full aspect-video bg-black max-w-4xl mx-auto">
        <div ref={iframeContainerRef} className="w-full h-full"></div>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePlayPause}
          className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="text-white text-sm mt-4 flex space-x-4">
        <span>Trim Left: {formatTime(trimStart)}</span>
        <span>Current: {formatTime(currentTime)}</span>
        <span>Trim Right: {formatTime(trimEnd)}</span>
      </div>

      <div
        id="trim-bar"
        className="relative w-full max-w-4xl h-5 mt-6 bg-gray-300 rounded overflow-hidden"
      >
        <div
          className="absolute top-0 h-5 bg-blue-500"
          style={{
            left: `${(trimStart / duration) * 100}%`,
            width: `${((trimEnd - trimStart) / duration) * 100}%`,
          }}
        >
          <div
            className="absolute top-1/2 w-2 h-6 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${progressPercent}%`,
            }}
          ></div>
        </div>

        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(trimStart / duration) * 100}%` }}
          onMouseDown={() => setDraggingHandle("start")}
        ></div>

        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(trimEnd / duration) * 100}%` }}
          onMouseDown={() => setDraggingHandle("end")}
        ></div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.752 11.168l-5.197-3.028A1 1 0 008 9.028v5.944a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
    </svg>
  );
}
