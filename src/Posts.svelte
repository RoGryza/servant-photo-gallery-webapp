<script>
 import { createEventDispatcher } from 'svelte';
 import Error from './Error.svelte';
 import Spinner from './Spinner.svelte';

 const dispatch = createEventDispatcher();

 export let posts = [];
 export let hasMore = false;
 export let fetchPosts = null;

 let scrollY = 0;
 let windowHeight = 0;
 let documentHeight = 0;

 let fetchPostsPromise = null;

 async function doFetchPosts() {
   if (fetchPosts && !fetchPostsPromise) {
     fetchPostsPromise = fetchPosts();
     await fetchPostsPromise;
     fetchPostsPromise = null;
   }
 }

 const pad2 = (n) => n < 10 ? '0' + n : n;
 const dateFmt = (d) => `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;

 $: {
   if (hasMore && scrollY + windowHeight >= documentHeight - 300) {
     doFetchPosts();
   }
 }
</script>

<svelte:window bind:scrollY bind:innerHeight={windowHeight}/>

<div class="container" bind:offsetHeight={documentHeight}>
  {#each posts as post, i (post.id)}
    <div class="grid-item">
      <div class="post">
        <p>{dateFmt(post.created_at)}</p>
        <div class="img-container">
          <img src={post.media[0].src} alt={post.media[0].caption}/>
        </div>
        <p>{@html post.media[0].caption}</p>
      </div>
    </div>
  {/each}

  <div class="grid-item">
    {#if fetchPostsPromise}
      {#await fetchPostsPromise}
        <Spinner/>
      {:then _}
        {#if hasMore}
          <Spinner/>
        {:else}
          No more posts
        {/if}
      {:catch error}
        <Error>{error}</Error>
        <button on:click={doFetchPosts}>Retry</button>
      {/await}
    {/if}
  </div>
</div>

<style>
 .container {
   margin: 0 auto;
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   align-content: center;
   justify-content: center;
 }
 
 .grid-item {
   flex-basis: 33.3333%;
   min-width: 300px;
 }

 .post {
   margin: 20px;
   padding: 10px;
   box-shadow: 5px 5px 8px;
   background: white;
 }

 .img-container {
   max-height: 400px;
   overflow: hidden;
 }

 .grid-item img {
   width: 100%;
 }
</style>
