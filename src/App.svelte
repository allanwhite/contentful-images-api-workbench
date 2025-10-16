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

  function setImageUrl(nextUrl, { updateInput = true } = {}) {
    const trimmed = nextUrl.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed !== baseImageUrl) {
      baseImageUrl = trimmed;
    }

    if (updateInput) {
      imageUrlInput = trimmed;
    }

    thumbnailVisible = true;
  }

  function handleUrlSubmit(event) {
    setImageUrl(event.detail.value);
  }

  function handleThumbnailClear() {
    thumbnailVisible = false;
    imageUrlInput = '';
  }

  $: void updateEntries(baseImageUrl);

  function handleSampleSelect(url) {
    setImageUrl(url);
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
        <h3 class="sample-title">Sample Assets <span id="copyright" class="muted tiny">© R. Allan White 2025</span></h3>
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
    <article class="card pad-lg">
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
<footer class="pad-xl">
    <p>
      This tool was built by <a href="https://www.allanwhite.design/" rel="noreferrer">R. Allan White</a> to help developers and content creators understand how to optimize images using the Contentful Images API. It demonstrates various image formats and quality settings to help you make informed decisions about image delivery.
    </p>
    <p>
      <a style="text-decoration: none;" href="https://github.com/allanwhite/contentful-images-api-workbench" rel="noreferrer">
      <span class="icon">
        <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
            <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
        </svg>
      </span>
      <span>Source code</span>
      </a>  
    </p>  
</footer>
