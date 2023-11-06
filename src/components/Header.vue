<script setup></script>

<template>
    <nav>
        <div>
            <a href="#" class="group">
                <span class="group-hover:text-green-400 group-hover:border-green-400">PUB</span>
                <span class="bg-white text-gray-900 group-hover:bg-green-400">TV</span>
            </a>
        </div>
    </nav>
</template>

<style scoped>
nav {
    @apply fixed z-20 top-0 left-0 right-0 bg-gray-900 shadow;
}

nav > div {
    @apply mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-center;
}

a {
    @apply mx-auto flex items-center border text-2xl font-bold text-white hover:border-green-400;
}

a > span {
    @apply px-2;
}
</style>