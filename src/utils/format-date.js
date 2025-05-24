function formatDate(dateString, formatType = "dd/MM/yyyy HH:mm:ss") {
  const date = new Date(dateString);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Tháng từ 0-11
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  switch (formatType) {
    case "dd/MM/yyyy":
      return `${day}/${month}/${year}`;
    case "dd-MM-yyyy":
      return `${day}-${month}-${year}`;
    case "yyyy/MM/dd":
      return `${year}/${month}/${day}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "dd/MM/yyyy HH:mm":
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case "dd/MM/yyyy HH:mm:ss":
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    case "HH:mm:ss":
      return `${hours}:${minutes}:${seconds}`;
    case "HH:mm":
      return `${hours}:${minutes}`;
    default:
      // Nếu không đúng định dạng trên, trả về ISO string rút gọn
      return date.toISOString();
  }
}

export default formatDate;
