import {
  Calendar,
  ChevronDown,
  Star,
  Sparkles,
  Crown,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

// Enhanced Hero Section
const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <section className="relative h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-1"></div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-40 animate-bounce delay-300"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-pulse delay-700"></div>

      <div
        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
        style={{
          backgroundImage: "url('/images/home-page/hero-banner.jpg')",
        }}
      ></div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl">
        <h1 className="font-bold mb-6 animate-fade-in tangerine-bold">
          <span className="text-6xl md:text-8xl bg-gradient-to-r from-white via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            LuxuryStay
          </span>
          <span className="text-4xl md:text-6xl block text-white drop-shadow-2xl">
            let's enjoy the comfort
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 font-light text-gray-100 max-w-3xl mx-auto leading-relaxed">
          Experience unparalleled elegance and world-class hospitality in our
          exclusive collection of luxury hotels
        </p>

        <div className="flex justify-center items-center gap-2 mb-8">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-2 text-sm text-gray-200">
            Rated 5 stars by our guests
          </span>
        </div>

        {/* Enhanced Booking Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto hover:bg-white/15 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="group">
              <label className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Check-in Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white/90 backdrop-blur-sm transition-all group-hover:border-white/40"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Check-out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white/90 backdrop-blur-sm transition-all group-hover:border-white/40"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <UsersRound className="w-4 h-4" />
                Guests
              </label>
              <div className="relative">
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 appearance-none bg-white/90 backdrop-blur-sm transition-all group-hover:border-white/40"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Guests</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-4 text-gray-600 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <button className="main-btn px-4 py-[10px] rounded-xl font-bold group">
              <Sparkles className="w-4 h-4 group-hover:rotate-[30deg] transition-transform duration-500" />
              Find Rooms
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
