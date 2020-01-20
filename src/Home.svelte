<script>
 import { getContext, onMount } from 'svelte';

 import Error from './Error.svelte';
 import Posts from './Posts.svelte';

 const service = getContext('service');
 let infoPromise = new Promise(() => {});
 let posts = [];
 let postsHasMore = true;

 onMount(() => {
   fetchInfo();
 });

 function fetchInfo() {
   infoPromise = service.info();
 }

 async function fetchPosts() {
   const upto = posts.length > 0 ? posts[posts.length - 1].created_at : null;
   const newPage = await service.fetchPosts(upto);
   posts = [].concat(posts, newPage);
   postsHasMore = newPage.length > 0;
 }
</script>

{#await infoPromise}
  <h1>Loading...</h1>
{:then info}
  <h1>{info.title}</h1>
  {#if service.isAdmin}
    <a href="/posts/new">New Post</a>
  {/if}
  <main>
    <Posts {posts} hasMore={postsHasMore} {fetchPosts}/>
  </main>
{:catch error}
  <Error>{error}</Error>
  <button on:click={fetchInfo}>Retry</button>
{/await}
