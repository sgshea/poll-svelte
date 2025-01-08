<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from "mode-watcher";
	import Nav from './nav.svelte';
	let { children, data } = $props();
</script>

<main>
	<ModeWatcher />
	<Nav {data}/>
	{@render children()}
</main>
