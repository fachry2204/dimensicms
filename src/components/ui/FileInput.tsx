import React, { useRef } from 'react';
import { cn } from '../../lib/utils';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileInputProps {
  label: string;
  onFileSelect: (file: File) => void;
  preview?: string;
  accept?: string;
  className?: string;
}

const FileInput = ({ label, onFileSelect, preview, accept = "image/*", className }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div
        onClick={handleClick}
        className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <Upload className="h-8 w-8" />
            <span className="text-xs">Click to upload</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FileInput;
