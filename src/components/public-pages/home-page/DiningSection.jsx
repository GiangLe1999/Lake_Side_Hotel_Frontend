import { Award, Camera, Clock, Play, Utensils } from "lucide-react";

// Dining Section
const DiningSection = () => {
  const restaurants = [
    {
      name: "Azure Rooftop",
      cuisine: "Contemporary Fine Dining",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description:
        "Michelin-starred cuisine with breathtaking 360° city views from our rooftop terrace",
      hours: "6:00 PM - 12:00 AM",
      specialty: "Molecular Gastronomy & Wine Pairing",
      chef: "Chef Marcus Williams",
      rating: "★★★ Michelin Guide",
      price: "$$$",
    },
    {
      name: "Garden Bistro",
      cuisine: "Farm-to-Table",
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      description:
        "Fresh, organic ingredients in a serene garden setting with live acoustic performances",
      hours: "11:00 AM - 10:00 PM",
      specialty: "Seasonal Menu & Craft Cocktails",
      chef: "Chef Isabella Chen",
      rating: "James Beard Nominated",
      price: "$$",
    },
    {
      name: "Ocean's Bounty",
      cuisine: "Seafood & Sushi",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      description:
        "Premium seafood flown in daily, featuring the world's finest sushi and raw bar",
      hours: "5:30 PM - 11:00 PM",
      specialty: "Omakase Experience & Live Tank Selection",
      chef: "Chef Takeshi Yamamoto",
      rating: "Zagat Top 50",
      price: "$$$$",
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Utensils className="w-4 h-4" />
            Culinary Excellence
          </div>

          <h2 className="heading-2">Award-Winning</h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embark on an extraordinary culinary journey crafted by
            world-renowned chefs using the finest ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 border border-gray-100 relative">
                <div className="relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-64 object-cover transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Price indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                    {restaurant.price}
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        {restaurant.cuisine}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{restaurant.name}</h3>
                    <p className="text-sm opacity-90">{restaurant.chef}</p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {restaurant.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{restaurant.hours}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-4 rounded-2xl border border-yellow-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-yellow-600">
                          Signature:
                        </span>{" "}
                        {restaurant.specialty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-3xl p-12 border border-yellow-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Private Dining Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Host unforgettable events in our exclusive private dining rooms
              with personalized menus and dedicated service
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-yellow-500" />
                <span>Chef's Table Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-yellow-500" />
                <span>Custom Menu Design</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Sommelier Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
