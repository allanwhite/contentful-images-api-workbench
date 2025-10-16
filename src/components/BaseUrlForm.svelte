<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let value = '';
  export let thumbnailUrl = '';
  export let thumbnailAlt = 'Current image thumbnail';
  export let showThumbnail = false;

  const FAST_DURATION = 100;

  const dispatch = createEventDispatcher();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch('submit', { value });
  };

  const handleClear = () => {
    dispatch('clear');
  };
</script>

<form class="card pad-lg base-url-form bg-tint rounded-md" on:submit={handleSubmit}>
  <label class="form-label" for="base-url-input">Paste a full Contentful Asset URL</label>
  <div class="form-controls">
    <div class="thumbnail" class:thumbnail-empty={!showThumbnail || !thumbnailUrl}>
      {#if showThumbnail && thumbnailUrl}
        <img class="thumbnail-image" src={thumbnailUrl} alt={thumbnailAlt} loading="lazy" />
        <button
          type="button"
          class="thumbnail-close"
          on:click={handleClear}
          aria-label="Remove current image"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M12.3 3.7a1 1 0 0 0-1.4-1.4L8 5.17 5.1 2.3A1 1 0 1 0 3.7 3.7L6.58 6.6 3.7 9.5a1 1 0 1 0 1.41 1.41L8 8l2.89 2.91a1 1 0 0 0 1.41-1.41L9.42 6.6z" />
          </svg>
        </button>

      {/if}
    </div>
    <input
      id="base-url-input"
      class="url-input"
      type="url"
      placeholder="Image URL..."
      bind:value
      required
    />
    <button type="submit">Update</button>
  </div>
</form>

<style>
  .base-url-form {
    display: grid;
    gap: 0.5rem;
    width: 100%;
    min-width: 10ch;
    margin: 0 auto;
    /* text-align: left; */
  }

  .form-label {
    font-weight: 600;
  }

  .form-controls {
    display: flex;
    gap: 0.75rem;
    flex-direction: column;
    align-items: start;
    @media (min-width: 480px) {
      flex-direction: row;
      align-items: center;
    }
  }

  .thumbnail {
    position: relative;
    width: 72px;
    height: 72px;
    flex: 0 0 auto;
    border-radius: var(--radius-sm);
    overflow: hidden;
    display: grid;
    place-items: center;
    transition: border var(--transition-speed-fast) ease;
  }

  .thumbnail-empty {
    border: 2px dashed color-mix(in srgb, var(--color-primary) 40%, transparent);
    background: color-mix(in srgb, var(--background) 80%, transparent);
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumbnail-close {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    border: none;
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--background) 30%, transparent);
    color: var(--text);
    padding: 0.2rem;
    line-height: 0;
    cursor: pointer;
    transition: background var(--transition-speed-fast) ease;
  }

  .thumbnail-close:hover,
  .thumbnail-close:focus-visible {
    background: color-mix(in srgb, var(--color-primary) 40%, transparent);
    outline: none;
  }

  .thumbnail-close svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  /* .thumbnail-placeholder {
    width: 50%;
    height: 50%;
    border-radius: var(--radius-sm);
    border: 1px dashed color-mix(in srgb, var(--color-primary) 35%, transparent);
  } */

  .url-input {
    flex: 1;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--color-primary);
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-family: monospace;
    @media (min-width: 960px) {
      min-width: 30ch;
    }
  }

  .url-input:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }
</style>
