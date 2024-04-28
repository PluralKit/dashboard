import { crossfade } from 'svelte/transition';
import { cubicInOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node, params) {
		return {
			duration: 300,
			easing: cubicInOut,
			css: (t) => `
				opacity: ${t}
			`
		};
	}
});