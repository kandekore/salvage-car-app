// ... (all the existing code at the top of the file)
import manufacturers from '../utils/salvage_manufacturers_all.json';
import models from '../utils/all-vehicles-model.json';

const toSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

export const allManufacturers = manufacturers.map(m => ({
  ...m,
  path: `/manufacturer/${m.slug}`,
  modelsPath: `/manufacturer/${m.slug}/models`
}));

export const allModels = models.map(m => ({
  ...m,
  slug: toSlug(m.model),
  makeSlug: toSlug(m.make),
  path: `/model/${toSlug(m.make)}/${toSlug(m.model)}`
}));

export const modelsByManufacturer = allModels.reduce((acc, model) => {
  const make = model.make;
  if (!acc[make]) {
    acc[make] = [];
  }
  acc[make].push(model);
  return acc;
}, {});

export const findManufacturerBySlug = (slug) => allManufacturers.find(m => m.slug === slug);

export const findModelBySlugs = (makeSlug, modelSlug) => {
  return allModels.find(m => m.makeSlug === makeSlug && m.slug === modelSlug);
};

// --- NEW HELPER FUNCTION ---
// Finds all models that match a given manufacturer slug
export const findModelsByManufacturer = (makeSlug) => {
  return allModels.filter(m => m.makeSlug === makeSlug);
};