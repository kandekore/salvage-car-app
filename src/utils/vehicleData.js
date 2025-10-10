// REMOVED: import vehicles from './all-vehicles-model.json';
import manufacturers from './salvage_manufacturers_all.json';

// --- Caching variables for our large dataset ---
let allVehicles = [];
let vehiclesPromise = null;
// ---

const toSlug = (name) => name ? name.toLowerCase().replace(/[\s/]+/g, '-').replace(/[().]/g, '') : '';

const processVehicles = (vehicles) => {
    return vehicles.map(vehicle => {
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
};

// This new function fetches and processes the vehicle data ONCE.
const getVehicleData = () => {
    if (allVehicles.length > 0) {
        return Promise.resolve(allVehicles); // Return cached data if available
    }
    if (vehiclesPromise) {
        return vehiclesPromise; // Return the ongoing promise if fetch is already in progress
    }
    // Start the fetch and store the promise
    vehiclesPromise = fetch('/all-vehicles-model.json') // URL relative to the public folder
        .then(res => res.json())
        .then(data => {
            allVehicles = processVehicles(data); // Process and cache the data
            return allVehicles;
        });
    return vehiclesPromise;
};


// --- UPDATED ASYNC EXPORT FUNCTIONS ---

export const getAllManufacturersForModelsList = async () => {
    const vehicles = await getVehicleData(); // Wait for data to be fetched
    const allMakesFromVehicles = [...new Set(vehicles.map(v => v.make))];
    return allMakesFromVehicles.map(makeName => {
        const slug = toSlug(makeName);
        return manufacturers.find(m => m.slug === slug) || {
            slug: slug,
            brand: makeName,
            logo_url: '/path/to/default/logo.png',
            models_overview: `We buy all ${makeName} models.`,
            popular_models: []
        };
    });
};

export const getGroupedModelsByMake = async (makeSlug) => {
    const vehicles = await getVehicleData(); // Wait for data
    const models = vehicles
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

export const findVehicleByVariantSlug = async (makeSlug, modelSlug, variantSlug) => {
    const vehicles = await getVehicleData(); // Wait for data
    return vehicles.find(v =>
        toSlug(v.make) === makeSlug &&
        toSlug(v.model) === modelSlug &&
        v.variantSlug === variantSlug
    );
};

// --- Manufacturer functions remain synchronous as they use a small, imported JSON ---
export const allManufacturers = manufacturers;
export const findManufacturerBySlug = (slug) => {
    return manufacturers.find(m => m.slug === slug);
};