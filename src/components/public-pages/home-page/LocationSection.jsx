import {
  MapPin,
  Clock,
  Star,
  Plane,
  ShoppingBag,
  Camera,
  Building2,
  Car,
  Train,
} from "lucide-react";

const LocationSection = () => {
  const nearbyAttractions = [
    {
      name: "International Airport",
      distance: "45 min drive",
      icon: Plane,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      name: "Premium Shopping Mall",
      distance: "5 min walk",
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      name: "Art Museum",
      distance: "8 min walk",
      icon: Camera,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      name: "Historic District",
      distance: "12 min walk",
      icon: Building2,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      name: "Central Station",
      distance: "20 min walk",
      icon: Train,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Prime Location
              </div>

              <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Right in the Heart of Everything
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Strategically positioned in the city's vibrant core, our hotel
                offers unparalleled access to world-class attractions, luxury
                shopping, and cultural landmarks.
              </p>
            </div>

            {/* Nearby Attractions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                What's Nearby
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyAttractions.map((location, index) => {
                  const IconComponent = location.icon;
                  return (
                    <div
                      key={index}
                      className="group p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${location.bgColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${location.textColor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                            {location.name}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {location.distance}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
                alt="Prime Hotel Location"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

              {/* Floating Elements */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    4.9
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Location Rating</p>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">
                    Perfect Location
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    In the heart of the cultural district
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">
                      Highly rated by guests
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Icons */}
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 space-y-4">
              {[Car, Train, Plane].map((Icon, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Free Airport Shuttle
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Valet Parking Available
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Concierge Services
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
