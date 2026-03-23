/**
 * DataManager.js
 * Fetches data/projects.json and renders the project list into #projectList.
 *
 * Returns a Promise that resolves once all <li> elements are in the DOM,
 * so App can safely initialize GSAP animations and ProjectReveal afterwards.
 *
 * Template:
 *   Each project renders a stack badge row beneath the description, giving
 *   the card a "technical brief" feel without extra markup in the HTML.
 */
export interface Project {
	id:					string;
	slug: 			string;
	tag:				string;
	title:			string;
	titleLine2: string;
	objective:	string;
	stack:			string[];
	url:				string;
	color:			string;
	gradient:		string;
}

export interface DataManagerOptions {
	listSelector?:	string;
	dataPath?:			string;
}
