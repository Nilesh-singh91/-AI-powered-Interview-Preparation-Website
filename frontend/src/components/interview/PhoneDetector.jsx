import { useState, useEffect, useRef } from "react";
import { Smartphone, AlertTriangle, ShieldCheck } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const PhoneDetector = ({ videoRef }) => {
  const [model, setModel] = useState(null);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        if (isMounted) {
          setModel(loadedModel);
          setModelLoading(false);
        }
      } catch (err) {
        console.warn("AI Proctoring model load error (phone detector):", err);
        if (isMounted) {
          setModelLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current) return;

    const detectPhone = async () => {
      try {
        if (
          videoRef.current &&
          videoRef.current.readyState === 4 &&
          !videoRef.current.paused
        ) {
          const predictions = await model.detect(videoRef.current);
          const hasPhone = predictions.some(
            (p) => p.class === "cell phone" && p.score > 0.45
          );
          setPhoneDetected(hasPhone);
        }
      } catch {
        // Silently skip failed detection frames
      }
    };

    intervalRef.current = setInterval(detectPhone, 1200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model, videoRef]);

  return (
    <div className="mb-6">
      {phoneDetected && (
        <div className="flex items-center gap-3 bg-red-50 border-2 border-red-500 rounded-2xl p-4 text-red-700 animate-bounce">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-sm">Phone Detected!</p>
            <p className="text-xs text-red-600">
              Please put your mobile device away during the interview to maintain integrity.
            </p>
          </div>
        </div>
      )}

      {!phoneDetected && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            <span>AI Proctoring: {modelLoading ? "Loading detector..." : "Active"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Smartphone size={14} />
            <span>No unauthorized devices</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneDetector;
