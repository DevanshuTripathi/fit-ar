"use client"; // Ensures this runs only on the client side in Next.js

import { useEffect, useRef } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let poseLandmarker;

  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use "environment" for rear camera
      });

      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();

        // Set video and canvas size
        if (canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        }
      };
    };

    const loadPoseModel = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      detectPose();
    };

    const detectPose = async () => {
      if (!poseLandmarker || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      setInterval(async () => {
        const poses = poseLandmarker.detectForVideo(video, performance.now());

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (poses.landmarks) {
          poses.landmarks[0].forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          });
        }
      }, 100);
    };

    setupCamera().then(loadPoseModel);
  }, []);

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute"
        style={{ width: "100%", height: "auto", maxWidth: "640px", border: "2px solid gray", borderRadius: "8px" }}
        autoPlay
        muted
        playsInline
      />
      
      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{ width: "100%", height: "auto", maxWidth: "640px" }}
      />
    </div>
  );
};

export default PoseDetection;
