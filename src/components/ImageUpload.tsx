import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { useState, ChangeEvent } from "react";

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string>("");

  // ファイル選択時のハンドラ
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // アップロード実行時のハンドラ
  const handleUpload = (): void => {
    if (!file) return;

    // 保存先パスを設定（例: "images/ファイル名"）
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // アップロードの進捗状況を監視
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error: Error) => {
        console.error("アップロードエラー:", error);
      },
      () => {
        // アップロード完了後にダウンロードURLを取得
        getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
          setDownloadURL(url);
        });
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">画像アップロード</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-gray-700"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          アップロード
        </button>
        {uploadProgress > 0 && (
          <p className="mt-4 text-center">アップロード進捗: {uploadProgress}%</p>
        )}
        {downloadURL && (
          <div className="mt-4 text-center">
            <p className="mb-2 break-words">ダウンロードURL: {downloadURL}</p>
            <img src={downloadURL} alt="アップロード画像" className="mx-auto rounded shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
