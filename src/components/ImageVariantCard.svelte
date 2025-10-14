<script>
  export let entry;
</script>

<article class="card">
  <div class="card-body">
    <h3>
      <a class="link" href={entry.url} target="_blank" rel="noreferrer" title="Open image in new tab">
        {entry.label}
      </a>
    </h3>
  </div>

  <div class="image-wrapper">
    <img
      class={entry.xtraClasses || undefined}
      src={entry.url}
      alt={`${entry.label} variation`}
      loading="lazy"
    />
  </div>

  <div class="card-body">
    <dl>
      <dt class="metadata">Format: {entry.format}</dt>
      <dt class="metadata">
        Size:
        {#if entry.size !== null} 
          {entry.size.toFixed(2)} KB
        {:else}
          <span class="muted">Not available</span>
        {/if}
      </dt>
      <dt class="metadata">Params: {entry.params}</dt>
    </dl>

    {#if entry.notes}
      <p>{entry.notes}</p>
    {/if}
  </div>
</article>

<style>
  .card {
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: var(--pad-lg);
    & > div {
      margin-bottom: var(--pad-lg);
        &:last-child {
        margin-bottom: 0;
      }
    }
    &:hover {
      /* background-color: color-mix(in srgb, var(--background) 88%, transparent); */
      background: light-dark(var(--light-tint), var(--dark-tint));
    }
    transition-property: opacity, background-color;
    transition-duration: 300ms;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    /* gap: 0.75rem; */
    & h3 {
      margin-bottom: 0;
    }
  }

  .image-wrapper img {
    border-radius: 0.5rem;
    max-width: 100%;
  }
  .image-wrapper .image-avatar{
    border-radius: 50%;
    max-width: 50%;

  }

  dl {
    display: grid;
    gap: 0.3rem;
  }

  dt {
    font-weight: 600;
  }
</style>
