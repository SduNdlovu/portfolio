import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { animated, to, useSpring, useTransition } from '@react-spring/web';

const lessMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const asset = path => `${import.meta.env.BASE_URL}${path}`;

const projects = [
  {
    src: asset('images/weather-app.png'),
    alt: 'Atmos weather app showing live conditions for London',
    label: 'Weather App'
  },
  {
    src: asset('images/movie-app.png'),
    alt: 'Movie Explorer home with featured film and trending titles',
    label: 'Movie Explorer'
  },
  {
    src: asset('images/portfolio.png'),
    alt: 'Siduduzo Ndlovu portfolio hero and featured project stage',
    label: 'Personal Portfolio'
  }
];

function PreviewShot({ project }) {
  const item = projects[project];
  return (
    <figure className="project-shot">
      <img src={item.src} alt={item.alt} width="1280" height="800" decoding="async" />
      <figcaption>{item.label}</figcaption>
    </figure>
  );
}

function SpringPreview() {
  const [project, setProject] = useState(0);
  const [reduced, setReduced] = useState(lessMotion);
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 960px)').matches);
  const [tilt, tiltApi] = useSpring(() => ({ rx: 0, ry: 0, press: 1, config: { mass: 1.1, tension: 320, friction: 22 } }));

  useEffect(() => {
    const onChange = event => { setProject(event.detail.index); tiltApi.start({ rx: 0, ry: 0, press: 1 }); };
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      setReduced(query.matches);
      if (query.matches) tiltApi.start({ rx: 0, ry: 0, press: 1, immediate: true });
    };
    const narrowQuery = window.matchMedia('(max-width: 960px)');
    const onNarrow = () => setNarrow(narrowQuery.matches);
    window.addEventListener('portfolio:project-change', onChange);
    query.addEventListener('change', onMotion);
    narrowQuery.addEventListener('change', onNarrow);
    return () => {
      window.removeEventListener('portfolio:project-change', onChange);
      query.removeEventListener('change', onMotion);
      narrowQuery.removeEventListener('change', onNarrow);
    };
  }, [tiltApi]);

  const transitions = useTransition(project, {
    from: { opacity: 0, y: reduced ? 0 : 48, scale: reduced ? 1 : .88, blur: reduced ? 0 : 10 },
    enter: { opacity: 1, y: 0, scale: 1, blur: 0 },
    leave: { opacity: 0, y: reduced ? 0 : -28, scale: reduced ? 1 : 1.04, blur: reduced ? 0 : 8 },
    immediate: reduced,
    config: { mass: 1, tension: 280, friction: 26 }
  });

  const move = event => {
    if (reduced || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    tiltApi.start({ rx: -y * 5, ry: x * 7, press: 1 });
  };
  const reset = () => tiltApi.start({ rx: 0, ry: 0, press: 1 });
  const baseRotation = narrow ? [0, 0, 0] : [-3, 3, -2];

  return transitions((spring, index) => <animated.div
    key={index}
    className="stage-card-wrap"
    style={{
      opacity: spring.opacity,
      filter: spring.blur.to(value => `blur(${value}px)`),
      transform: to([spring.y, spring.scale], (y, scale) => `translateY(${y}px) scale(${scale})`)
    }}
  ><animated.div
    className="preview-window preview-shot-window"
    style={{ transform: to([tilt.rx, tilt.ry, tilt.press], (rx, ry, press) => `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${baseRotation[index]}deg) scale(${press})`) }}
    onPointerMove={move}
    onPointerLeave={reset}
    onPointerDown={() => !reduced && tiltApi.start({ press: .97 })}
    onPointerUp={reset}
    onPointerCancel={reset}
  ><PreviewShot project={index} /></animated.div></animated.div>);
}

const mount = document.querySelector('#spring-core');
if (mount) createRoot(mount).render(<SpringPreview />);
