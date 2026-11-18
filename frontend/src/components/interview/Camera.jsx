import { useState, useEffect } from "react";
import { Camera, CameraOff, Video } from "lucide-react";

const CameraComponent = ({ videoRef }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError("Camera permission denied or camera not found.");
      }
    };

    if (isCameraOn) {
      startCamera();
    } else if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn, videoRef]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Video size={18} className="text-blue-600" />
          <span>Webcam Proctoring Preview</span>
        </div>
        <button
          type="button"
          onClick={toggleCamera}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            isCameraOn
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isCameraOn ? (
            <>
              <CameraOff size={14} /> Turn Off
            </>
          ) : (
            <>
              <Camera size={14} /> Turn On
            </>
          )}
        </button>
      </div>

      <div className="relative w-full aspect-video max-w-sm mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            !isCameraOn || cameraError ? "hidden" : "block"
          }`}
        />

        {(!isCameraOn || cameraError) && (
          <div className="text-center p-4">
            <CameraOff size={32} className="text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              {cameraError || "Camera is turned off"}
            </p>
          </div>
        )}

        {isCameraOn && !cameraError && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] text-white">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live Camera</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
