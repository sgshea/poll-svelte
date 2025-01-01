<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="border-b">
    <div class="flex h-16 items-center px-4 container mx-auto">
        <div class="mr-4 hidden md:flex">
            <a href="/" class="mr-6 flex items-center space-x-2">
                <span class="font-bold text-xl">Polling Svelte</span>
            </a>
            <nav class="flex items-center space-x-6 text-sm font-medium">
                <a href="/" class="transition-colors hover:text-foreground/80">Home</a>
                <!-- <a href="/polls" class="transition-colors hover:text-foreground/80">My Polls</a> -->
                <a href="/create" class="transition-colors hover:text-foreground/80">Create Poll</a>
            </nav>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-4">
            <nav class="flex items-center space-x-2">
                <Button variant="ghost" size="sm">Login</Button>
                <Button size="sm">Sign up</Button>
            </nav>
        </div>
    </div>
</div>