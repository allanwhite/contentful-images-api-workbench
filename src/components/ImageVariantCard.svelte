<script>
  export let entry;

  let transformOrigin = '50% 50%';
  let zoomed = false;
  let resetTimer;
  let originResetTimer;

  function positionToOrigin(event) {
    if (!('clientX' in event) || !('clientY' in event)) {
      transformOrigin = '50% 50%';
      return;
    }
    const wrapper = event.currentTarget;
    const rect = wrapper.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  }

  function clearResetTimer() {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = undefined;
    }
    if (originResetTimer) {
      clearTimeout(originResetTimer);
      originResetTimer = undefined;
    }
  }

  function scheduleReset() {
    clearResetTimer();
    resetTimer = setTimeout(() => {
      zoomed = false;
      originResetTimer = setTimeout(() => {
        transformOrigin = '50% 50%';
        originResetTimer = undefined;
      }, 220);
      resetTimer = undefined;
    }, 300);
  }

  function handlePointerMove(event) {
    if (!zoomed) return;
    positionToOrigin(event);
  }

  function toggleZoom(event) {
    clearResetTimer();
    positionToOrigin(event);
    zoomed = !zoomed;
    if (!zoomed) {
      originResetTimer = setTimeout(() => {
        transformOrigin = '50% 50%';
        originResetTimer = undefined;
      }, 220);
    }
  }

  function handlePointerLeave() {
    if (zoomed) {
      scheduleReset();
    } else {
      transformOrigin = '50% 50%';
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleZoom(event);
    }
    if (event.key === 'Escape') {
      scheduleReset();
    }
  }

  function handleBlur() {
    if (zoomed) {
      scheduleReset();
    }
  }
</script>

<article class="card">
  <div class="card-body">
    <div class="metadata">
      <h3 class="image-title">
        <a class="link" href={entry.url} target="_blank" rel="noreferrer" title="Open image in new tab">
          {entry.label}
        </a>
      </h3>
      <div class="image-meta">
        {#if entry.size !== null} 
          <span class="image-size mono">{entry.size.toFixed(2)} kB</span>
        {:else}
          <span class="muted">(file size not available)</span>
        {/if}
        <span class="label-small">{entry.format}</span>
      </div>
    </div>

  </div>

  <div
    class="image-wrapper loader"
    role="button"
    tabindex="0"
    aria-pressed={zoomed}
    class:zoomed
    on:pointermove={handlePointerMove}
    on:pointerdown={toggleZoom}
    on:pointerleave={handlePointerLeave}
    on:pointerenter={clearResetTimer}
    on:focus={clearResetTimer}
    on:blur={handleBlur}
    on:keydown={handleKeydown}
  >
    <img
      class={`${entry.xtraClasses ? `${entry.xtraClasses} ` : ''}preview`}
      src={entry.url}
      alt={`${entry.label} variation`}
      loading="lazy"
      style={`transform-origin: ${transformOrigin};`}
    />
  </div>

  <div class="card-body">

    {#if entry.params !== ''}
      <p>Params: <span class="mono">{entry.params}</span></p>
    {/if}
    {#if entry.notes}
      <p>{entry.notes}</p>
    {/if}
  </div>
</article>

<style>
  .card {
    border-radius: var(--radius-lg);
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
    /* & h3 {
      margin-bottom: 0;
    } */
    & p {
      margin: 0 0 0.7em 0;
      line-height: 1.4;
    }
  }

  .image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-md);
  }
  .preview {
    width: 100%;
    display: block;
    border-radius: inherit;
    transition: transform 200ms ease-out;
  }
  .metadata {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    & h3 {
      margin: 0;
      line-height: inherit;
    }
  }
  .image-size {
    font-weight: 500;
    font-size: larger;
    margin-right: 0.5rem;
  }
  .image-meta {
    display: inline-flex;
  }
  .image-wrapper.zoomed {
    cursor: zoom-out;
  }

  .image-wrapper:not(.zoomed) {
    cursor: zoom-in;
  }

  .image-wrapper.zoomed .preview {
    transform: scale(3);
    transition-delay: 300ms;
  }

  .image-wrapper .image-avatar{
    border-radius: 50%;
    max-width: 50%;
  }
/* 
  dl {
    display: grid;
    gap: 0.3rem;
  }

  dt {
    font-weight: 600;
  } */
</style>
