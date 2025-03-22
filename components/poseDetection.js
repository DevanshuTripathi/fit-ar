// "use client"; // Required for Next.js App Router

// import { useEffect, useRef } from "react";
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import * as tf from "@tensorflow/tfjs-core"; // Core TensorFlow.js
// import "@tensorflow/tfjs-backend-webgl"; // GPU acceleration
// import "@tensorflow/tfjs-backend-cpu";   // Fallback to CPU

// const PoseDetection = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const setupCamera = async () => {
//       const video = videoRef.current;
//       if (!video) return;

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       video.srcObject = stream;
//       await video.play();
//     };

//     const loadPoseModel = async () => {
//       await tf.ready(); // Ensure TensorFlow.js backend is ready

//       const detectorConfig = {
//         modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
//       };
//       const detector = await poseDetection.createDetector(
//         poseDetection.SupportedModels.MoveNet,
//         detectorConfig
//       );

//       const detectPose = async () => {
//         if (!videoRef.current || !canvasRef.current) return;

//         const poses = await detector.estimatePoses(videoRef.current);
//         const ctx = canvasRef.current.getContext("2d");
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         if (poses.length > 0) {
//           poses[0].keypoints.forEach((point) => {
//             ctx.beginPath();
//             ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
//             ctx.fillStyle = "red";
//             ctx.fill();
//           });
//         }

//         requestAnimationFrame(detectPose);
//       };

//       detectPose();
//     };

//     setupCamera().then(loadPoseModel);
//   }, []);

//   return (
//     <div className="relative">
//       <video ref={videoRef} className="absolute w-full h-full" autoPlay muted />
//       <canvas ref={canvasRef} className="absolute w-full h-full" />
//     </div>
//   );
// };

// export default PoseDetection;
