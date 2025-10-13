<script>
  import BaseUrlForm from './components/BaseUrlForm.svelte';
  import ImageVariantCard from './components/ImageVariantCard.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { buildVariantEntries, hydrateVariantSizes } from './lib/imageVariants.js';

  let baseImageUrl =
    'https://images.ctfassets.net/col7w9urljg1/121xYOJZwECsMsUxRFgKBC/af95ad09a6b2f974dca2c07ca2f552de/Fiona_at_Edgefield__sunset_02.jpg';

  let entries = buildVariantEntries(baseImageUrl);
  let imageUrlInput = baseImageUrl;
  let abortController;

  async function updateEntries(url) {
    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;

    const baseEntries = buildVariantEntries(url);
    entries = baseEntries;

    const updated = await hydrateVariantSizes(baseEntries, controller.signal);

    if (!controller.signal.aborted) {
      entries = updated;
    }
  }

  function handleUrlSubmit(event) {
    const trimmed = event.detail.value.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed !== baseImageUrl) {
      baseImageUrl = trimmed;
    }

    imageUrlInput = trimmed;
  }

  $: void updateEntries(baseImageUrl);

</script>

<main>
        <nav class="nav">
          <div class="nav-group">
            <ThemeToggle />
          </div>
        </nav>
  <header class="page-header">
    <div class="title">
        <h1 class="float-left">Contentful Images API Variations</h1>
    </div>
    <p>These images are already delivered with the <a href='https://www.contentful.com/developers/docs/references/images-api/'>Contentful Image API</a>, so we can easily optimize them to save bandwidth with a few appropriate parameters.</p>
    <BaseUrlForm bind:value={imageUrlInput} on:submit={handleUrlSubmit} />
  </header>

  <section class="grid">
    {#each entries as entry (entry.url)}
      <ImageVariantCard {entry} />
    {/each}
    <article class="card padding-lg">
      <!-- <div class="card-body"> -->
        <h3>Images API Overview</h3>
        <p>
          Here's a <a href="https://www.contentful.com/blog/creator-guide-to-image-file-formats-and-why-they-are-important/">blog post</a> that describes working with the Images API.
        </p>
        <p class="">
          Watch this for a solid walkthrough of how to tune images with the Contentful Image API.
        </p>
        <!-- svelte-ignore a11y-missing-attribute -->
        <iframe
          class="aspect-video"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/DIWWCAJOkbU"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      <!-- </div> -->
    </article>
  </section>
</main>
