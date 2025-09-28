"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ScannerPage() {
  const [result, setResult] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // ✅ Start scanning
  const startScanner = async () => {
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        // Prefer the back camera
        const backCamera = cameras.find(
          (cam) =>
            cam.label.toLowerCase().includes("back") ||
            cam.label.toLowerCase().includes("rear")
        );
        const camId = backCamera ? backCamera.id : cameras[0].id;
  
        setCameraId(camId);
  
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
  
        await scanner.start(
          camId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            setResult(decodedText);
            toast.success("✅ QR code scanned!");
            stopScanner();
          },
          () => {}
        );
      } else {
        toast.error("🚫 No camera found");
      }
    } catch (err) {
      console.error("Scanner error:", err);
      toast.error("⚠️ Failed to start scanner");
    }
  };
  

  // ✅ Stop scanning
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.warn("Stop error:", e);
      }
      try {
        await scannerRef.current.clear();
      } catch (e) {
        console.warn("Clear error:", e);
      }
      scannerRef.current = null;
    }
  };
  
   
  interface TorchConstraints extends MediaTrackConstraintSet {
    advanced?: ({ torch?: boolean } & MediaTrackConstraintSet)[];
  }
  
  // ✅ Toggle flashlight if supported
  const toggleFlash = async () => {
    if (!scannerRef.current || !cameraId) return;
    try {
      const constraints: TorchConstraints = {
        advanced: [{ torch: !flashOn }],
      };
  
      await scannerRef.current.applyVideoConstraints(constraints);
  
      setFlashOn(!flashOn);
    } catch (err) {
      console.warn("Flash toggle error:", err);
      toast.error("Flashlight not supported on this device");
    }
  };
  
  
  // ✅ Handle file upload fallback
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const scanner = new Html5Qrcode("qr-reader");
    try {
      const result = await scanner.scanFile(file, true);
      setResult(result);
      toast.success("🖼️ QR code scanned from image!");
    } catch {
      toast.error("😕 Failed to scan image");
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("📋 Copied to clipboard!");
  };

  const handleOpen = () => {
    if (!result) return;
    try {
      const url = new URL(result);
      window.open(url.toString(), "_blank");
    } catch {
      toast.error("❌ Not a valid URL");
    }
  };

  const handleRescan = () => {
    setResult(null);
    startScanner();
  };

  useEffect(() => {
    if (!result) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <main className="flex flex-col items-center justify-center p-6">
      {/* Intro Section */}
      <div className="text-center max-w-md mb-6">
        <h1 className="text-3xl font-bold mb-2">📷 QR Scanner</h1>
        <p className="text-muted-foreground">
          Point your camera at a QR code to scan instantly, or upload an image 🖼️.
        </p>
      </div>

      {!result && (
        <Card className="w-full max-w-sm shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Live Camera</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div id="qr-reader" className="w-full rounded-md overflow-hidden" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={toggleFlash}>
                {flashOn ? "🔦 Flash Off" : "💡 Flash On"}
              </Button>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="secondary" asChild>
                  <span>🖼️ Upload</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6 w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">✅ Scan Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="break-all text-sm text-center">{result}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleCopy}>📋 Copy</Button>
              <Button variant="secondary" onClick={handleOpen}>
                🌐 Open
              </Button>
              <Button variant="outline" onClick={handleRescan}>
                🔄 Scan Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
