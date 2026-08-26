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
    card.className = `reveal-on-scroll ${delayClass} bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden card-hover-effect flex flex-col h-full`;

    const tagsMarkup = (project.tags || [])
      .map(tag => `<span class="badge-accent text-xs font-medium px-3 py-1 rounded-full">${tag}</span>`)
      .join('');

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
      <div class="p-6 md:p-8 flex flex-col flex-grow">
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
    card.className = `reveal-on-scroll ${delayClass} bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col justify-between card-hover-effect`;

    const socialLinks = member.socials && Object.keys(member.socials).length > 0 ? Object.entries(member.socials).map(([platform, link]) => `
      <a href="${link}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[var(--color-bg-alt)] hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)] flex items-center justify-center text-[var(--color-text-muted)] transition-colors" aria-label="${member.name} ${platform}">
        <i data-lucide="${getSocialIconName(platform)}" class="w-4 h-4"></i>
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
        <img 
          src="${item.image}" 
          alt="${item.author}" 
          class="w-12 h-12 rounded-full object-cover border border-[var(--color-border)]"
          loading="lazy"
        />
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
    link.innerHTML = `<i data-lucide="${getSocialIconName(social.icon || social.name)}" class="w-4 h-4"></i>`;

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
    initRenderer
  };
}
