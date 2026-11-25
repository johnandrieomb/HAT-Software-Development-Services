// Small script for the service pages (menu, back-to-top, footer year)
const $ = (s) => document.querySelector(s);

// Mobile menu: open/close, and close after choosing a link
$('#menuBtn').onclick = () => $('#menu').classList.toggle('open');
$('#menu').onclick = (e) => { if (e.target.tagName === 'A') $('#menu').classList.remove('open'); };

// Back-to-top button
window.onscroll = () => { $('#top').style.display = window.scrollY > 400 ? 'block' : 'none'; };
$('#top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Current year in the footer
$('#year').textContent = new Date().getFullYear();
