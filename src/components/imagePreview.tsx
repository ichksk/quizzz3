import { useEffect, useState } from "react";

interface ImagePreviewProps {
  image: string;
  alt?: string;
  className?: string;
  width?: string;
  height?: string;
}

export const ImagePreview = ({
  image,
  className = "",
}: ImagePreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="max-w-full h-auto max-h-64 rounded-lg mx-auto inset-0 bg-gray-300 animate-pulse rounded" />
      )}
      <img
        src={image}
        alt={"クイズの画像"}
        onLoad={() => setIsLoaded(true)}
        className={`max-w-full h-auto max-h-64 rounded-lg mx-auto select-none ${isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
      />
    </>
  );
};
