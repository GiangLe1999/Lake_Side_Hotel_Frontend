import { Heart, MapPin, Star } from "lucide-react";

// Enhanced Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      position: "Tech Executive",
      location: "New York",
      rating: 5,
      comment:
        "Absolutely incredible experience! From the seamless airport transfer to the breathtaking rooftop dining, every moment was perfect. The staff anticipated our every need.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      date: "2 weeks ago",
      stayDuration: "5 nights",
    },
    {
      name: "James Rodriguez",
      position: "Family Vacation",
      location: "California",
      rating: 5,
      comment:
        "Perfect family getaway! The kids club was amazing, pool area was safe and fun, and the family suite exceeded all expectations. Already planning our return trip!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      date: "1 month ago",
      stayDuration: "7 nights",
    },
    {
      name: "Emma Thompson",
      position: "Business Traveler",
      location: "London",
      rating: 5,
      comment:
        "Exceptional business facilities and service. The meeting rooms were state-of-the-art, WiFi was lightning fast, and the concierge handled all my arrangements flawlessly.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      date: "3 weeks ago",
      stayDuration: "3 nights",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-yellow-600 via-yellow-600 to-yellow-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Heart className="w-4 h-4 text-pink-500" />
            Guest Stories
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r text-white pb-6">
            Unforgettable Experiences
          </h2>

          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 guests who've discovered their perfect escape with
            us
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                {/* Floating orb */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-xl"></div>

                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-200">
                      {testimonial.position}
                    </p>
                    <p className="text-xs text-gray-300 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location} • {testimonial.stayDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">
                    {testimonial.date}
                  </span>
                </div>

                <p className="text-gray-200 leading-relaxed italic text-lg">
                  "{testimonial.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-12 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-medium">4.9/5 on Google</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200"></div>
              <span className="text-lg font-medium">4.8/5 on Booking.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-400"></div>
              <span className="text-lg font-medium">4.9/5 on TripAdvisor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
