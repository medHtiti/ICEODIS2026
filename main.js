function renderHeader(){
  const el=document.getElementById('site-header');
  if(!el) return;
  el.innerHTML=`<div class="container navbar">
    <div class="brand-wrap">
      <img src="assets/images/logo.png" alt="ICEODIS Logo" class="logo"/>
      <div class="brand">
        <span class="brand-title">28-29 April</span>
        <span class="brand-sub">International Conference on Electronic, Optical Devices & Intelligent Systems</span>
      </div>
    </div>
    <button class="hamburger" id="nav-toggle" aria-label="Toggle navigation" aria-controls="primary-nav" aria-expanded="false">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <nav id="primary-nav" aria-label="Primary navigation">
      <a href="index.html" data-path="index.html">Home</a>
      <a href="speakers.html" data-path="speakers.html">Speakers</a>
      <a href="committees.html" data-path="committees.html">Committees</a>
      <a href="topics.html" data-path="topics.html">Topics</a>
      <a href="program.html" data-path="program.html">Program</a>
      <a href="submission.html" data-path="submission.html">Submission</a>
      <a href="publication.html" data-path="publication.html">Publication</a>
      <a href="venue.html" data-path="venue.html">Venue</a>
    </nav>
  </div>`;
}

function setActiveLink(){
  const nav=document.querySelector('#site-header nav');
  if(!nav) return;
  const links=nav.querySelectorAll('a');
  let fileName='index.html';
  try{
    const path=window.location.pathname||'';
    // Handle Windows file paths and URL paths
    const lastSlashSplit = path.split('/');
    const lastPart = lastSlashSplit[lastSlashSplit.length-1] || '';
    const lastBackSlashSplit = lastPart.split('\\');
    const candidate = lastBackSlashSplit[lastBackSlashSplit.length-1];
    if(candidate) fileName=candidate;
  }catch(e){/* noop */}
  links.forEach(a=>{
    const target=a.getAttribute('href');
    if(target===fileName){a.classList.add('active');}
  });
}

function renderFooter(){
  const el=document.getElementById('site-footer');
  if(!el) return;
  const year = new Date().getFullYear();

  // Visitor counter using localStorage (client-side only)
  // Increments once per browser session to avoid rapid reload inflation.
  try{
    const sessionKey = 'iceodis_session_id';
    const countKey = 'iceodis_visitor_count';
    let sessionId = sessionStorage.getItem(sessionKey);
    if(!sessionId){
      // New session: increment total count
      sessionId = Math.random().toString(36).slice(2);
      sessionStorage.setItem(sessionKey, sessionId);
      const current = parseInt(localStorage.getItem(countKey) || '0', 10) || 0;
      localStorage.setItem(countKey, String(current + 1));
    }
  }catch(e){ /* ignore storage errors (private mode, etc.) */ }

  const totalVisitors = (()=>{
    try{ return parseInt(localStorage.getItem('iceodis_visitor_count')||'0',10)||0; }catch(e){ return 0; }
  })();

  el.innerHTML=`
  <div class="container" xmlns="http://www.w3.org/1999/html">
    <div class="footer-grid">
      <section class="foot-col">
        <div class="brand-wrap" style="margin-bottom:10px">
          <img src="assets/images/logo.png" alt="ICEODIS Logo" class="logo"/>
          <div class="brand">
            <span class="brand-title">28-28 April</span></br>
            <span class="brand-sub">Electronic, Optical Devices & Intelligent Systems</span>
          </div>
        </div>
        <p class="foot-text">The 1 <sup> st</sup> edition of the International Conference on Electronic, Optical Devices and Intelligent Systems.</p>
        <div class="foot-visitors" aria-live="polite" title="Local visitor counter (per browser)">
          <span class="foot-title" style="display:block;color:#ffeb3b;margin-bottom:4px">Visitors</span>
          <span class="visitor-count" id="visitor-count">${totalVisitors.toLocaleString ? totalVisitors.toLocaleString() : totalVisitors}</span>
        </div>
      </section>

      <nav class="foot-col">
        <h4 class="foot-title">Quick Links</h4>
        <a href="index.html">Home</a>
        <a href="committees.html">Committees</a>
        <a href="topics.html">Topics</a>
        <a href="program.html">Program</a>
        <a href="speakers.html">Speakers</a>
        <a href="submission.html">Submission</a>
        <a href="publication.html">Publication</a>
        <a href="venue.html">Venue</a>
      </nav>

      <section class="foot-col foot-orgs">
        <h4 class="foot-title">Organizers</h4>
        <img src="assets/images/org2.png" alt="Organizer 2"/>
        <img src="assets/images/org3.png" alt="Organizer 3"/>
        <img src="assets/images/org1.png" alt="Organizer 1"/>
      </section>

      <section class="foot-col">
        <h4 class="foot-title">Contact</h4>
        <p class="foot-item"><span class="icon">📞</span> +212 688-520194</p>
        <p class="foot-item"><span class="icon">✉️</span> <a href="mailto:iceodis2026@gmail.com">iceodis2026@gmail.com</a></p>
        <p class="foot-item"><span class="icon">📍</span> FPT, Route d'Oujda - B.P. 1223, TAZA</p>
      </section>
    </div>

    <hr class="foot-sep"/>

    <div class="foot-bottom">
      <div class="copy">© ${year} ICEODIS Conference. All Rights Reserved.</div>
      <div class="motto">Advancing Knowledge Through Research</div>
    </div>
  </div>`;
}

renderHeader();
setActiveLink();
renderFooter();

// Mobile nav toggle
(function(){
  const toggle=document.getElementById('nav-toggle');
  const nav=document.getElementById('primary-nav');
  if(!toggle||!nav) return;
  toggle.addEventListener('click',()=>{
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close menu when clicking a link (mobile)
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      if(nav.classList.contains('open')){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  });
})();

function renderCommonContent(){
  const el=document.getElementById('common-content');
  if(!el) return;

  // Detect if we are on the home page (index.html or root path)
  let isHome=false;
  try{
    const path = window.location.pathname || '';
    const last = path.split('/').pop();
    isHome = (last === '' || last === 'index.html');
  }catch(e){ isHome=false; }

  // Build sidebar HTML, excluding the CFP block on the home page
  let html = '';

  if(!isHome){
    html += `
    <div class="sidebar-section">
      <h3>Call For Paper</h3>
      <a href="https://raw.githubusercontent.com/medHtiti/templates/main/program.pdf" target="_blank" rel="noopener">
        <img src="assets/images/CFP.png" alt="CFP"/>
      </a>
    </div>
    `;
  }

  html += `
    <div class="sidebar-section">
      <h3>Templates for ICEODIS_2026 Conference</h3>
      <div style="display:flex;align-items:center;gap:8px">
        <span>Microsoft Word:</span>
        <a href="https://raw.githubusercontent.com/medHtiti/templates/main/template_word.docx" target="_blank" rel="noopener" title="Download Word Template">
          <img src="assets/images/commonwidget/word_icon.png" alt="Word Template" style="width:40px;height:40px"/>
        </a>
      </div>
    </div>

    <div class="sidebar-section sidebar-partners">
      <h3>Partners</h3>
      
      <img src="assets/images/commonwidget/part2.png" alt="Partner 2"/>
      <img src="assets/images/commonwidget/part3.png" alt="Partner 3"/>
      
     
      
      <img src="assets/images/commonwidget/part1.png" alt="Partner 1"/>
    </div>
  `;

  el.innerHTML = html;
}

renderCommonContent();

// Simple timed hero slider on homepage
(function(){
  const hero = document.querySelector('.hero-slider');
  if(!hero) return;
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  if(slides.length <= 1) return;
  let idx = 0;
  let timerId = null;
  const intervalMs = 4000; // 4 seconds
  function show(i){
    slides.forEach((img, k)=>{
      if(k===i){img.classList.add('active');} else {img.classList.remove('active');}
    });
  }
  function start(){
    stop();
    timerId = setInterval(()=>{
      idx = (idx + 1) % slides.length;
      show(idx);
    }, intervalMs);
  }
  function stop(){ if(timerId){ clearInterval(timerId); timerId=null; } }

  // Preload next images to reduce flash
  slides.forEach(img=>{ if(img.complete) return; const a=new Image(); a.src=img.src; });

  // Pause on hover for accessibility
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  // Start after DOM ready
  show(idx);
  start();
})();