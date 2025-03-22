"use client"; // Required for Next.js 13+ (App Router)

import { useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@mediapipe/pose";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;
      video.play();
    };

    const loadPoseModel = async () => {
      const detectorConfig = {
        runtime: "mediapipe",
        modelType: "full",
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose`,
      };
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        detectorConfig
      );

      const detectPose = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const pose = await detector.estimatePoses(video);
        
        // Draw Pose
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (pose.length > 0) {
          pose[0].keypoints.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          });
        }

        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    setupCamera().then(loadPoseModel);
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} className="absolute w-full h-full" autoPlay muted />
      <canvas ref={canvasRef} className="absolute w-full h-full" />
    </div>
  );
};

export default PoseDetection;
