import locations from '../utils/uk_locations_seed.json';

const toSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') : '';

const processLocations = () => {
  const allLocations = [];
  const { regions } = locations;

  if (!regions) return [];

  Object.keys(regions).forEach(regionName => {
    if (regionName.includes('(')) return;
    const regionSlug = toSlug(regionName);
    const region = {
      name: regionName,
      level: 1,
      path: `/salvagecarcollection/${regionSlug}`,
      slug: regionSlug,
      parents: [],
      children: [],
    };

    const counties = regions[regionName];
    if (counties) {
      Object.keys(counties).forEach(countyName => {
        if (countyName.includes('(')) return;
        region.children.push(countyName);
        const countySlug = toSlug(countyName);
        const county = {
          name: countyName,
          level: 2,
          path: `/salvagecarcollection/${regionSlug}/${countySlug}`,
          slug: countySlug,
          parents: [regionName],
          children: [],
        };

        const cities = counties[countyName];
        if (cities) {
          Object.keys(cities).forEach(cityName => {
            if (cityName.includes('(')) return;
            county.children.push(cityName);
            const citySlug = toSlug(cityName);
            const city = {
              name: cityName,
              level: 3,
              path: `/salvagecarcollection/${regionSlug}/${countySlug}/${citySlug}`,
              slug: citySlug,
              parents: [regionName, countyName],
              children: [],
            };

            const districts = cities[cityName];
            if (Array.isArray(districts) && districts.length > 0) {
              districts.forEach(districtName => {
                if (districtName.includes('(')) return;
                city.children.push(districtName);
                const districtSlug = toSlug(districtName);
                allLocations.push({
                  name: districtName,
                  level: 4,
                  path: `/salvagecarcollection/${regionSlug}/${countySlug}/${citySlug}/${districtSlug}`,
                  slug: districtSlug,
                  parents: [regionName, countyName, cityName],
                  children: [],
                });
              });
            }
            allLocations.push(city);
          });
        }
        allLocations.push(county);
      });
    }
    allLocations.push(region);
  });
  return allLocations;
};

export const allLocations = processLocations();

export const findLocationByPath = (params) => {
    const slugs = Object.values(params).filter(Boolean);
    if (slugs.length === 0) return null;
    const path = `/salvagecarcollection/${slugs.join('/')}`;
    return allLocations.find(loc => loc.path === path);
};