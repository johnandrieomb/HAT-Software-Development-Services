// Short helper: find one element
const $ = (s) => document.querySelector(s);

// 1. Mobile menu: open/close, and close after choosing a link
$('#menuBtn').onclick = () => $('#menu').classList.toggle('open');
$('#menu').onclick = (e) => { if (e.target.tagName === 'A') $('#menu').classList.remove('open'); };

// 2. Services: "Learn More" shows/hides the list inside the same card


// 3. Projects: "View Project" opens a pop-up with a screenshot slider
const modal = $('#projectModal');
const slidesBox = $('#mSlides');
const dotsBox = $('#mDots');
let current = 0;   // which screenshot is showing
let total = 0;     // how many screenshots this project has

// Move the slider to screenshot number n, and update the dots
function goTo(n) {
    if (total === 0) return;
    current = (n + total) % total;                       // loops: after the last comes the first
    slidesBox.style.transform = `translateX(-${current * 100}%)`;
    dotsBox.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === current));
}

// Fill the pop-up with the data-* values from the clicked button, then open it
function openProject(btn) {
    $('#mKicker').textContent = btn.dataset.kicker || '';
    $('#mTitle').textContent = btn.dataset.title || '';
    $('#mSub').textContent = btn.dataset.sub || '';
    $('#mOverview').textContent = btn.dataset.overview || '';
    $('#mScope').textContent = btn.dataset.scope || '';
    $('#mStatus').textContent = btn.dataset.status || '';

    // Key features: data-features is a list separated by |  ->  one bullet per item
    $('#mFeatures').innerHTML = '';
    (btn.dataset.features || '').split('|').forEach((f) => {
        if (!f.trim()) return;
        const li = document.createElement('li');
        li.textContent = f.trim();
        $('#mFeatures').appendChild(li);
    });

    // Hide a heading when it has nothing under it (only if those boxes exist in your HTML)
    $('#mFeaturesBox')?.toggleAttribute('hidden', !btn.dataset.features);
    $('#mScopeBox')?.toggleAttribute('hidden', !btn.dataset.scope);
    $('#mStatusBox')?.toggleAttribute('hidden', !btn.dataset.status);

    // Technology tags
    $('#mTags').innerHTML = '';
    (btn.dataset.tech || '').split(',').forEach((t) => {
        if (!t.trim()) return;
        const span = document.createElement('span');
        span.textContent = t.trim();
        $('#mTags').appendChild(span);
    });

    // Screenshots + dots (data-images is a comma-separated list of image paths)
    const images = btn.dataset.images.split(',').map((s) => s.trim());
    total = images.length;
    slidesBox.innerHTML = '';
    dotsBox.innerHTML = '';
    images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = btn.dataset.title + ' screenshot ' + (i + 1);
        slidesBox.appendChild(img);

        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
        dot.onclick = () => goTo(i);
        dotsBox.appendChild(dot);
    });
    // Hide arrows and dots if there is only one picture
    document.querySelectorAll('.slide-btn, .dots, .slide-hint').forEach((el) => {
        el.style.display = total > 1 ? '' : 'none';
    });

    goTo(0);
    modal.showModal();
    document.documentElement.style.overflow = 'hidden';  // stop the page scrolling behind the pop-up
}

document.querySelectorAll('.demo').forEach((btn) => {
    btn.onclick = () => openProject(btn);
});

// Arrows
$('#mPrev').onclick = () => goTo(current - 1);
$('#mNext').onclick = () => goTo(current + 1);

// Keyboard arrows while the pop-up is open
document.addEventListener('keydown', (e) => {
    if (!modal.open) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
});

// Swipe on touch screens
let startX = 0;
$('#mSlider').addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
$('#mSlider').addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) goTo(diff < 0 ? current + 1 : current - 1);
});

// Close: X button, click on the dark area outside, or the Esc key (built in)
$('#mClose').onclick = () => modal.close();
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => { document.documentElement.style.overflow = ''; });

// 4. Back-to-top button: appears after scrolling down
window.onscroll = () => { $('#top').style.display = window.scrollY > 400 ? 'block' : 'none'; };
$('#top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// 5. Contact form validation (does NOT send anything)
$('#form').onsubmit = (e) => {
    e.preventDefault();
    const checks = [
        ['#name', (v) => v.length >= 2 ? '' : 'Please enter your full name.'],
        ['#email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.'],
        ['#subject', (v) => v.length >= 3 ? '' : 'Please enter a subject.'],
        ['#message', (v) => v.length >= 10 ? '' : 'Message must be at least 10 characters.']
    ];
    let ok = true;
    checks.forEach(([id, test]) => {
        const input = $(id);
        const msg = test(input.value.trim());
        input.nextElementSibling.textContent = msg;      // show the error text
        input.classList.toggle('invalid', msg !== '');   // red border
        if (msg) ok = false;
    });
    const status = $('#status');
    if (ok) {
        status.style.color = '#16a34a';
        status.textContent = 'Looks good! (Demo only: no message was sent. A backend or form service is needed.)';
        e.target.reset();
    } else {
        status.style.color = '#dc2626';
        status.textContent = 'Please fix the errors above.';
    }
};

// 6. Current year in the footer
$('#year').textContent = new Date().getFullYear();

// 7. Menu underline: mark the link of the section you are looking at
const navLinks = document.querySelectorAll('#menu a:not(.btn)');
const navSections = [...navLinks].map((a) => document.querySelector(a.getAttribute('href')));

function updateActiveLink() {
    const line = window.scrollY + 120;
    let current = 0;
    navSections.forEach((sec, i) => { if (sec && sec.offsetTop <= line) current = i; });
    const contact = document.querySelector('#contact');
    if (contact && contact.offsetTop <= line) current = -1;
    navLinks.forEach((a, i) => a.classList.toggle('active', i === current));
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();