export const compareFileVsFile = (current, original) => {
  if (!current && !original) return true;
  if (!current || !original) return false;

  const currentFile = current.length ? current[0] : current;
  const originalFile = original.length ? original[0] : original;

  if (!currentFile || !originalFile) return false;

  return (
    currentFile.name === originalFile.name &&
    currentFile.size === originalFile.size &&
    currentFile.type === originalFile.type &&
    currentFile.lastModified === originalFile.lastModified
  );
};

export const compareFilesVsFiles = (current, original) => {
  if (!current && !original) return true;
  if (!current || !original) return false;

  const currentArray = Array.from(current);
  const originalArray = Array.from(original);

  if (currentArray.length !== originalArray.length) return false;

  for (let i = 0; i < currentArray.length; i++) {
    const currentFile = currentArray[i];
    const originalFile = originalArray[i];

    if (
      currentFile.name !== originalFile.name ||
      currentFile.size !== originalFile.size ||
      currentFile.type !== originalFile.type ||
      currentFile.lastModified !== originalFile.lastModified
    ) {
      return false;
    }
  }

  return true;
};

// Simple array
export const compareSimpleArrays = (arr1, arr2) => {
  if (!arr1 && !arr2) return true;
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, index) => item === arr2[index]);
};
