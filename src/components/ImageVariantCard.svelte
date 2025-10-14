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
    <h3>
      <a class="link" href={entry.url} target="_blank" rel="noreferrer" title="Open image in new tab">
        {entry.label}
      </a>
    </h3>
  </div>

  <div
    class="image-wrapper"
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

  .image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
  }
  .preview {
    width: 100%;
    display: block;
    border-radius: inherit;
    transition: transform 200ms ease-out;
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

  dl {
    display: grid;
    gap: 0.3rem;
  }

  dt {
    font-weight: 600;
  }
</style>
