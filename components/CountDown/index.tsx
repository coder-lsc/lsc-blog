import { useEffect, useState } from 'react';

interface IProp {
  time: number;
  onEnd: Function;
}

const CountDown = ({ time, onEnd }: IProp) => {
  const [count, setCount] = useState(time || 60);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => {
        if (count === 0) {
          onEnd && onEnd();
          return count;
        }

        return count - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [time, onEnd]);

  return <div>{count}</div>;
};

export default CountDown;
