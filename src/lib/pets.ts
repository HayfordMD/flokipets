// This maps database pet image URLs/IDs to local assets.
// When you add your AI generated pet images to assets/pets/, you can map them here!
// e.g. 'pet1': require('../../assets/pets/pet1.png')

const petImages: Record<string, any> = {
  // Add your mappings here when images are ready!
  'default': require('../../assets/icon.png'), // Fallback until images are added
};

export function getPetImage(imageId?: string) {
  if (imageId && petImages[imageId]) {
    return petImages[imageId];
  }
  return petImages['default'];
}
