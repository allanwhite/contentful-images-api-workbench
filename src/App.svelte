<script>
  let baseImageUrl =
    'https://images.ctfassets.net/col7w9urljg1/121xYOJZwECsMsUxRFgKBC/af95ad09a6b2f974dca2c07ca2f552de/Fiona_at_Edgefield__sunset_02.jpg';

  const variations = [
    { label: 'Original', params: '?w=1000', notes: '', xtraClasses: '' },
    { label: 'WebP', params: '?w=1000&fm=webp', notes: '', xtraClasses: '' },
    { label: 'Scaled WebP', params: '?w=600&fm=webp&q=50', notes: 'WebP has robust browser support.', xtraClasses: '' },
    { label: 'AVIF', params: '?w=600&fm=avif&q=50', notes: 'AVIF tends to be about 10-15% smaller than WebP, with slightly less browser support.', xtraClasses: '' },
    { label: 'LQIP Preview', params: '?q=1&w=100&fm=webp', notes: 'LQIP (low-quality preview image) version. A CSS Blur(30px) filter has been applied.', xtraClasses: 'loading-blur loading-fill' },
    { label: 'Crop: Face', params: '?fit=thumb&w=480&h=480&f=face&fm=webp', notes: 'You can use face or face(s) to easily generate thumbnails of people', xtraClasses: '' }
  ];

  const getBaseFormat = (url) => {
    const [withoutParams] = url.split('?');
    const extension = withoutParams?.split('.').pop();
    return extension ? extension.toUpperCase() : 'IMAGE';
  };

  const formatFromParams = (params, fallbackFormat) => {
    const match = params.match(/(?:\?|&)fm=([^&]+)/);
    return match ? match[1].toUpperCase() : fallbackFormat;
  };

  const buildEntries = (url) => {
    const fallbackFormat = getBaseFormat(url);
    return variations.map((variant) => ({
      ...variant,
      url: `${url}${variant.params}`,
      format: formatFromParams(variant.params, fallbackFormat),
      size: null
    }));
  };

  let entries = buildEntries(baseImageUrl);
  let imageUrlInput = baseImageUrl;
  let requestToken = 0;

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

  async function updateEntries(url) {
    const currentToken = ++requestToken;
    const baseEntries = buildEntries(url);
    entries = baseEntries;

    const updated = await Promise.all(
      baseEntries.map(async (item) => ({
        ...item,
        size: await getImageSizeFromURL(item.url)
      }))
    );

    if (currentToken === requestToken) {
      entries = updated;
    }
  }

  function handleUrlSubmit(event) {
    event.preventDefault();
    const trimmed = imageUrlInput.trim();
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
  <header class="page-header">
    <h1>Contentful Images API Variations</h1>
    <p>These images are already delivered with the <a href='https://www.contentful.com/developers/docs/references/images-api/'>Contentful Image API</a>, so we can easily optimize them to save bandwidth with a few appropriate parameters.</p>
    <form class="base-url-form" on:submit|preventDefault={handleUrlSubmit}>
      <label class="form-label" for="base-url-input">Base image URL</label>
      <div class="form-controls">
        <input
          id="base-url-input"
          class="url-input"
          type="url"
          placeholder="https://images.ctfassets.net/..."
          bind:value={imageUrlInput}
          required
        />
        <button type="submit">Update</button>
      </div>
    </form>
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
            {#if entry.notes}
              <dt class="metadata">
                <p>{entry.notes}</p>
              </dt>
            {/if}
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
    display: grid;
    gap: 1.5rem;
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

  .base-url-form {
    display: grid;
    gap: 0.5rem;
    min-width: 50ch;
    margin: 0 auto;
    text-align: left;
  }

  .form-label {
    font-weight: 600;
    color: #1f2937;
  }

  .form-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .url-input {
    flex: 1;
    padding: 0.65rem 0.75rem;
    border: 1px solid #cbd5f5;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-family: monospace;
  }

  .url-input:focus {
    outline: 2px solid #60a5fa;
    outline-offset: 1px;
  }

  button {
    padding: 0.65rem 1.25rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #1d4ed8;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover,
  button:focus {
    background-color: #1e40af;
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
    padding: 1.5rem;
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

  /* dd {
    margin: 0.25rem 0 0;
  } */
  .loading-blur {
    filter: blur(30px);
    min-width: 400px;
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
