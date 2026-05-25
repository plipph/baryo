import {
  FaFacebookF,
  FaFacebookMessenger,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaViber,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapLocationDot,
  FaWaze,
  FaCalendarCheck,
  FaStore,
  FaBagShopping,
  FaLink,
} from "react-icons/fa6";
import { SiShopee } from "react-icons/si";

type LinkIconProps = {
  type: string;
  className?: string;
};

export function LinkIcon({ type, className = "h-4 w-4" }: LinkIconProps) {
  switch (type) {
    case "facebook":
      return <FaFacebookF className={className} />;

    case "messenger":
      return <FaFacebookMessenger className={className} />;

    case "instagram":
      return <FaInstagram className={className} />;

    case "tiktok":
      return <FaTiktok className={className} />;

    case "youtube":
      return <FaYoutube className={className} />;

    case "whatsapp":
      return <FaWhatsapp className={className} />;

    case "viber":
      return <FaViber className={className} />;

    case "phone":
      return <FaPhone className={className} />;

    case "email":
      return <FaEnvelope className={className} />;

    case "website":
      return <FaGlobe className={className} />;

    case "google_maps":
      return <FaMapLocationDot className={className} />;

    case "waze":
      return <FaWaze className={className} />;

    case "booking":
      return <FaCalendarCheck className={className} />;

    case "menu":
      return <FaStore className={className} />;

    case "shop":
      return <FaBagShopping className={className} />;

    case "shopee":
      return <SiShopee className={className} />;

   case "lazada":
  return <FaBagShopping className={className} />;

    default:
      return <FaLink className={className} />;
  }
}