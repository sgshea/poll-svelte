<script lang="ts">
	import '../app.css';

	import Nav from './Nav.svelte';
	let { children } = $props();
</script>

<main>
	<Nav />
	{@render children()}
</main>
