<!--
     Much of this was inspired by svelte-router by Jorge Alvarez.
     See https://github.com/jorgegorka/svelte-router.
-->
<script context="module">
 import { writable } from 'svelte/store';
 const currentRoute = writable(window.location.pathname);

 export function navigateTo(path) {
   window.history.pushState(null, '', path);
   currentRoute.set(path);
 }
</script>

<script>
 export let routes = {};
 export let defaultRoute = '/';

 function resolve() {
   currentRoute.set(window.location.pathname);
 }

 function redirectAnchor(event) {
   if (event.target.pathname &&
       event.target.hostname === window.location.hostname &&
       event.target.localName === 'a') {
     event.preventDefault();
     navigateTo(event.target.pathname);
   }
 }

 window.history.replaceState(null, "", defaultRoute);
 currentRoute.set(defaultRoute);
 let currentComponent;
 $: currentComponent = routes[$currentRoute] && routes[$currentRoute]() || null;
</script>

<svelte:window
  on:popstate={resolve}
  on:click={redirectAnchor}/>

<svelte:component this={currentComponent}/>
