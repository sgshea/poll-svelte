<script lang="ts">
	import '../app.css';

	import Nav from './Nav.svelte';
	let { children } = $props();
</script>

<Nav />

<main>
	{@render children()}
</main>
