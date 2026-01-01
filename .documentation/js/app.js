/* ============================================
   CLAUDE TOOLS DOCUMENTATION - APP
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initLanguageSwitch();
    initCopyButtons();
    initMobileMenu();
    initSidebarToc();
    initScrollSpy();
    initInteractiveDiagram();
});

/* ============================================
   SIDEBAR
   ============================================ */

function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.sidebar-toggle');

    if (!sidebar || !toggle) return;

    // Load saved state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });

    // Set active nav item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

/* ============================================
   LANGUAGE SWITCH
   ============================================ */

function initLanguageSwitch() {
    const langBtns = document.querySelectorAll('.lang-btn');

    // Load saved language
    const savedLang = localStorage.getItem('doc-language') || 'fr';
    setLanguage(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('doc-language', lang);
        });
    });
}

function setLanguage(lang) {
    // Update body class
    document.body.classList.remove('lang-fr', 'lang-en');
    document.body.classList.add('lang-' + lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

/* ============================================
   COPY BUTTONS
   ============================================ */

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const code = this.closest('.code-block').querySelector('code').textContent;

            try {
                await navigator.clipboard.writeText(code);
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = 'var(--success)';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('active');
    });

    overlay?.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Close on nav item click (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                overlay?.classList.remove('active');
            }
        });
    });
}

/* ============================================
   SIDEBAR TABLE OF CONTENTS
   ============================================ */

function initSidebarToc() {
    const sidebarToc = document.querySelector('.sidebar-toc');
    const tocToggle = document.querySelector('.toc-toggle');

    if (!sidebarToc) return;

    // Auto-open TOC on current page
    sidebarToc.classList.add('open');
    if (tocToggle) tocToggle.classList.add('open');

    // Toggle handler
    if (tocToggle) {
        tocToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebarToc.classList.toggle('open');
            tocToggle.classList.toggle('open');
        });
    }

    // Smooth scroll for sidebar TOC links
    document.querySelectorAll('.sidebar-toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update active state immediately
                document.querySelectorAll('.sidebar-toc-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

/* ============================================
   SCROLL SPY
   ============================================ */

function initScrollSpy() {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    const sidebarTocLinks = document.querySelectorAll('.sidebar-toc-link');

    if (!headings.length || !sidebarTocLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                sidebarTocLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    headings.forEach(heading => observer.observe(heading));
}

/* ============================================
   UTILITIES
   ============================================ */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add animation class on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .alert, .best-practice').forEach(el => {
    fadeObserver.observe(el);
});

/* ============================================
   INTERACTIVE DIAGRAM
   ============================================ */

function initInteractiveDiagram() {
    const diagram = document.getElementById('gitflow-diagram');
    const tooltip = document.getElementById('diagram-tooltip');

    if (!diagram || !tooltip) return;

    const clickableElements = diagram.querySelectorAll('.clickable-element');
    let activeElement = null;

    // Get current language
    function getLang() {
        return document.body.classList.contains('lang-en') ? 'en' : 'fr';
    }

    // Show tooltip for an element
    function showTooltip(element, event) {
        const lang = getLang();
        const title = element.dataset['title' + lang.charAt(0).toUpperCase() + lang.slice(1)] || element.dataset.titleFr;
        const desc = element.dataset['desc' + lang.charAt(0).toUpperCase() + lang.slice(1)] || element.dataset.descFr;
        const cmd = element.dataset.cmd || '';

        // Set tooltip content
        tooltip.querySelector('.tooltip-title').textContent = title;
        tooltip.querySelector('.tooltip-desc').textContent = desc;

        const cmdElement = tooltip.querySelector('.tooltip-cmd');
        if (cmd) {
            cmdElement.textContent = cmd;
            cmdElement.style.display = 'inline-block';
        } else {
            cmdElement.style.display = 'none';
        }

        // Position tooltip
        const diagramRect = diagram.getBoundingClientRect();
        const svgRect = diagram.querySelector('svg').getBoundingClientRect();

        // Calculate position relative to the diagram
        let left = event.clientX - diagramRect.left + 15;
        let top = event.clientY - diagramRect.top + 15;

        // Make tooltip visible to measure it
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('visible');

        // Adjust if overflowing right edge
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > diagramRect.right - 10) {
            left = event.clientX - diagramRect.left - tooltipRect.width - 15;
            tooltip.style.left = left + 'px';
        }

        // Adjust if overflowing bottom edge
        if (tooltipRect.bottom > window.innerHeight - 10) {
            top = event.clientY - diagramRect.top - tooltipRect.height - 15;
            tooltip.style.top = top + 'px';
        }

        // Mark element as active
        if (activeElement) {
            activeElement.classList.remove('active');
        }
        element.classList.add('active');
        activeElement = element;
    }

    // Hide tooltip
    function hideTooltip() {
        tooltip.classList.remove('visible');
        if (activeElement) {
            activeElement.classList.remove('active');
            activeElement = null;
        }
    }

    // Add click handlers to clickable elements
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();

            // If clicking the same element, toggle off
            if (activeElement === this) {
                hideTooltip();
            } else {
                showTooltip(this, e);
            }
        });
    });

    // Close tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (!diagram.contains(e.target) || (!e.target.closest('.clickable-element') && !e.target.closest('.diagram-tooltip'))) {
            hideTooltip();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });

    // Update tooltip language when language changes
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (activeElement && tooltip.classList.contains('visible')) {
                // Re-show tooltip with new language
                const event = { clientX: parseFloat(tooltip.style.left) + diagram.getBoundingClientRect().left,
                               clientY: parseFloat(tooltip.style.top) + diagram.getBoundingClientRect().top };
                setTimeout(() => showTooltip(activeElement, event), 50);
            }
        });
    });
}
