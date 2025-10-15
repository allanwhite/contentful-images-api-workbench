export const variationPresets = [
  { label: 'Original', params: '', notes: 'Original image format', xtraClasses: '' },
  {
    label: 'Scaled WebP',
    params: '?w=800&fm=webp&q=70',
    notes: 'WebP has robust browser support.',
    xtraClasses: ''
  },
  {
    label: 'Scaled AVIF',
    params: '?w=800&fm=avif&q=50',
    notes: 'AVIF tends to be about 10-15% smaller than WebP, with slightly less browser support.',
    xtraClasses: ''
  },
  {
    label: 'LQIP Preview',
    params: '?q=1&w=40&fm=webp',
    notes: 'LQIP (low-quality preview image) version. A CSS Blur(30px) filter has been applied.',
    xtraClasses: 'loading-blur loading-fill'
  },
  {
    label: 'Crop: Face',
    params: '?fit=thumb&w=480&h=480&f=face&fm=webp',
    notes: 'You can use face or face(s) to easily generate thumbnails of people',
    xtraClasses: 'image-avatar'
  }
];

export const getBaseFormat = (url) => {
  const [withoutParams] = url.split('?');
  const extension = withoutParams?.split('.').pop();
  return extension ? extension.toUpperCase() : 'IMAGE';
};

export const formatFromParams = (params, fallbackFormat) => {
  const match = params.match(/(?:\?|&)fm=([^&]+)/);
  return match ? match[1].toUpperCase() : fallbackFormat;
};

export const buildVariantEntries = (url, variants = variationPresets) => {
  const fallbackFormat = getBaseFormat(url);
  return variants.map((variant) => ({
    ...variant,
    url: `${url}${variant.params}`,
    format: formatFromParams(variant.params, fallbackFormat),
    size: null
  }));
};

export async function fetchImageSize(imageUrl, signal) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD', signal });
    if (!response.ok) {
      return null;
    }

    const contentLength = response.headers.get('Content-Length');
    if (!contentLength) {
      return null;
    }

    const fileSizeInBytes = parseInt(contentLength, 10);
    return Number.isNaN(fileSizeInBytes) ? null : fileSizeInBytes / 1024;
  } catch (error) {
    if (error.name === 'AbortError') {
      return null;
    }
    console.error('Error fetching image size:', error);
    return null;
  }
}

export async function hydrateVariantSizes(entries, signal) {
  const resolved = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      size: await fetchImageSize(entry.url, signal)
    }))
  );

  return signal?.aborted ? entries : resolved;
}
