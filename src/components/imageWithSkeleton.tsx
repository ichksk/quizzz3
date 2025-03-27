// components/ImageWithSkeleton.tsx

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;
