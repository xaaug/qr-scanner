"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function GeneratorPage() {
  const [text, setText] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
    toast.success("📥 QR code downloaded");
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("📋 Text copied!");
  };

  const handleShare = async () => {
    if (!text || !navigator.share) {
      toast.error("Sharing not supported");
      return;
    }
    try {
      await navigator.share({ text, title: "QR Code" });
    } catch {
      toast.error("Failed to share");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-6">
      {/* Intro */}
      <div className="text-center max-w-md mb-6">
        <h1 className="text-3xl font-bold mb-2">✨ QR Generator</h1>
        <p className="text-muted-foreground">
          Enter text, a link, or anything else — we’ll turn it into a QR code instantly ⚡
        </p>
      </div>

      {/* Input */}
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center">📝 Enter Your Content</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            placeholder="Paste a link, write text, WiFi creds..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* QR Code */}
      {text && (
        <Card className="mt-6 w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">🎉 Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div ref={qrRef} className="p-4 bg-white rounded-md">
              <QRCodeCanvas value={text} size={200} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopy}>📋 Copy Text</Button>
              <Button variant="secondary" onClick={handleDownload}>
                📥 Download
              </Button>
              <Button variant="outline" onClick={handleShare}>
                📤 Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
