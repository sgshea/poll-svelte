<!--
    Component: nav
    This component is the navigation bar at the top of the page.
    Contains: Logo, links to different accessible routes, theme toggle, login and sign up buttons.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
    import { Separator } from '$lib/components/ui/separator/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import { Sun, Moon, Menu, Vote } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	// The different menu items, easily extendable
	const menu = [{ name: 'Create Poll', href: '/create' }];
</script>

<!-- Theme toggle button -->
{#snippet themeToggle()}
	<Button onclick={toggleMode} variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
{/snippet}

<!-- Navigation bar -->
<Card.Root
	class="container mt-5 flex items-center justify-between rounded-2xl border-0 bg-card px-4 py-3"
>
	<ul class="hidden items-center gap-4 text-card-foreground md:flex">
		<li class="font-medium text-primary">
			<Button href="/">
				Svelte Polling
				<Vote />
			</Button>
		</li>

		{#each menu as menuItem}
			<li><Button variant="secondary" href={menuItem.href}>{menuItem.name}</Button></li>
		{/each}
	</ul>

	<div class="flex items-center">
		<Button variant="secondary" class="hidden px-2 md:block">Login</Button>

		<Button class="ml-2 mr-2 hidden md:block">Sign Up</Button>

		<div class="mr-2 flex items-center gap-2 md:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="icon">
						<Menu class="h-5 w-5 rotate-0 scale-100" />
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="start">
					<DropdownMenu.Item>
						<Button href="/" class="w-full">Svelte Polling<Vote /></Button>
					</DropdownMenu.Item>
                    <Separator />
					{#each menu as menuItem}
						<DropdownMenu.Item>
							<Button variant="secondary" href={menuItem.href} class="w-full">{menuItem.name}</Button>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		{@render themeToggle()}
	</div>
</Card.Root>
