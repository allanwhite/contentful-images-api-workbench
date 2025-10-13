<script>
  import BaseUrlForm from './components/BaseUrlForm.svelte';
  import ImageVariantCard from './components/ImageVariantCard.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import { buildVariantEntries, hydrateVariantSizes } from './lib/imageVariants.js';

  const DEFAULT_SITE_URL = 'https://contentful-images-api-workbench.vercel.app/';

  const siteUrl =
    import.meta.env.VITE_SITE_URL ??
    (typeof window !== 'undefined'
      ? window.location.origin
      : import.meta.env.DEV
        ? 'http://localhost:5173'
        : DEFAULT_SITE_URL);

  const ogImageUrl = `${siteUrl}/og/contentful-images-api-explorer.jpg`;

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

<svelte:head>
  <title>Contentful Images API Explorer</title>
  <meta
    name="description"
    content="Compare compression and scaling presets side-by-side with Contentful's Images API explorer."
  />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Contentful Images API Explorer" />
  <meta
    property="og:description"
    content="Compare compression and scaling presets side-by-side with Contentful's Images API explorer."
  />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="628" />
  <meta property="og:image:alt" content="Contentful Images API Explorer comparison preview" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contentful Images API Explorer" />
  <meta
    name="twitter:description"
    content="Compare compression and scaling presets side-by-side with Contentful's Images API explorer."
  />
  <meta name="twitter:image" content={ogImageUrl} />
  <meta name="twitter:image:alt" content="Contentful Images API Explorer comparison preview" />
</svelte:head>

<main>
  <header class="page-header">
    <h1>Contentful Images API Variations</h1>
    <p>These images are already delivered with the <a href='https://www.contentful.com/developers/docs/references/images-api/'>Contentful Image API</a>, so we can easily optimize them to save bandwidth with a few appropriate parameters.</p>
    <BaseUrlForm bind:value={imageUrlInput} on:submit={handleUrlSubmit} />
  </header>

  <section class="grid">
    {#each entries as entry (entry.url)}
      <ImageVariantCard {entry} />
    {/each}
    <InfoPanel title="Image API Overview">
      <p>
        Here's a <a href="https://www.contentful.com/blog/creator-guide-to-image-file-formats-and-why-they-are-important/">blog post</a> that describes working with the Images API.
      </p>
      <p class="text-sm mb-6">
        Watch this for a solid walkthrough of how to tune images with the Contentful Image API.
      </p>
      <!-- svelte-ignore a11y-missing-attribute -->
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/DIWWCAJOkbU"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </InfoPanel>

  </section>
</main>
