/**
 * DataManager.ts
 * Fetches data/projects.json and renders the project list into #projectList.
 *
 * Returns a Promise that resolves once all <li> elements are in the DOM,
 * so App can safely initialize GSAP animations and ProjectReveal afterwards.
 *
 * Template:
 *   Each project renders a stack badge row beneath the description, giving
 *   the card a "technical brief" feel without extra markup in the HTML.
 */


import type { Project, DataManagerOptions } from '@data/projects';

export default class DataManager {
	private list:			Element | null;
	private dataPath:	string;

	constructor({ listSelector = `#projectList`, dataPath = `data/projects.json` }: DataManagerOptions = {}) {
		this.list = document.querySelector(listSelector);
		this.dataPath = dataPath;
	}

	// ––– Public API –––––––––––––––––––––––––––––––––––––––
	// Must be called before initializing ScrollAnimation or ProjectReveal.
	// Returns a Promise<Projects[]> so the caller can await it
	async load(): Promise<Project[]> {
		const projects = await this._fetch();
		this._render(projects);
		return projects;
	}
	// ─── Private ─────────────────────────────────────────────────
  private async _fetch(): Promise<Project[]> {
    try {
      const res = await fetch(this.dataPath);
      if (!res.ok) throw new Error(`DataManager: fetch failed (${res.status})`);
      const data = await res.json() as Project[];
    console.log('DataManager: fetched projects →', data);
    return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  private _render(projects: Project[]): void {
		console.log('DataManager: target list element →', this.list);
    if (!this.list) {
      console.warn('DataManager: #projectList not found in DOM.');
      return;
    }

    // Build all markup as a single string then inject once — one reflow.
    this.list.innerHTML = projects.map(p => this._template(p)).join('');
  }

  private _template(p: Project): string {
    const stackBadges = p.stack
      .map(s => `<span class="project__stack-badge mono">${s}</span>`)
      .join('');

    return `
      <li class="project" data-color="${p.color}" data-slug="${p.slug}">
        <div class="project__inner">

          <span class="project__index mono">${p.id}</span>
          <div class="project__info">
            <span class="project__tag mono">${p.tag}</span>
            <h3 class="project__title">${p.title}<br/>${p.titleLine2}</h3>
            <p class="project__desc">
              ${p.objective}
            </p>
            <div class="project__stack" aria-label="Tech stack">
              ${stackBadges}
            </div>
          </div>
          <div class="project__actions">
            <a href="${p.url}" class="project__link" aria-label="View lab log">
              <span>View Log</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7 13L13 7M13 7H8M13 7V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="project__image-wrap" aria-hidden="true">
          <div class="project__image" style="background: ${p.gradient};"></div>
          <div class="project__noise"></div>
        </div>
      </li>
    `;
  }
}