import { Star } from "lucide-react";
import React from "react";

const roomData = {
  id: 1,
  type: "Deluxe Ocean View Suite",
  description:
    "Experience luxury living with panoramic ocean views from our premium suite featuring modern amenities and elegant design.",
  price: 299,
  area: 45,
  beds: 2,
  rating: 4.8,
  reviewCount: 124,
  images: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
  ],
  features: [
    "Ocean view balcony",
    "Marble bathroom with rainfall shower",
    "Mini refrigerator and minibar",
    "24/7 concierge service",
    "Complimentary breakfast",
    "Daily housekeeping",
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
        "Absolutely stunning room with incredible ocean views. The service was exceptional and the amenities were top-notch.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "1 week ago",
      comment:
        "Perfect for our honeymoon! The room was spacious, clean, and the bed was so comfortable. Highly recommend!",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      date: "2 weeks ago",
      comment:
        "Great location and beautiful room. The only minor issue was the wifi speed, but everything else was perfect.",
    },
  ],
};

const Reviews = () => {
  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Guest Reviews</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(roomData.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-gray-800">{roomData.rating}</span>
          <span className="text-gray-500">
            ({roomData.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {roomData.reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-6 last:border-b-0"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
