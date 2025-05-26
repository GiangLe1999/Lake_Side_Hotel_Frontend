export function createFileList(files) {
  const dataTransfer = new DataTransfer(); // hoặc new ClipboardEvent('').clipboardData (ít dùng hơn)

  files.forEach((file) => {
    dataTransfer.items.add(file);
  });

  return dataTransfer.files;
}
