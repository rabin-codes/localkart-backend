import React, { useEffect, useState } from 'react';

export const CountUp = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
};

export const StatsSection = () => {
  const stats = [
    { label: 'Happy Customers', value: 50000, suffix: '+' },
    { label: 'Vendors', value: 1000, suffix: '+' },
    { label: 'Orders Delivered', value: 100000, suffix: '+' },
    { label: 'Cities', value: 25, suffix: '' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">By The Numbers</h2>
          <p className="text-lg opacity-90">LocalKart's rapid growth and impact</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
