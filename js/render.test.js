/**
 * render.test.js — Lightweight Node Assert Test Suite for render.js
 * Verifies rendering functions for empty arrays, single items, and multiple items.
 */

const assert = require('assert');
const { projects, team, testimonials, socials } = require('./data.js');
const { renderProjects, renderTeam, renderTestimonials, renderSocials } = require('./render.js');

// Minimal Mock DOM Environment for Node
class MockElement {
  constructor(id = '') {
    this.id = id;
    this.children = [];
    this._innerHTML = '';
    this.className = '';
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
    if (val === '') {
      this.children = [];
    }
  }

  appendChild(child) {
    this.children.push(child);
  }

  querySelector(selector) {
    return this.children.find(c => c.className.includes(selector.replace('.', ''))) || null;
  }

  querySelectorAll(selector) {
    return this.children.filter(c => c.className.includes(selector.replace('.', '')));
  }

  setAttribute(key, val) {
    this[key] = val;
  }
}

const mockContainers = {};

global.document = {
  getElementById: (id) => {
    if (!mockContainers[id]) {
      mockContainers[id] = new MockElement(id);
    }
    return mockContainers[id];
  },
  createElement: (tagName) => new MockElement()
};

function runTests() {
  console.log('🧪 Running Sabiora Render Tests...\n');

  // Test 1: renderProjects handles empty array gracefully
  const projectsContainer = document.getElementById('projects-grid');
  renderProjects([], 'projects-grid');
  assert.strictEqual(projectsContainer.children.length, 0);
  assert.ok(projectsContainer.innerHTML.includes('No projects to display'));
  console.log('  ✓ renderProjects: Empty array state passed');

  // Test 2: renderProjects renders single project
  renderProjects([projects[0]], 'projects-grid');
  assert.strictEqual(projectsContainer.children.length, 1);
  assert.ok(projectsContainer.children[0].innerHTML.includes('Aura Health Platform'));
  console.log('  ✓ renderProjects: Single item render passed');

  // Test 3: renderProjects renders multiple projects
  renderProjects(projects, 'projects-grid');
  assert.strictEqual(projectsContainer.children.length, projects.length);
  console.log(`  ✓ renderProjects: Multiple items (${projects.length}) render passed`);

  // Test 4: renderTeam handles empty & populated arrays
  const teamContainer = document.getElementById('team-grid');
  renderTeam([], 'team-grid');
  assert.ok(teamContainer.innerHTML.includes('Team information updating soon'));
  renderTeam([team[0]], 'team-grid');
  assert.strictEqual(teamContainer.children.length, 1);
  assert.ok(teamContainer.children[0].innerHTML.includes(team[0].name));
  renderTeam(team, 'team-grid');
  assert.strictEqual(teamContainer.children.length, team.length);
  assert.ok(teamContainer.children[0].innerHTML.includes(team[0].name));
  assert.ok(teamContainer.children[1].innerHTML.includes(team[1].name));
  console.log(`  ✓ renderTeam: Empty, single, and multiple (${team.length}) renders passed`);

  // Test 5: renderTestimonials handles empty & populated arrays
  const testimonialsContainer = document.getElementById('testimonials-grid');
  renderTestimonials([], 'testimonials-grid');
  assert.ok(testimonialsContainer.innerHTML.includes('No testimonials available'));
  renderTestimonials(testimonials, 'testimonials-grid');
  assert.strictEqual(testimonialsContainer.children.length, testimonials.length);
  assert.ok(testimonialsContainer.children[0].innerHTML.includes('Claire Sterling'));
  console.log('  ✓ renderTestimonials: Empty and populated renders passed');

  // Test 6: renderSocials renders links
  const socialsContainer = document.getElementById('socials-links');
  renderSocials(socials, 'socials-links');
  assert.strictEqual(socialsContainer.children.length, socials.length);
  console.log('  ✓ renderSocials: Populated renders passed');

  console.log('\n✅ All 6 render unit tests passed successfully!');
}

runTests();
