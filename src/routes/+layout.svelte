<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from "mode-watcher";
	import Nav from './nav.svelte';
	let { children } = $props();
</script>

<main>
	<ModeWatcher />
	<Nav />
	{@render children()}
</main>
