import { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function UploadZone({ onFileSelect, isProcessing }: UploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;

      const file = e.dataTransfer.files[0];
      if (file && isValidFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, isProcessing]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const isValidFile = (file: File): boolean => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Smart Excel Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Upload your Excel file and get instant, intelligent visualizations
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-3 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer bg-white shadow-sm"
        >
          <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <p className="text-xl font-medium text-gray-700 mb-2">
            Drop your Excel file here
          </p>
          <p className="text-gray-500 mb-6">or</p>

          <label className="inline-block">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              disabled={isProcessing}
              className="hidden"
            />
            <span className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer inline-block">
              {isProcessing ? 'Processing...' : 'Select File'}
            </span>
          </label>

          <p className="text-sm text-gray-500 mt-6">
            Supports .xlsx, .xls, and .csv files up to 50MB
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">01</div>
            <p className="text-sm text-gray-600">Auto-detect data types</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">02</div>
            <p className="text-sm text-gray-600">Generate smart charts</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">03</div>
            <p className="text-sm text-gray-600">Refine & export</p>
          </div>
        </div>
      </div>
    </div>
  );
}
