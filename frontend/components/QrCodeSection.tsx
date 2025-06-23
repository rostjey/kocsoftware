"use client";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

export default function QrCodeSection({ slug }: { slug: string }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrUrl = `https://kocsoftware.net/${slug}`;

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-semibold">QR Menü Kodu</h3>

      <div ref={qrRef} className="inline-block bg-white p-4 rounded-xl shadow-md">
        <QRCodeCanvas value={qrUrl} size={160} />
      </div>

      <button
        onClick={downloadQRCode}
        className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        QR Kodu İndir
      </button>
    </div>
  );
}
