import React from 'react';

export const AnimatedCounter = ({ endValue, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startValue = 0;
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};
