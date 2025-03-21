export const ImagePreview = ({ image }: { image: string }) => {
  return (
    <img
      src={image}
      alt="アップロードした画像のプレビュー"
      className="max-w-full h-auto max-h-64 rounded-lg mx-auto select-none"
    />
  );
};
