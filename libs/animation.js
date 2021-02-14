import Tween from './tween';

export default function(from, to, duration, easing, callback, delay = 0) {
  for(let prop in from) {
    setTimeout(() => {
      startAnimation(from[prop], to[prop], duration, easing, callback, prop);
    }, delay * 1000);
  }
};

function startAnimation(from, to, duration, easing, callback, prop) {
  let start = 0; // 起始帧
  const sumFrames = Math.floor(duration * 1000 / 17); // 总帧数 - 17ms每帧符合人眼看物体的规律
  let lastTime = Date.now();

  const step = function() {
    const curTime = Date.now();
    const interval = curTime - lastTime;

    if(!interval) {
      return requestAnimationFrame(step);
    }

    if(interval < 17) { // 看是否需要跳帧
      start++;
    } else {
      const _step = Math.floor(interval / 17);
      const _start = start + _step;
      start = _start >= sumFrames ? sumFrames : _start;
    }

    const value = Tween[easing](start, from, to - from, sumFrames);

    if(start < sumFrames) {
      requestAnimationFrame(step);
      callback({ prop, value });
    } else {
      return callback({ prop, value }, true);
    }

    lastTime = Date.now();
  };

  step();
}