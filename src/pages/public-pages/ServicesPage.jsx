import React, { useState } from "react";
import {
  Sparkles,
  Crown,
  Car,
  Plane,
  Calendar,
  Users,
  MapPin,
  Clock,
  Shield,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Heart,
  Gift,
  Camera,
  Wine,
  Scissors,
  Dumbbell,
  Baby,
  DollarSign,
  Check,
  ArrowRight,
  Play,
} from "lucide-react";

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(0);

  const premiumServices = [
    {
      id: 1,
      title: "Personal Concierge",
      subtitle: "Your Dedicated Lifestyle Manager",
      description:
        "Experience white-glove service with your personal concierge available 24/7 to handle every detail of your stay.",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      features: [
        "Restaurant reservations & theater tickets",
        "Private shopping appointments",
        "Local insider recommendations",
        "Transportation arrangements",
        "Special occasion planning",
      ],
      price: "Complimentary for Suite Guests",
      icon: Crown,
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: 2,
      title: "VIP Airport Transfer",
      subtitle: "Seamless Luxury Transportation",
      description:
        "Begin your journey in style with our fleet of luxury vehicles and professional chauffeurs.",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
      features: [
        "Rolls-Royce & Mercedes fleet",
        "Meet & greet service",
        "Flight tracking system",
        "Champagne welcome service",
        "Private jet coordination",
      ],
      price: "From $150 per transfer",
      icon: Plane,
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: 3,
      title: "Event Planning",
      subtitle: "Unforgettable Celebrations",
      description:
        "Create magical moments with our award-winning event planning team for any special occasion.",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
      features: [
        "Wedding & anniversary packages",
        "Corporate event coordination",
        "Birthday & milestone celebrations",
        "Floral & decor arrangements",
        "Photography & videography",
      ],
      price: "Custom packages available",
      icon: Calendar,
      color: "from-pink-600 to-rose-600",
    },
    {
      id: 4,
      title: "Private Tours",
      subtitle: "Exclusive City Experiences",
      description:
        "Discover the city's hidden gems with our curated private tours led by expert local guides.",
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop",
      features: [
        "Historical & cultural tours",
        "Culinary experiences",
        "Art gallery & museum visits",
        "Helicopter city tours",
        "Customized itineraries",
      ],
      price: "From $200 per tour",
      icon: MapPin,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  const wellnessServices = [
    {
      name: "Serenity Spa",
      description: "World-class treatments using organic products",
      treatments: [
        "Deep tissue massage",
        "Facial rejuvenation",
        "Couples therapy",
        "Hot stone treatment",
      ],
      hours: "6:00 AM - 10:00 PM",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      name: "Fitness Center",
      description: "State-of-the-art equipment with personal trainers",
      treatments: [
        "Personal training",
        "Yoga classes",
        "Pilates sessions",
        "Nutrition consulting",
      ],
      hours: "24/7 Access",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    },
    {
      name: "Beauty Salon",
      description: "Premium hair and beauty services",
      treatments: [
        "Hair styling",
        "Manicure & pedicure",
        "Makeup services",
        "Bridal packages",
      ],
      hours: "9:00 AM - 8:00 PM",
      icon: Scissors,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    },
  ];

  const businessServices = [
    {
      title: "Executive Business Center",
      features: [
        "High-speed internet",
        "Private meeting rooms",
        "Printing & copying",
        "Video conferencing",
      ],
      availability: "24/7",
      icon: Users,
    },
    {
      title: "Conference Facilities",
      features: [
        "Multiple event spaces",
        "AV equipment",
        "Catering services",
        "Technical support",
      ],
      availability: "By appointment",
      icon: Calendar,
    },
    {
      title: "Secretary Services",
      features: [
        "Document preparation",
        "Translation services",
        "Administrative support",
        "Courier services",
      ],
      availability: "Business hours",
      icon: Phone,
    },
  ];

  const familyServices = [
    {
      name: "Kids Club",
      age: "Ages 4-12",
      activities: "Arts & crafts, games, movie nights, outdoor adventures",
      hours: "9:00 AM - 9:00 PM",
    },
    {
      name: "Babysitting Service",
      age: "All ages",
      activities: "Professional childcare with background-checked staff",
      hours: "On-demand 24/7",
    },
    {
      name: "Teen Lounge",
      age: "Ages 13-17",
      activities: "Gaming zone, social activities, supervised outings",
      hours: "2:00 PM - 11:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop')",
          }}
        ></div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Crown className="w-5 h-5 text-yellow-400" />
            Premium Services
          </div>

          <h1 className="font-bold mb-6 animate-fade-in tangerine-bold">
            <span className="text-6xl md:text-8xl bg-gradient-to-r from-white via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Exceptional
            </span>
            <span className="text-4xl md:text-6xl block text-white drop-shadow-2xl">
              Service Excellence
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 font-light text-gray-100 max-w-4xl mx-auto leading-relaxed">
            Discover our comprehensive collection of luxury services designed to
            exceed your every expectation and create unforgettable memories
          </p>

          <div className="flex justify-center items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-sm text-gray-200">
              Award-winning service team
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Services
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Video Tour
            </button>
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Signature Services
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Premium Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Indulge in our exclusive collection of personalized services, each
              crafted to deliver extraordinary moments
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-8">
                {premiumServices.map((service, index) => (
                  <div
                    key={service.id}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
                      activeService === index
                        ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl transform scale-105"
                        : "border-gray-200 hover:border-yellow-200 hover:shadow-lg"
                    }`}
                    onClick={() => setActiveService(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} p-3 flex items-center justify-center`}
                      >
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.subtitle}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          activeService === index
                            ? "rotate-90 text-yellow-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="relative h-80">
                    <img
                      src={premiumServices[activeService].image}
                      alt={premiumServices[activeService].title}
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {premiumServices[activeService].title}
                      </h3>
                      <p className="text-lg opacity-90">
                        {premiumServices[activeService].price}
                      </p>
                    </div>
                  </div>

                  <div className="p-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      What's Included:
                    </h4>
                    <div className="space-y-3">
                      {premiumServices[activeService].features.map(
                        (feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        )
                      )}
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2">
                      Request Service
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Services */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Wellness & Beauty
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Rejuvenate Your Senses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Escape to our world-class spa and wellness facilities, where
              tranquility meets luxury
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {wellnessServices.map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-white">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-3">
                      {service.treatments.map((treatment, treatmentIndex) => (
                        <div
                          key={treatmentIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            {treatment}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {service.hours}
                      </div>
                      <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Services */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Business Solutions
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Executive Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive business facilities and services designed for the
              modern executive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {businessServices.map((service, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {service.availability}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Services */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Baby className="w-4 h-4" />
              Family Services
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Family-Friendly Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Specialized services and activities designed to keep the whole
              family happy and entertained
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {familyServices.map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-pink-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <Baby className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-pink-600 font-medium mb-4">
                    {service.age}
                  </p>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.activities}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {service.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Floating elements */}
        <div className="absolute top-10 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-blue-400 rounded-full opacity-20 animate-bounce delay-500"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl mb-12 text-gray-200 leading-relaxed">
              Our dedicated service team is available 24/7 to assist with all
              your needs and ensure your stay exceeds expectations
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span>concierge@luxurystay.com</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Contact Concierge
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                View Service Menu
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
