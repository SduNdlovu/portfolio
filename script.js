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

const stage = document.querySelector('.project-stage');
const stageTitle = document.querySelector('#stage-project-title');
const stageCount = document.querySelector('#stage-count');

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
      activeAnime.push(animate(line, { scaleX: active ? 1 : 0, duration: active ? 420 : 140, ease: 'outExpo' }));
      if (active) {
        activeAnime.push(animate(choice, { scale: [1.02, 1], duration: 280, ease: 'outExpo' }));
        activeAnime.push(animate(choice.querySelector('strong'), { y: [6, 0], duration: 320, ease: 'outExpo' }));
      }
    }
  });
  if (!reducedQuery.matches && stage) {
    stage.classList.remove('is-reel-change');
    void stage.offsetWidth;
    stage.classList.add('is-reel-change');
    window.setTimeout(() => stage.classList.remove('is-reel-change'), 520);
  }
  if (!reducedQuery.matches && stageTitle) {
    activeAnime.push(animate(stageTitle, {
      opacity: [0, 1],
      y: [10, 0],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: 380,
      ease: 'outExpo'
    }));
  }
  stageTitle.textContent = projectNames[index];
  stageCount.textContent = `${index + 1} / 3`;
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
  animate('.project-choice', { opacity: [.4, 1], y: [22, 0], delay: stagger(90, { start: 120 }), duration: 620, ease: 'outExpo' });
}
reducedQuery.addEventListener('change', () => {
  if (!reducedQuery.matches) return;
  activeAnime.forEach(animation => animation.cancel());
  choices.forEach(choice => {
    choice.querySelector('.choice-line').style.transform = '';
    choice.querySelector('strong').style.transform = '';
    choice.style.transform = '';
  });
  if (stageTitle) {
    stageTitle.style.opacity = '';
    stageTitle.style.filter = '';
    stageTitle.style.transform = '';
  }
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
  gsap.set(['.intro-shutter-left', '.intro-shutter-right'], { xPercent: 0 });
  gsap.set('.intro-burst', { clipPath: 'circle(0% at 50% 50%)', opacity: 1 });
  introTimeline = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finishIntro })
    .from('.welcome-intro-message', { clipPath: 'inset(0 0 40% 0)', y: 28, filter: 'blur(8px)', duration: .42 })
    .from('.welcome-count-wrap', { opacity: 0, y: 18, duration: .28 }, '-=.18')
    .to(progress, {
      value: 100,
      duration: .85,
      ease: 'power3.inOut',
      onUpdate: () => { count.textContent = `${Math.round(progress.value)}%`; }
    }, '-=.05')
    .to('.intro-meter span', { scaleX: 1, duration: .85, ease: 'power3.inOut' }, '<')
    .to('.welcome-intro-panel', { scale: 1.04, opacity: 0, filter: 'blur(6px)', duration: .22, ease: 'power3.in' }, '+=.08')
    .to('.intro-burst', { clipPath: 'circle(120% at 50% 50%)', duration: .38, ease: 'power3.inOut' }, '-=.08')
    .to('.intro-shutter-left', { xPercent: -105, duration: .58, ease: 'power4.inOut' }, '-=.12')
    .to('.intro-shutter-right', { xPercent: 105, duration: .58, ease: 'power4.inOut' }, '<')
    .to('.intro-burst', { opacity: 0, duration: .45, ease: 'power2.out' }, '<+=.08');
}

const motion = gsap.matchMedia();
motion.add({ reduced: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 801px)' }, context => {
  const { reduced, desktop } = context.conditions;
  if (reduced) return;

  if (!location.hash) {
    const revealHero = () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      gsap.set('.project-stage', { transformOrigin: '50% 55%' });
      tl.from('.project-stage', {
        opacity: 0,
        scale: .94,
        filter: 'blur(12px)',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: .75
      })
        .from('.hero h1', { clipPath: 'inset(0 0 100% 0)', y: 36, duration: .7 }, '-=.45')
        .from('.hero-role, .hero-description', { opacity: 0, y: 18, filter: 'blur(4px)', stagger: .07, duration: .45 }, '-=.38')
        .from('.hero-actions', { opacity: 0, y: 14, duration: .35 }, '-=.22')
        .from('.availability', { opacity: 0, duration: .3 }, '-=.18')
        .from('.project-selector', { opacity: 0, y: 16, duration: .4 }, '-=.45');
      return tl;
    };
    if (introFinished) revealHero();
    else window.addEventListener('portfolio:intro-complete', revealHero, { once: true });
  }

  if (desktop) {
    gsap.to('.project-stage', {
      yPercent: -4,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.from('.education-monogram', {
    clipPath: 'inset(0 100% 0 0)',
    opacity: .35,
    duration: .9,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.education-feature-main', start: 'top 78%', once: true }
  });
  gsap.from('.education-detail', {
    opacity: 0,
    y: 24,
    duration: .55,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.education-feature-main', start: 'top 78%', once: true }
  });

  gsap.from('.section-intro h2', {
    clipPath: 'inset(0 0 100% 0)',
    duration: .75,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.work', start: 'top 78%', once: true }
  });
  gsap.from('.project-row', {
    opacity: 0,
    y: 28,
    duration: .55,
    stagger: { each: .09, from: 'start' },
    ease: 'expo.out',
    scrollTrigger: { trigger: '.project-list', start: 'top 80%', once: true }
  });

  gsap.from('.contact h2', {
    clipPath: 'inset(0 0 90% 0)',
    duration: .7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true }
  });
});
