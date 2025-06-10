export const maskEmail = (email) => {
  if (!email) return "";
  const [username, domain] = email.split("@");
  const visiblePart = username.slice(0, 2); // lấy 2 ký tự đầu
  return `${visiblePart}***@${domain}`;
};
