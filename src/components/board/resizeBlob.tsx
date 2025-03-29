export function resizeBlob(blob: Blob, width: number, height: number, isDark?: boolean): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const img = new Image();
  const url = URL.createObjectURL(blob);
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Failed to get context");
        URL.revokeObjectURL(url);
        return;
      }
      const { width, height } = img;
      const scale = Math.min(canvas.width / width, canvas.height / height);
      const x = (canvas.width - width * scale) / 2;
      const y = (canvas.height - height * scale) / 2;
      ctx.fillStyle = isDark ? "#101011" : "#f9fafb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, width * scale, height * scale);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
  });
}
