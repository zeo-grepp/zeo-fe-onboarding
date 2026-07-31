<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">목록으로 이동</RouterLink>
    <RouterLink to="/problems/1">문제1로 이동</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
