import vehicles from './all-vehicles-model.json';
import manufacturers from './salvage_manufacturers_all.json';

// --- Helper Function ---
const toSlug = (name) => name ? name.toLowerCase().replace(/[\s/]+/g, '-').replace(/[().]/g, '') : '';

// --- Vehicle Processing (No changes here) ---
const processedVehicles = vehicles.map(vehicle => {
    const { make, model, year, trany, displ, id } = vehicle;
    let simpleTrany = 'Transmission';
    if (trany) {
        if (trany.toLowerCase().includes('automatic')) simpleTrany = 'Automatic';
        else if (trany.toLowerCase().includes('manual')) simpleTrany = 'Manual';
    }
    const displayName = `${make} ${model} (${year}) ${displ}L ${simpleTrany}`;
    const variantSlug = toSlug(`${model}-${year}-${displ}-${trany}-${id}`);
    const makeSlug = toSlug(make);
    const modelSlug = toSlug(model);
    return {
      ...vehicle,
      displayName,
      variantSlug,
      path: `/manufacturer/${makeSlug}/models/${modelSlug}/${variantSlug}`,
    };
});
export const allVehicles = processedVehicles;

// --- Data for /manufacturers page (Unchanged) ---
export const allManufacturers = manufacturers;
export const findManufacturerBySlug = (slug) => {
    return manufacturers.find(m => m.slug === slug);
};

// --- NEW DATA FUNCTION FOR /models PAGE ---
export const getAllManufacturersForModelsList = () => {
    // 1. Get all unique makes from the massive vehicle list.
    const allMakesFromVehicles = [...new Set(allVehicles.map(v => v.make))];

    // 2. Create a complete list of manufacturer objects for the models page.
    return allMakesFromVehicles.map(makeName => {
        const slug = toSlug(makeName);
        const detailedInfo = manufacturers.find(m => m.slug === slug);

        // Use detailed info if available, otherwise create a basic object
        return detailedInfo || {
            slug: slug,
            brand: makeName,
            logo_url: '/path/to/default/logo.png', // Placeholder
            models_overview: `We buy all ${makeName} models.`,
            popular_models: []
        };
    });
};


// --- Vehicle Functions (Unchanged) ---
export const getGroupedModelsByMake = (makeSlug) => {
    const models = allVehicles
        .filter(vehicle => toSlug(vehicle.make) === makeSlug)
        .reduce((acc, vehicle) => {
            const modelKey = vehicle.model;
            if (!acc[modelKey]) {
                acc[modelKey] = { name: vehicle.model, slug: toSlug(vehicle.model), variations: [] };
            }
            acc[modelKey].variations.push(vehicle);
            return acc;
        }, {});
    return Object.values(models).sort((a, b) => a.name.localeCompare(b.name));
};

export const findVehicleByVariantSlug = (makeSlug, modelSlug, variantSlug) => {
    return allVehicles.find(v =>
        toSlug(v.make) === makeSlug &&
        toSlug(v.model) === modelSlug &&
        v.variantSlug === variantSlug
    );
};