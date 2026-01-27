import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

interface SignatureCaptureProps {
  orderId: string;
  customerName: string;
  onSubmit: (orderId: string, imageData: string) => void;
  onCancel: () => void;
}

export function SignatureCapture({ orderId, customerName, onSubmit, onCancel }: SignatureCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onSubmit(orderId, capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCaptureMethod(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-300 p-4 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="font-medium">Capture Signature</h2>
            <p className="text-xs text-gray-600 mt-0.5">{customerName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!capturedImage && !captureMethod && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Choose how to capture the customer's signature
              </p>
              
              {/* Camera Option */}
              <button
                onClick={() => {
                  setCaptureMethod('camera');
                  cameraInputRef.current?.click();
                }}
                className="w-full border border-gray-300 p-4 flex items-center gap-3 hover:border-black transition-colors"
              >
                <Camera className="w-6 h-6" strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm font-medium">Take Photo</p>
                  <p className="text-xs text-gray-600">Use camera to capture signature</p>
                </div>
              </button>

              {/* Upload Option */}
              <button
                onClick={() => {
                  setCaptureMethod('upload');
                  fileInputRef.current?.click();
                }}
                className="w-full border border-gray-300 p-4 flex items-center gap-3 hover:border-black transition-colors"
              >
                <Upload className="w-6 h-6" strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm font-medium">Upload Image</p>
                  <p className="text-xs text-gray-600">Select from gallery</p>
                </div>
              </button>

              {/* Hidden Inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="border border-gray-300 p-2">
                <img
                  src={capturedImage}
                  alt="Signature preview"
                  className="w-full h-auto"
                />
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 border border-gray-200 p-3">
                <p className="text-xs text-gray-600">
                  Please verify the signature is clear and readable before submitting.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
                >
                  <Check className="w-4 h-4" strokeWidth={2} />
                  Confirm Delivery
                </button>
                <button
                  onClick={handleRetake}
                  className="w-full border border-gray-300 py-3 uppercase tracking-wider text-sm hover:border-black transition-colors"
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
