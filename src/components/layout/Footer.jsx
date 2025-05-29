import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-to-br from-yellow-600 via-yellow-600 to-orange-600 text-white">
    <div className="container mx-auto px-4 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-xl font-bold mb-4">LuxuryStay</h3>
          <p className="text-gray-200 mb-4">
            Khách sạn cao cấp mang đến trải nghiệm nghỉ dưỡng tuyệt vời nhất cho
            bạn và gia đình.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 text-gray-200 hover:text-white cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 text-gray-200 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-gray-200 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2 text-gray-200">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Phòng & Giá
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Ưu đãi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Loại phòng</h4>
          <ul className="space-y-2 text-gray-200">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Room Type
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Room Type
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Room Type
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Room Type
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liên hệ</h4>
          <div className="space-y-2 text-gray-200">
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>+84 28 1234 5678</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>info@luxurystay.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#c1c1c13d] mt-8 py-4 text-xs text-center text-gray-200">
        <p>&copy; 2024 LuxuryStay. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
