/**
 * render.js — Sabiora DOM Rendering Engine
 * Populates array-driven content containers safely and dynamically.
 */

/**
 * Render Projects Grid
 * @param {Array} projectList 
 * @param {string} containerId 
 */
function renderProjects(projectList = projects, containerId = 'projects-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!projectList || projectList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-[var(--color-text-muted)]">
        <p class="text-lg">No projects to display at this time.</p>
      </div>
    `;
    return;
  }

  projectList.forEach((project, index) => {
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    const card = document.createElement('article');
    card.className = `reveal-on-scroll ${delayClass} project-card-splash bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden card-hover-effect flex flex-col h-full`;

    const tagsMarkup = (project.tags || [])
      .map(tag => `<span class="badge-accent text-xs font-medium px-3 py-1 rounded-full">${tag}</span>`)
      .join('');

    const linksMarkup = (project.links && project.links.length > 0) ? `
        <div class="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[var(--color-border)] relative z-10">
          ${project.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="store-link-btn">
              ${l.label}
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
          `).join('')}
        </div>
      ` : '';

    card.innerHTML = `
      <div class="relative overflow-hidden group aspect-[16/10] bg-[var(--color-bg-alt)]">
        <img 
          src="${project.image}" 
          alt="${project.title} showcase" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span class="text-white font-heading font-medium text-sm flex items-center gap-2">
            View Project Details
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </span>
        </div>
      </div>
      <div class="p-6 md:p-8 flex flex-col flex-grow relative z-10">
        <div class="flex items-center justify-between text-xs text-[var(--color-text-dim)] uppercase tracking-wider font-semibold mb-2">
          <span>${project.category}</span>
          <span>${project.year}</span>
        </div>
        <h3 class="text-xl md:text-2xl font-bold font-heading mb-3 text-[var(--color-primary)]">
          ${project.title}
        </h3>
        <p class="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6 flex-grow">
          ${project.description}
        </p>
        <div class="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)]">
          ${tagsMarkup}
        </div>
        ${linksMarkup}
      </div>
    `;

    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function getSocialIconName(platform = '') {
  const p = platform.toLowerCase();
  if (p.includes('twitter') || p === 'x') return 'twitter';
  if (p.includes('linkedin')) return 'linkedin';
  if (p.includes('github')) return 'github';
  if (p.includes('instagram')) return 'instagram';
  return 'globe';
}

function getSocialIconSvg(platform = '') {
  const p = platform.toLowerCase();
  
  if (p.includes('twitter') || p === 'x') {
    return `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  }
  if (p.includes('linkedin')) {
    return `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`;
  }
  if (p.includes('github')) {
    return `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
  }
  if (p.includes('instagram')) {
    return `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
  }
  if (p.includes('dribbble')) {
    return `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.118 11.233c-.347-.092-2.884-.712-5.811-.318 1.258 3.447 1.767 6.94 1.9 7.892 2.39-1.921 3.911-4.846 3.911-8.124zm-5.522 8.799c-.161-1.127-.678-4.485-1.89-7.83-3.666 1.229-7.07 1.246-7.399 1.244v.001c1.472 4.072 5.179 6.883 9.289 6.585zm-11.085-7.794c.421.004 3.321.01 6.786-1.1-1.163-2.316-2.5-4.437-2.73-4.8-3.41 1.48-4.57 4.708-4.056 5.9zm-1.077-7.21c.277.433 1.579 2.518 2.723 4.782 2.457-1.026 5.093-1.637 5.753-1.789-1.257-2.38-2.748-4.321-2.955-4.582-2.749.336-5.011 2.613-5.521 5.589zm7.042-5.31c.216.273 1.666 2.158 2.909 4.475 2.502-.562 4.887-.367 5.228-.332-1.391-2.615-3.957-4.143-8.137-4.143zm9.645 5.568c-.461-.043-2.684-.218-5.056.347.962 1.838 1.936 3.593 2.128 3.949 1.737-1.189 2.685-2.784 2.928-4.296z"/></svg>`;
  }

  return `<svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`;
}

/**
 * Render Team Section — Displays all team members as feature cards in a grid
 * @param {Array} teamList 
 * @param {string} containerId 
 */
function renderTeam(teamList = team, containerId = 'team-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!teamList || teamList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-[var(--color-text-muted)]">
        <p class="text-lg">Team information updating soon.</p>
      </div>
    `;
    return;
  }

  teamList.forEach((member, index) => {
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    const card = document.createElement('div');
    card.className = `reveal-on-scroll ${delayClass} bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 rounded-3xl flex flex-col justify-between card-hover-effect`;

    const socialLinks = member.socials && Object.keys(member.socials).length > 0 ? Object.entries(member.socials).map(([platform, link]) => `
      <a href="${link}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)] flex items-center justify-center text-[var(--color-text-muted)] transition-colors" aria-label="${member.name} ${platform}">
        ${getSocialIconSvg(platform)}
      </a>
    `).join('') : '';

    const socialMarkup = socialLinks ? `
      <div class="flex items-center gap-3 pt-4 border-t border-[var(--color-border)] mt-auto">
        ${socialLinks}
      </div>
    ` : '';

    const mottoMarkup = member.motto ? `
      <blockquote class="text-xs sm:text-sm font-medium text-[var(--color-primary)] italic leading-relaxed mb-3 border-l-2 border-[var(--color-accent)] pl-3">
        "${member.motto}"
      </blockquote>
    ` : '';

    card.innerHTML = `
      <div>
        <div class="flex items-center gap-4 mb-5">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[var(--color-accent-light)] shadow-sm bg-[var(--color-bg)] shrink-0">
            <img 
              src="${member.image}" 
              alt="${member.name}" 
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold font-heading text-[var(--color-primary)]">
              ${member.name}
            </h3>
            <span class="inline-block text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider mt-1">
              ${member.role}
            </span>
          </div>
        </div>
        ${mottoMarkup}
        <p class="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
          ${member.bio}
        </p>
      </div>
      ${socialMarkup}
    `;

    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Render Testimonials Grid
 * @param {Array} testimonialList 
 * @param {string} containerId 
 */
function renderTestimonials(testimonialList = testimonials, containerId = 'testimonials-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!testimonialList || testimonialList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-[var(--color-text-muted)]">
        <p class="text-lg">No testimonials available right now.</p>
      </div>
    `;
    return;
  }

  testimonialList.forEach((item, index) => {
    const delayClass = `delay-${((index % 3) + 1) * 100}`;
    const card = document.createElement('div');
    card.className = `reveal-on-scroll ${delayClass} bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-2xl card-hover-effect flex flex-col justify-between h-full relative`;

    const stars = '★'.repeat(item.rating || 5);

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-6">
          <span class="text-amber-500 text-lg tracking-widest">${stars}</span>
          <i data-lucide="quote" class="w-8 h-8 text-[var(--color-accent-border)] opacity-60"></i>
        </div>
        <p class="text-[var(--color-text)] text-base md:text-lg italic leading-relaxed mb-8">
          "${item.quote}"
        </p>
      </div>
      <div class="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
        <div
          class="w-12 h-12 rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)] font-heading font-bold text-lg flex items-center justify-center border border-[var(--color-border)] shrink-0">
          ${(item.author || '').trim().charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="text-base font-bold font-heading text-[var(--color-primary)]">
            ${item.author}
          </h4>
          <p class="text-xs text-[var(--color-text-muted)]">
            ${item.title}, <span class="font-semibold text-[var(--color-primary-light)]">${item.company}</span>
          </p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Render Social Links
 * @param {Array} socialList 
 * @param {string} containerId 
 */
function renderSocials(socialList = socials, containerId = 'socials-links') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!socialList || socialList.length === 0) return;

  socialList.forEach(social => {
    const link = document.createElement('a');
    link.href = social.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)] hover:bg-[var(--color-accent-light)] text-[var(--color-primary)] hover:text-[var(--color-accent)] flex items-center justify-center transition-all duration-200 text-sm font-semibold';
    link.setAttribute('aria-label', social.name);
    link.innerHTML = getSocialIconSvg(social.icon || social.name);

    container.appendChild(link);
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Initialize all rendering on DOM ready
 */
function initRenderer() {
  if (typeof projects !== 'undefined') renderProjects(projects);
  if (typeof team !== 'undefined') renderTeam(team);
  if (typeof testimonials !== 'undefined') renderTestimonials(testimonials);
  if (typeof socials !== 'undefined') renderSocials(socials);

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

// Auto-run if running in browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initRenderer);
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderProjects,
    renderTeam,
    renderTestimonials,
    renderSocials,
    getSocialIconSvg,
    initRenderer
  };
}
