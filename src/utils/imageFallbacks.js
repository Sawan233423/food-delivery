// Resilient fallback images and handler to prevent any broken images
export const FALLBACK_IMAGES = {
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  rider: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  category: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop&q=80'
};

export const onImageError = (e, type = 'food') => {
  const fallback = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.food;
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
};
