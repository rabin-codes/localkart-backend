import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Regular Customer',
      // Real person photo from Unsplash (diverse, professional)
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
      text: 'LocalKart has made shopping so convenient! Fresh products delivered to my doorstep within 30 minutes. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      role: 'Vendor Partner',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      text: 'LocalKart has helped me expand my business to a wider audience. The platform is user-friendly and the support is amazing.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'Delivery Partner',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      text: 'Great earnings opportunity with flexible working hours. I love being part of the LocalKart delivery family!',
      rating: 5,
    },
    {
      name: 'Sneha Reddy',
      role: 'Regular Customer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      text: 'Amazing variety of local products! The combo builder feature saved me so much money on delivery fees.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-4">What Our Users Say</h2>
          <p className="text-gray-600 text-lg">Trusted by thousands across our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 mb-6 italic text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-100"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=ff6b35&color=fff&size=48`;
                  }}
                />
                <div>
                  <p className="font-semibold text-secondary text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
