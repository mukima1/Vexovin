// Vexovin — shared page script (index.html, team.html)
(function () {
    const hbtn = document.getElementById('hbtn');
    const drw  = document.getElementById('drw');
    const ovl  = document.getElementById('ovl');

    const setMenu = (open) => {
        drw.classList.toggle('open', open);
        ovl.classList.toggle('show', open);
        hbtn.classList.toggle('open', open);
        hbtn.setAttribute('aria-expanded', String(open));
        hbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('lock', open);
    };
    hbtn.addEventListener('click', () => setMenu(!drw.classList.contains('open')));
    ovl.addEventListener('click', () => setMenu(false));
    drw.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    const yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    // Gentle fade-in as sections enter the viewport
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fu').forEach(el => obs.observe(el));

    // Highlight the nav link for the section in view (landing page only)
    const navLinks = document.querySelectorAll('.dnav a[href^="#"]');
    if (navLinks.length) {
        const navObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        navLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) navObs.observe(s); });
    }

    // Contact form: Formspree when configured, otherwise open the visitor's email app
    const form = document.getElementById('cform');
    if (form) {
        const fok  = document.getElementById('fok');
        const sbtn = document.getElementById('sbtn');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.action.includes('YOUR_FORM_ID')) {
                const n = form.name.value, em = form.email.value, t = form.topic.value, m = form.message.value;
                window.location.href = `mailto:hello@vexovin.com?subject=${encodeURIComponent('Enquiry: ' + (t || 'General'))}&body=${encodeURIComponent('From: ' + n + '\nEmail: ' + em + '\n\n' + m)}`;
                return;
            }
            const label = sbtn.textContent;
            sbtn.textContent = 'Sending…';
            sbtn.disabled = true;
            try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
                if (!res.ok) throw new Error();
                form.style.display = 'none';
                fok.style.display = 'block';
            } catch {
                sbtn.textContent = 'Could not send — please try again';
                setTimeout(() => { sbtn.textContent = label; sbtn.disabled = false; }, 3000);
            }
        });
    }
})();
