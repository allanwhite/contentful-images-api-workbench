<script>
  import { onMount } from 'svelte';

  const baseImageUrl =
    'https://images.ctfassets.net/col7w9urljg1/121xYOJZwECsMsUxRFgKBC/af95ad09a6b2f974dca2c07ca2f552de/Fiona_at_Edgefield__sunset_02.jpg';

  const variations = [
    { label: 'Original', params: '?w=1000' },
    { label: 'WebP', params: '?w=1000&fm=webp' },
    { label: 'Scaled WebP', params: '?w=600&fm=webp&q=50' },
    { label: 'AVIF', params: '?w=600&fm=avif&q=50' },
    { label: 'Crop: Face', params: '?fit=thumb&w=480&h=480&f=face&fm=webp' }
  ];

  const baseFormat = baseImageUrl.split('.').pop().toUpperCase();

  const formatFromParams = (params) => {
    const match = params.match(/(?:\?|&)fm=([^&]+)/);
    return match ? match[1].toUpperCase() : baseFormat;
  };

  const buildEntries = () =>
    variations.map((variant) => ({
      ...variant,
      url: `${baseImageUrl}${variant.params}`,
      format: formatFromParams(variant.params),
      size: null
    }));

  let entries = buildEntries();

  async function getImageSizeFromURL(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
          const fileSizeInBytes = parseInt(contentLength, 10);
          const fileSizeInKB = fileSizeInBytes / 1024;
          return fileSizeInKB;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching image size:', error);
      return null;
    }
  }

  onMount(async () => {
    const updated = await Promise.all(
      entries.map(async (item) => ({
        ...item,
        size: await getImageSizeFromURL(item.url)
      }))
    );

    entries = updated;
  });
</script>

<main>
  <header class="page-header">
    <h1>Contentful Images API Variations</h1>
    <p>These images are already delivered with the <a href='https://www.contentful.com/developers/docs/references/images-api/'>Contentful Image API</a>, so we can easily optimize them to save bandwidth with a few appropriate parameters.</p>
  </header>

  <section class="grid">
    {#each entries as entry}
      <article class="card">
        <div class="card-body">
          <h3>
            <a class="link" href={entry.url} target="_blank" rel="noreferrer">
            {entry.label}
            </a>
          </h3>
          <dl>
            <dt class="metadata">Format: {entry.format}</dt>
            <dt class="metadata">Size: 
                {#if entry.size !== null}
                  {entry.size.toFixed(2)} KB
                {:else}
                  <span class="muted">Not available</span>
                {/if}
            </dt>
            <dt class="metadata">Params: {entry.params}</dt>
          </dl>
        </div>
        <div class="image-wrapper">
          <img src={entry.url} alt={`${entry.label} variation`} loading="lazy" />
        </div>

      </article>
    {/each}
  </section>
</main>

<style>
  main {
    /* max-width: 1200px; */
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0;
    font-size: clamp(2rem, 3vw, 2.75rem);
  }

  .page-header p {
    margin: 0.75rem auto 0;
    max-width: 640px;
    color: #475569;
    font-size: 1rem;
    line-height: 1.6;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    gap: 1.5rem;
  }

  .card {
    /* background-color: #36383e; */
    border-radius: 0.5rem;
    overflow: hidden;
    /* box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12); */
    display: flex;
    flex-direction: column;
  }

.image-wrapper {
    overflow: hidden;
    border-radius: 0.5rem;
    object-fit: contain;
    padding: 1.5rem
  }

  /* .image-wrapper img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    
  } */

  .card-body {
    padding: 1.25rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    /* color: white; */
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
  .card-body .link {
    color: #1f2831;
  }
  dl {
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  dt {
    font-weight: 600;
    /* color: #1e293b; */
  }

  dd {
    margin: 0.25rem 0 0;
    /* color: #334155; */
  }
  .metadata {
    font-weight: 500;
    font-family: 'IBM Plex Mono', monospace;
    font-size: smaller;
    /* color: #202936; */
    line-height: 1.1;
    margin-bottom: 0;
  }

  .muted {
    color: #94a3b8;
  }

  .link {
    align-self: flex-start;
    font-weight: 600;
    /* color: #2563eb; */
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }
</style>
