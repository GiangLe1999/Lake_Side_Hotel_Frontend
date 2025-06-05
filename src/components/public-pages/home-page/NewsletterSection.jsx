import { Bell, Crown, Gift, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden border-t border-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/20 to-pink-400/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4 text-yellow-600" />
              Exclusive Offers Inside
            </div>
            <h2 className="heading-2">Stay in the Loop of Luxury</h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our exclusive community and be the first to discover
              extraordinary deals, insider travel tips, and premium experiences
              tailored just for you
            </p>
          </div>

          {/* Enhanced Email Form */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl p-2 flex items-center shadow-2xl">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 rounded-xl font-bold main-btn"
                >
                  {isSubscribed ? (
                    <>
                      <span>Subscribed!</span>
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Bell className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            No spam, just pure luxury. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
