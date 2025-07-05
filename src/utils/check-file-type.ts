export function checkFileType(file: File) {
  if (!file?.name || file.name.trim() === "") return false;

  // Only allow PDF and Word (doc, docx)
  const validMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (validMimeTypes.includes(file.type)) return true;

  // Fallback to extension check
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "doc" || ext === "docx";
}
