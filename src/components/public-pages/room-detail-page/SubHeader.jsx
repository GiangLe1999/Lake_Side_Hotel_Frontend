import { ArrowLeft, Share2, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FavoriteBtn from "../../common/FavoriteBtn";

const SubHeader = ({ room }) => {
  const navigate = useNavigate();
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/room/${room?.id}`;

    // Check if Web Share API is supported (mainly on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: room?.name || "Room Details",
          text: `Check out this room: ${room?.name || "Amazing room"}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled the share or error occurred
        console.log("Share cancelled or failed", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setShowShareTooltip(true);

        // Reset after 2 seconds
        setTimeout(() => {
          setCopied(false);
          setShowShareTooltip(false);
        }, 2000);
      } catch (error) {
        // Fallback for older browsers
        console.log(error);
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);
        setShowShareTooltip(true);

        setTimeout(() => {
          setCopied(false);
          setShowShareTooltip(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="bg-white sticky top-16 z-[49] shadow">
      <div className="container mx-auto px-4 py-[15px]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-500 rounded-full transition-colors relative"
                title="Share room"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>

              {/* Tooltip */}
              {showShareTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap">
                  {copied ? "Link copied!" : "Share room"}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>

            <FavoriteBtn
              room={room}
              size={20}
              className="border-none shadow-none bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
