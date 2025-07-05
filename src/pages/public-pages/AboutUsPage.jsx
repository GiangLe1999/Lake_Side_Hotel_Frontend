import React, { useState, useEffect } from "react";
import {
  Crown,
  Heart,
  Award,
  Users,
  Globe,
  Star,
  ChevronRight,
  MapPin,
  Calendar,
  Leaf,
  Zap,
  Target,
  Compass,
  Gift,
  Play,
  ArrowRight,
  Quote,
  CheckCircle,
  TrendingUp,
  Building,
  Lightbulb,
  Handshake,
} from "lucide-react";

const AboutUsPage = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const coreValues = [
    {
      icon: Heart,
      title: "Passionate Hospitality",
      description:
        "Every interaction is infused with genuine care and attention to detail, creating meaningful connections with our guests.",
      color: "from-red-500 to-pink-500",
      stats: "98% Guest Satisfaction",
    },
    {
      icon: Crown,
      title: "Luxury Excellence",
      description:
        "We maintain the highest standards in every aspect of our service, from amenities to experiences.",
      color: "from-yellow-500 to-orange-500",
      stats: "5-Star Rating",
    },
    {
      icon: Leaf,
      title: "Sustainable Luxury",
      description:
        "Committed to environmental responsibility while delivering uncompromising luxury experiences.",
      color: "from-green-500 to-emerald-500",
      stats: "Carbon Neutral",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously evolving our services and technology to exceed modern traveler expectations.",
      color: "from-blue-500 to-indigo-500",
      stats: "Tech Pioneer",
    },
  ];

  const milestones = [
    {
      year: "1985",
      title: "Foundation",
      description:
        "LuxuryStay was founded with a vision to redefine hospitality excellence.",
      icon: Building,
    },
    {
      year: "1995",
      title: "First Award",
      description:
        "Received our first 'World's Leading Luxury Hotel' award from travel industry.",
      icon: Award,
    },
    {
      year: "2005",
      title: "Global Expansion",
      description:
        "Opened our second location, beginning our journey as a luxury hotel collection.",
      icon: Globe,
    },
    {
      year: "2015",
      title: "Sustainability Initiative",
      description:
        "Launched comprehensive green program, becoming the first carbon-neutral luxury hotel.",
      icon: Leaf,
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description:
        "Pioneered contactless luxury service and smart room technology.",
      icon: Zap,
    },
    {
      year: "2024",
      title: "Excellence Recognition",
      description:
        "Achieved Triple Crown: Best Luxury Hotel, Best Service, Best Innovation awards.",
      icon: Crown,
    },
  ];

  const team = [
    {
      name: "James Wellington",
      position: "General Manager",
      experience: "15+ years",
      specialty: "Luxury hospitality leadership",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote:
        "Excellence is not a destination, it's a journey we embark on every single day.",
    },
    {
      name: "Sofia Martinez",
      position: "Director of Guest Experience",
      experience: "12+ years",
      specialty: "Personalized service design and cultural hospitality",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      quote:
        "Every guest has a unique story, and we're here to make it extraordinary.",
    },
    {
      name: "Chef Antoine Dubois",
      position: "Executive Chef",
      experience: "20+ years",
      specialty: "Michelin-starred cuisine and culinary innovation",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
      quote:
        "Culinary artistry is about creating memories that last a lifetime.",
    },
    {
      name: "Dr. Maya Patel",
      position: "Wellness Director",
      experience: "10+ years",
      specialty: "Holistic wellness programs and spa therapy",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      quote: "True luxury is the perfect harmony of mind, body, and spirit.",
    },
  ];

  const testimonials = [
    {
      quote:
        "LuxuryStay transformed our anniversary celebration into pure magic. Every detail was perfect, every moment unforgettable.",
      author: "Elizabeth & Michael Chen",
      occasion: "25th Anniversary",
      rating: 5,
    },
    {
      quote:
        "The level of personalized service here is unmatched. They anticipated our needs before we even knew them ourselves.",
      author: "Robert Harrison",
      occasion: "Business Executive",
      rating: 5,
    },
    {
      quote:
        "From the moment we arrived, we felt like royalty. This isn't just a hotel, it's an experience of a lifetime.",
      author: "Isabella Rodriguez",
      occasion: "Honeymoon",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop')",
          }}
        ></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-yellow-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 right-16 w-6 h-6 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-50 animate-bounce delay-700"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Crown className="w-5 h-5 text-yellow-400" />
            Est. 1985 - 40 Years of Excellence
          </div>

          <h1 className="font-bold mb-6 animate-fade-in tangerine-bold">
            <span className="text-6xl md:text-8xl bg-gradient-to-r from-white via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              LuxuryStay
            </span>
            <span className="text-4xl md:text-6xl block text-white drop-shadow-2xl">
              Where Stories Begin
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 font-light text-gray-100 max-w-4xl mx-auto leading-relaxed">
            For four decades, we've been crafting extraordinary experiences that
            transcend traditional hospitality. Discover the passion, heritage,
            and innovation that make LuxuryStay more than just a destination.
          </p>

          <div className="flex justify-center items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-sm text-gray-200">
              Consistently rated #1 worldwide
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-2">
              <Play className="w-5 h-5" />
              Our Story Video
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Meet Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Compass className="w-4 h-4" />
                  Our Heritage
                </div>
                <h2 className="text-5xl font-bold text-gray-800 mb-8">
                  A Legacy of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Excellence
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    In 1985, visionary hotelier Margaret Sterling opened the
                    doors of LuxuryStay with a simple yet revolutionary idea:
                    that true luxury lies not in opulence alone, but in the
                    artful combination of exceptional service, authentic
                    experiences, and genuine human connection.
                  </p>
                  <p>
                    What began as a boutique property has evolved into a
                    collection of world-renowned destinations, each one
                    carefully curated to reflect the unique character of its
                    location while maintaining our unwavering commitment to
                    excellence.
                  </p>
                  <p>
                    Today, LuxuryStay stands as a testament to the belief that
                    hospitality is an art form—one that requires passion,
                    precision, and an unwavering dedication to creating moments
                    that last a lifetime.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      40+
                    </div>
                    <div className="text-sm text-gray-600">
                      Years of Excellence
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      500K+
                    </div>
                    <div className="text-sm text-gray-600">Happy Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      150+
                    </div>
                    <div className="text-sm text-gray-600">Awards Won</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
                  <img
                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop"
                    alt="LuxuryStay Heritage"
                    className="w-full h-80 object-cover rounded-2xl mb-6"
                  />
                  <div className="text-center">
                    <Quote className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 italic mb-4">
                      "We don't just provide accommodation; we create
                      sanctuaries where dreams become reality and every moment
                      is touched by magic."
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Margaret Sterling</strong>
                      <br />
                      Founder & Visionary
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Our Values
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our core values are more than principles—they're the foundation of
              every interaction, every service, and every experience we create.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {coreValues.map((value, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
                      activeValue === index
                        ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl transform scale-105"
                        : "border-gray-200 hover:border-yellow-200 hover:shadow-lg"
                    }`}
                    onClick={() => setActiveValue(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${value.color} p-3 flex items-center justify-center`}
                      >
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {value.description}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {value.stats}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          activeValue === index
                            ? "rotate-90 text-yellow-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${coreValues[activeValue].color} p-4 flex items-center justify-center mb-6`}
                    >
                      {React.createElement(coreValues[activeValue].icon, {
                        className: "w-8 h-8 text-white",
                      })}
                    </div>

                    <h3 className="text-3xl font-bold mb-4">
                      {coreValues[activeValue].title}
                    </h3>
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                      {coreValues[activeValue].description}
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-semibold">
                          Impact Metrics
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-400 mb-2">
                        {coreValues[activeValue].stats}
                      </div>
                      <p className="text-sm text-gray-300">
                        Consistently measured across all our properties and
                        services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Our Journey
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Milestones of Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Four decades of innovation, growth, and unwavering commitment to
              hospitality excellence
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div
                        className={`inline-flex items-center gap-3 mb-4 ${
                          index % 2 === 0 ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <milestone.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {milestone.year}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-2/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Leadership Team
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Meet the Visionaries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our leadership team brings together decades of hospitality
              expertise, innovative thinking, and a shared passion for creating
              extraordinary experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-gray-100">
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {member.experience} in {member.specialty}
                    </p>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <Quote className="w-5 h-5 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        "{member.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Guest Stories
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Memories That Last Forever
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our greatest pride comes from the joy and satisfaction of our
              guests. Here are some of their cherished memories with us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-yellow-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-5 transform translate-x-16 -translate-y-16"></div>

              <div className="relative z-10 text-center">
                <Quote className="w-12 h-12 text-yellow-500 mx-auto mb-8" />

                <p className="text-2xl text-gray-800 font-light leading-relaxed mb-8 italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>

                <div className="flex justify-center items-center gap-2 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>

                <div className="mb-8">
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentTestimonial].occasion}
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentTestimonial === index
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-blue-400 rounded-full opacity-20 animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-green-400 rounded-full opacity-30 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">
              Ready to Create Your Story?
            </h2>
            <p className="text-xl mb-12 text-gray-200 leading-relaxed">
              Join the thousands of guests who have made LuxuryStay part of
              their most cherished memories. Let us craft an experience that's
              uniquely yours.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span>Multiple Locations Worldwide</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>150+ Industry Awards</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Start Your Journey
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Schedule a Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Recognition
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Awards & Accolades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence has been recognized by leading
              hospitality organizations worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "World Travel Awards",
                year: "2024",
                category: "World's Leading Luxury Hotel",
              },
              {
                name: "Forbes Travel Guide",
                year: "2024",
                category: "Five-Star Rating",
              },
              {
                name: "Condé Nast Traveler",
                year: "2024",
                category: "Gold List",
              },
              {
                name: "Travel + Leisure",
                year: "2024",
                category: "World's Best Hotels",
              },
              {
                name: "AAA Five Diamond",
                year: "2024",
                category: "Excellence Award",
              },
              { name: "Green Key", year: "2024", category: "Eco Excellence" },
            ].map((award, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-800 mb-1">
                  {award.name}
                </div>
                <div className="text-xs text-purple-600 mb-1">
                  {award.category}
                </div>
                <div className="text-xs text-gray-500">{award.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
