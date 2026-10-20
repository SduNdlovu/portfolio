import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { animated, to, useSpring, useTransition } from '@react-spring/web';

const lessMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function PreviewContent({ project }) {
  if (project === 0) return <>
    <div className="preview-top"><span>WEATHER / TODAY</span><span>YOUR CITY</span></div>
    <div className="weather-preview-body"><span className="sun-disc" /><strong>24°</strong><span>Clear skies</span><div className="weather-examples"><span>HUMIDITY<b>64%</b></span><span>CONDITIONS<b>Sunny</b></span></div></div>
  </>;
  if (project === 1) return (
    <div className="movie-preview-body">
      <div className="movie-preview-bar">
        <strong className="movie-preview-brand">MovieExplorer</strong>
        <div className="movie-preview-search">
          <span>Search movies...</span>
          <em>Search</em>
        </div>
      </div>
      <div className="movie-preview-rail">
        <h4>Trending</h4>
        <div className="movie-preview-posters" aria-hidden="true">
          <figure><span /><figcaption>North</figcaption></figure>
          <figure><span /><figcaption>Signal</figcaption></figure>
          <figure><span /><figcaption>Harbor</figcaption></figure>
          <figure><span /><figcaption>Atlas</figcaption></figure>
        </div>
      </div>
      <div className="movie-preview-rail movie-preview-rail-dim">
        <h4>Comedy</h4>
        <div className="movie-preview-posters" aria-hidden="true">
          <figure><span /><figcaption>Drift</figcaption></figure>
          <figure><span /><figcaption>Pulse</figcaption></figure>
          <figure><span /><figcaption>Orbit</figcaption></figure>
          <figure><span /><figcaption>Relay</figcaption></figure>
        </div>
      </div>
    </div>
  );
  return <>
    <div className="preview-top"><span>PERSONAL PORTFOLIO</span><span>S / N</span></div>
    <div className="portfolio-preview-body"><strong>IDEAS<br />INTO<br /><span>REALITY.</span></strong><small>DEVELOP · DESIGN · DELIVER</small></div>
  </>;
}

function SpringPreview() {
  const [project, setProject] = useState(0);
  const [reduced, setReduced] = useState(lessMotion);
  const [tilt, tiltApi] = useSpring(() => ({ rx: 0, ry: 0, press: 1, config: { mass: 1.5, tension: 240, friction: 24 } }));

  useEffect(() => {
    const onChange = event => { setProject(event.detail.index); tiltApi.start({ rx: 0, ry: 0, press: 1 }); };
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      setReduced(query.matches);
      if (query.matches) tiltApi.start({ rx: 0, ry: 0, press: 1, immediate: true });
    };
    window.addEventListener('portfolio:project-change', onChange);
    query.addEventListener('change', onMotion);
    return () => { window.removeEventListener('portfolio:project-change', onChange); query.removeEventListener('change', onMotion); };
  }, [tiltApi]);

  const transitions = useTransition(project, {
    from: { opacity: 0, y: reduced ? 0 : 38, scale: reduced ? 1 : .92 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: reduced ? 0 : -32, scale: reduced ? 1 : 1.06 },
    immediate: reduced,
    config: { mass: 1.25, tension: 260, friction: 27 }
  });

  const move = event => {
    if (reduced || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    tiltApi.start({ rx: -y * 5, ry: x * 7, press: 1 });
  };
  const reset = () => tiltApi.start({ rx: 0, ry: 0, press: 1 });
  const baseRotation = [-5, 4, -3];

  return transitions((spring, index) => <animated.div
    key={index}
    className="stage-card-wrap"
    style={{ opacity: spring.opacity, transform: to([spring.y, spring.scale], (y, scale) => `translateY(${y}px) scale(${scale})`) }}
  ><animated.div
    className={`preview-window ${['preview-weather', 'preview-movie', 'preview-portfolio'][index]}`}
    style={{ transform: to([tilt.rx, tilt.ry, tilt.press], (rx, ry, press) => `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${baseRotation[index]}deg) scale(${press})`) }}
    onPointerMove={move}
    onPointerLeave={reset}
    onPointerDown={() => !reduced && tiltApi.start({ press: .96 })}
    onPointerUp={reset}
    onPointerCancel={reset}
  ><PreviewContent project={index} /></animated.div></animated.div>);
}

const mount = document.querySelector('#spring-core');
if (mount) createRoot(mount).render(<SpringPreview />);
