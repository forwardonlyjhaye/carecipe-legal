/*
 * Store links for every Carecipe landing page. This is the only file to edit.
 *
 * This copy powers the live landing page at /app/. (try/assets/store.js is the design previews.)
 *
 * When Google Play goes live, paste the link into `android` below:
 *   android: 'https://play.google.com/store/apps/details?id=com.carecipe.app'
 * Every "Google Play" badge on every page switches from "Coming soon" to a live link.
 */
(function () {
  var LINKS = {
    ios: 'https://apps.apple.com/app/id6810801696',
    android: 'https://play.google.com/store/apps/details?id=com.carecipe.app'
  };

  // Label the click so App Store Connect can split installs by ad: ?ad=A on the
  // page URL becomes ct=meta-A on the App Store link.
  var q = new URLSearchParams(location.search);
  var tag = q.get('ad') || q.get('utm_content') || q.get('utm_campaign') || '';
  tag = /^[A-Za-z0-9_-]{1,30}$/.test(tag) ? 'meta-' + tag : '';

  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  document.documentElement.classList.toggle('is-android', isAndroid);
  document.documentElement.classList.toggle('play-live', !!LINKS.android);

  function ios() { return LINKS.ios + (tag ? '?ct=' + tag : ''); }
  function android() { return LINKS.android + (tag && LINKS.android ? '&referrer=utm_source%3D' + tag : ''); }

  function wire() {
    document.querySelectorAll('[data-store]').forEach(function (a) {
      var kind = a.getAttribute('data-store');
      if (kind === 'auto') kind = isAndroid && LINKS.android ? 'android' : 'ios';
      if (kind === 'ios') { a.href = ios(); return; }
      if (LINKS.android) { a.href = android(); a.classList.remove('is-soon'); return; }
      a.removeAttribute('href');
      a.classList.add('is-soon');
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('title', 'Coming soon to Google Play');
    });

    // Sticky download bar: appears once the hero button scrolls away, hides at the final call to action.
    var bar = document.querySelector('.stickybar');
    var hero = document.querySelector('[data-hero-cta]');
    var end = document.querySelector('[data-end-cta]');
    if (bar && hero && 'IntersectionObserver' in window) {
      var heroGone = false, endSeen = false;
      var sync = function () { bar.classList.toggle('show', heroGone && !endSeen); };
      new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; sync(); }).observe(hero);
      if (end) new IntersectionObserver(function (e) { endSeen = e[0].isIntersecting; sync(); }).observe(end);
    }

    // Gentle reveal on scroll.
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
