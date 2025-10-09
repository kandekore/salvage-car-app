import vehicles from './all-vehicles-model.json';
import manufacturers from './salvage_manufacturers_all.json';

// --- Helper Function ---
const toSlug = (name) => name ? name.toLowerCase().replace(/[\s/]+/g, '-').replace(/[().]/g, '') : '';

// --- Vehicle Processing ---
const processedVehicles = vehicles.map(vehicle => {
    const { make, model, year, trany, displ, fueltype1, id } = vehicle;

    // --- UPDATED LOGIC FOR DISPLAY NAME ---

    // 1. Simplify the transmission type
    let simpleTrany = 'Transmission'; // A sensible default
    if (trany) {
        if (trany.toLowerCase().includes('automatic')) {
            simpleTrany = 'Automatic';
        } else if (trany.toLowerCase().includes('manual')) {
            simpleTrany = 'Manual';
        }
    }

    // 2. Create the new, cleaner display name
    const displayName = `${make} ${model} (${year}) ${displ}L ${simpleTrany}`;

    // --- End of Updated Logic ---

    const variantSlug = toSlug(`${model}-${year}-${displ}-${trany}-${id}`);
    const makeSlug = toSlug(make);
    const modelSlug = toSlug(model);

    return {
      ...vehicle,
      displayName, // This now holds the cleaner name
      variantSlug,
      path: `/manufacturer/${makeSlug}/models/${modelSlug}/${variantSlug}`,
    };
});

export const allVehicles = processedVehicles;

// --- New function to get models grouped with their variations ---
export const getGroupedModelsByMake = (makeSlug) => {
    const models = allVehicles
        .filter(vehicle => toSlug(vehicle.make) === makeSlug)
        .reduce((acc, vehicle) => {
            const modelKey = vehicle.model;
            if (!acc[modelKey]) {
                acc[modelKey] = {
                    name: vehicle.model,
                    slug: toSlug(vehicle.model),
                    variations: []
                };
            }
            acc[modelKey].variations.push(vehicle);
            return acc;
        }, {});
    return Object.values(models).sort((a, b) => a.name.localeCompare(b.name));
};

// --- New function to find a specific vehicle variation by its unique slugs ---
export const findVehicleByVariantSlug = (makeSlug, modelSlug, variantSlug) => {
    return allVehicles.find(v => 
        toSlug(v.make) === makeSlug && 
        toSlug(v.model) === modelSlug && 
        v.variantSlug === variantSlug
    );
};


// --- Existing Manufacturer Functions (Unchanged) ---
export const allManufacturers = manufacturers;

export const findManufacturerBySlug = (slug) => {
    return manufacturers.find(m => m.slug === slug);
};