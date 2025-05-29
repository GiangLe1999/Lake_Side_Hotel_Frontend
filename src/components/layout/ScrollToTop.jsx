import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router-dom không tự động scroll lên đầu trang khi bạn điều hướng (<Link>, useNavigate, v.v.).
// Trình duyệt giữ lại vị trí cuộn cũ vì không có “reload” toàn trang.
// Sau khi dùng Component này, mỗi khi bạn chuyển route, trang sẽ tự động scroll lên đầu (top: 0).
// Có thể dùng behavior: "smooth" nếu bạn muốn hiệu ứng mượt.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // hoặc behavior: "smooth"
  }, [pathname]);

  return null;
};

export default ScrollToTop;
