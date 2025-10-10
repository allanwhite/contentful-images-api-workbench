<script>
  import { onMount } from 'svelte';

  const baseImageUrl =
    'https://images.ctfassets.net/col7w9urljg1/121xYOJZwECsMsUxRFgKBC/af95ad09a6b2f974dca2c07ca2f552de/Fiona_at_Edgefield__sunset_02.jpg';

  const variations = [
    { label: 'Original', params: '?w=1000' },
    { label: 'WebP', params: '?w=1000&fm=webp' },
    { label: 'Scaled WebP', params: '?w=600&fm=webp&q=50' },
    { label: 'AVIF', params: '?w=600&fm=avif&q=50' }
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
    <h1>Contentful Image Variations</h1>
    <p>Compare format and compression options delivered by the Contentful Images API.</p>
  </header>

  <section class="grid">
    {#each entries as entry}
      <article class="card">
        <div class="image-wrapper">
          <img src={entry.url} alt={`${entry.label} variation`} loading="lazy" />
        </div>
        <div class="card-body">
          <h2>{entry.label}</h2>
          <dl>
            <div>
              <dt>Format</dt>
              <dd>{entry.format}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>
                {#if entry.size !== null}
                  {entry.size.toFixed(2)} KB
                {:else}
                  <span class="muted">Not available</span>
                {/if}
              </dd>
            </div>
          </dl>
          <a class="link" href={entry.url} target="_blank" rel="noreferrer">Open image</a>
        </div>
      </article>
    {/each}
  </section>
</main>

<style>
  main {
    max-width: 1200px;
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
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
  }

  .image-wrapper {
    position: relative;
    padding-top: 60%;
    overflow: hidden;
  }

  .image-wrapper img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-body {
    padding: 1.25rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #0f172a;
  }

  dl {
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  dt {
    font-weight: 600;
    color: #1e293b;
  }

  dd {
    margin: 0.25rem 0 0;
    color: #334155;
  }

  .muted {
    color: #94a3b8;
  }

  .link {
    align-self: flex-start;
    font-weight: 600;
    color: #2563eb;
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }
</style>
