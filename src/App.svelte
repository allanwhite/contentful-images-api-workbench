<script>
  import BaseUrlForm from './components/BaseUrlForm.svelte';
  import ImageVariantCard from './components/ImageVariantCard.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { buildVariantEntries, hydrateVariantSizes } from './lib/imageVariants.js';

  const sampleImages = [
    'https://images.ctfassets.net/col7w9urljg1/121xYOJZwECsMsUxRFgKBC/af95ad09a6b2f974dca2c07ca2f552de/Fiona_at_Edgefield__sunset_02.jpg',
    'https://images.ctfassets.net/col7w9urljg1/4KLYjZa69Q53hbNyKVydbf/828c7d82f9d789c80c1491ddd816634e/pantone-pdp-desktop.jpg',
    'https://images.ctfassets.net/col7w9urljg1/75IchOd2VYWMV2hqf1k6jJ/1bc5103697b4e29b1629b4150e0032ab/APC_0802.avif',
    'https://images.ctfassets.net/col7w9urljg1/2LuK12aDfND5GAEjYeVCRr/db35df0e05939b77bb3d7d35e3f6aff4/_C7A8542.avif',
    'https://images.ctfassets.net/col7w9urljg1/18x23yflPa0RNL4vW0nZIy/cef9731a43abf7ee95c60c21d3dea376/_C7A8526.avif'
  ];
  let baseImageUrl = sampleImages[0];
  let entries = buildVariantEntries(baseImageUrl);
  let imageUrlInput = baseImageUrl;
  let abortController;
  let thumbnailVisible = true;
  const thumbnailParams = 'fit=thumb&w=200&h=200&f=face&fm=webp';

  function buildThumbnailUrl(url) {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${thumbnailParams}`;
  }

  $: thumbnailUrl = thumbnailVisible ? buildThumbnailUrl(baseImageUrl) : '';

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

    thumbnailVisible = true;
    if (trimmed !== baseImageUrl) {
      baseImageUrl = trimmed;
    }

    imageUrlInput = trimmed;
  }

  function handleThumbnailClear() {
    thumbnailVisible = false;
    imageUrlInput = '';
  }

  $: void updateEntries(baseImageUrl);

  function handleSampleSelect(url) {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }

    thumbnailVisible = true;
    if (trimmed !== baseImageUrl) {
      baseImageUrl = trimmed;
    }

    imageUrlInput = trimmed;
  }

</script>
<svelte:head>
  <link rel="preload" as="image" href={sampleImages[0]} />
</svelte:head>
<main>
        <nav class="nav">
          <div class="nav-group">
            <ThemeToggle />
          </div>
        </nav>
  <header class="page-header">
    <div class="title">
      <h1 class="">Contentful Images API Variations</h1>
      <p>These images are already delivered with the <a href='https://www.contentful.com/developers/docs/references/images-api/'>Contentful Image API</a>, so we can easily optimize them to save bandwidth with a few appropriate parameters. 🔍 You can click to zoom on the images to inspect their visual quality.</p>
    </div>
    <div class="form-and-samples">
      <BaseUrlForm
        bind:value={imageUrlInput}
        thumbnailUrl={thumbnailUrl}
        thumbnailAlt="Current image thumbnail"
        showThumbnail={thumbnailVisible && !!thumbnailUrl}
        on:submit={handleUrlSubmit}
        on:clear={handleThumbnailClear}
      />
      <aside class="sample-list">
        <h3 class="sample-title">Sample Assets</h3>
        <div class="sample-thumbs">
          {#each sampleImages as sample}
            <button
              type="button"
              class="sample-thumb {sample === baseImageUrl ? 'selected' : ''}"
              aria-label="Use sample image"
              on:click={() => handleSampleSelect(sample)}
            >
              <img src={`${sample}?fit=thumb&w=80&h=80&fm=webp`} alt="Sample asset thumbnail" loading="lazy" />
            </button>
          {/each}
        </div>
      </aside>
    </div>
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
