import {
  Car,
  Coffee,
  Dumbbell,
  Phone,
  Shield,
  Sparkles,
  WavesLadder,
  Wifi,
  Wind,
} from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    name: "High-Speed WiFi",
    desc: "Unlimited fiber-optic internet",
    color: "from-blue-500 to-cyan-500",
    feature: "6GB/s Speed",
  },
  {
    icon: Car,
    name: "Valet Parking",
    desc: "Complimentary luxury service",
    color: "from-emerald-500 to-teal-500",
    feature: "24/7 Security",
  },
  {
    icon: Coffee,
    name: "Sky Lounge",
    desc: "360° city panoramic views",
    color: "from-amber-500 to-orange-500",
    feature: "Rooftop Access",
  },
  {
    icon: WavesLadder,
    name: "Infinity Pool",
    desc: "Temperature-controlled oasis",
    color: "from-cyan-500 to-blue-500",
    feature: "Adults Only",
  },
  {
    icon: Dumbbell,
    name: "Fitness Center",
    desc: "State-of-the-art equipment",
    color: "from-red-500 to-pink-500",
    feature: "Personal Trainer",
  },
  {
    icon: Phone,
    name: "Concierge Service",
    desc: "Personalized assistance",
    color: "from-purple-500 to-indigo-500",
    feature: "Multilingual",
  },
  {
    icon: Shield,
    name: "Premium Security",
    desc: "Advanced protection systems",
    color: "from-gray-600 to-gray-800",
    feature: "Biometric Access",
  },
  {
    icon: Wind,
    name: "Spa & Wellness",
    desc: "Rejuvenating treatments",
    color: "from-green-400 to-emerald-500",
    feature: "Organic Products",
  },
];

// Enhanced Amenities Section
const AmenitiesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            World-Class Amenities
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent pb-6">
            Luxury Redefined
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience unparalleled comfort with our carefully curated
            collection of premium amenities and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {amenities.map((amenity, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="rounded-3xl p-8 shadow transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-white/50 relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-100 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                ></div>

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${amenity.color} p-4 grid place-items-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <amenity.icon className="w-7 h-7 text-white mx-auto" />
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-gray-900 transition-colors">
                    {amenity.name}
                  </h3>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {amenity.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
