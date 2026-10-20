import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'animejs';
import 'trig-js';

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const header = document.querySelector('.site-header');
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('is-open');
}));

document.querySelector('#year').textContent = new Date().getFullYear();
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

const choices = [...document.querySelectorAll('.project-choice')];
const projectNames = ['Weather App', 'Movie Explorer', 'Personal Portfolio'];
let selectedProject = 0;
let activeAnime = [];

function selectProject(index) {
  if (index === selectedProject && choices[index].classList.contains('is-active')) return;
  activeAnime.forEach(animation => animation.cancel());
  activeAnime = [];
  selectedProject = index;
  choices.forEach((choice, choiceIndex) => {
    const active = choiceIndex === index;
    choice.classList.toggle('is-active', active);
    choice.setAttribute('aria-pressed', String(active));
    if (!reducedQuery.matches) {
      const line = choice.querySelector('.choice-line');
      activeAnime.push(animate(line, { scaleX: active ? 1 : 0, duration: active ? 460 : 170, ease: 'outExpo' }));
      if (active) activeAnime.push(animate(choice.querySelector('strong'), { x: [8, 0], duration: 400, ease: 'outExpo' }));
    }
  });
  document.querySelector('#stage-project-title').textContent = projectNames[index];
  document.querySelector('#stage-count').textContent = `${index + 1} / 3`;
  window.dispatchEvent(new CustomEvent('portfolio:project-change', { detail: { index } }));
}

choices.forEach((choice, index) => {
  choice.addEventListener('click', () => selectProject(index));
  choice.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : 2)) % choices.length;
    choices[next].focus();
    selectProject(next);
  });
});

if (!reducedQuery.matches && !location.hash) {
  animate('.project-choice', { opacity: [.65, 1], y: [16, 0], delay: stagger(75), duration: 540, ease: 'outExpo' });
}
reducedQuery.addEventListener('change', () => {
  if (!reducedQuery.matches) return;
  activeAnime.forEach(animation => animation.cancel());
  choices.forEach(choice => {
    choice.querySelector('.choice-line').style.transform = '';
    choice.querySelector('strong').style.transform = '';
  });
});

gsap.registerPlugin(ScrollTrigger);
const intro = document.querySelector('#welcome-intro');
const introSkip = document.querySelector('#intro-skip');
const introPage = [...document.querySelectorAll('.site-header, main, footer, .skip-link')];
let introFinished = false;
let introTimeline;
const onIntroKey = event => { if (event.key === 'Escape') skipIntro(); };
function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  intro.hidden = true;
  introPage.forEach(part => { part.inert = false; });
  document.removeEventListener('keydown', onIntroKey);
  window.dispatchEvent(new Event('portfolio:intro-complete'));
}
function skipIntro() {
  introTimeline?.kill();
  finishIntro();
  if (document.activeElement === introSkip) document.querySelector('.hero-actions a')?.focus();
}
introSkip.addEventListener('click', skipIntro);
reducedQuery.addEventListener('change', () => { if (reducedQuery.matches && !introFinished) skipIntro(); });
if (reducedQuery.matches || location.hash) finishIntro();
else {
  introPage.forEach(part => { part.inert = true; });
  intro.hidden = false;
  document.addEventListener('keydown', onIntroKey);
  const count = intro.querySelector('.intro-count');
  const progress = { value: 0 };
  introTimeline = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finishIntro })
    .from('.welcome-intro-message', { clipPath: 'inset(0 0 15% 0)', y: 12, opacity: .75, duration: .18 })
    .to(progress, { value: 100, duration: .64, ease: 'power2.inOut', onUpdate: () => { count.textContent = `${Math.round(progress.value)}%`; } }, '-=.1')
    .to('.intro-meter span', { scaleX: 1, duration: .64, ease: 'power2.inOut' }, '<')
    .to('.welcome-intro-panel', { scale: 1.07, opacity: 0, duration: .15, ease: 'power3.in' }, '+=.1')
    .to('.intro-burst', { clipPath: 'circle(100% at 50% 50%)', duration: .27, ease: 'power3.inOut' }, '-=.04')
    .to('.intro-shutter-left', { xPercent: -101, duration: .44, ease: 'power4.inOut' })
    .to('.intro-shutter-right', { xPercent: 101, duration: .44, ease: 'power4.inOut' }, '<')
    .to('.intro-burst', { opacity: 0, duration: .39, ease: 'power2.out' }, '<');
}

const motion = gsap.matchMedia();
motion.add({ reduced: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 801px)' }, context => {
  const { reduced, desktop } = context.conditions;
  if (reduced) return;

  if (!location.hash) {
    const revealHero = () => gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero h1', { clipPath: 'inset(0 0 18% 0)', y: 25, duration: .72 })
      .from('.hero-role, .hero-description, .hero-actions', { opacity: .62, y: 14, stagger: .08, duration: .4 }, '-=.42')
      .from('.project-stage', { opacity: .55, clipPath: 'inset(0 0 7% 0)', duration: .62 }, '-=.55');
    if (introFinished) revealHero();
    else window.addEventListener('portfolio:intro-complete', revealHero, { once: true });
  }

  if (desktop) {
    gsap.to('.hero-feature', {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
  }

  gsap.from('.section-intro h2', {
    clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'expo.out',
    scrollTrigger: { trigger: '.work', start: 'top 75%', once: true }
  });
  document.querySelectorAll('.project-row').forEach(row => {
    gsap.from(row.querySelector('.row-main'), {
      opacity: 0, x: 28, duration: .55, ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 82%', once: true }
    });
  });
});
