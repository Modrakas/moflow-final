// MOFLOW LAB — R&D INDEX
//
// File: main.ts
//
// Role: Central Orchestrator
// This file serves as the primary boot sequence for the application.
// It will eventually handle font loading, data fetching, and the 
// initialization of the GSAP/Lenis motion engines and UI modules.
//
// Phase 01: Foundation Baseline
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

import '@styles/main.scss';
import DataManager from '@modules/DataManager';

document.addEventListener('DOMContentLoaded', async () => {
	const dataManager = new DataManager();

	// ––– Data –––––––––––––––––––––––––––
	// Load and render projects before initializing any animations.
	// ScrollAnimations and ProjectReveal depend on the DOM being populated.
	async function boot(): Promise<void> {
		await dataManager.load();
	}

	boot().catch(console.error);

	// ––– Motion Engines –––––––––––––––––––––––––––
	// Lenis + GSAP ScrollTrigger init goes here in Phase 03

	// ––– UI Modules –––––––––––––––––––––––––––
	// CursorManager, TextScramble, + StatsCounter goes here in Phase 03
});
