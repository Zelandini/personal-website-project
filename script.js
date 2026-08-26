const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('scroll', () => document.querySelector('.site-header').classList.toggle('scrolled', scrollY > 12), { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

let audioContext;
function pluckString(string) {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  oscillator.type = 'triangle';
  oscillator.frequency.value = Number(string.dataset.note);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 1.35);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.34, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  oscillator.connect(filter).connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 1.45);
  string.classList.remove('plucked');
  void string.offsetWidth;
  string.classList.add('plucked');
  document.querySelector('.guitar-status').textContent = `${string.getAttribute('aria-label').replace('Pluck ', '')} · key ${string.dataset.key}`;
}
document.querySelectorAll('.guitar-string').forEach(string => {
  string.addEventListener('pointerenter', event => { if (event.buttons) pluckString(string); });
  string.addEventListener('pointerdown', () => pluckString(string));
  string.addEventListener('animationend', () => string.classList.remove('plucked'));
});
document.addEventListener('keydown', event => {
  if (event.repeat) return;
  const string = document.querySelector(`.guitar-string[data-key="${event.key}"]`);
  if (string) pluckString(string);
});
