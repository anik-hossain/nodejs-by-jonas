export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYW5pa2hvc3NhaW4iLCJhIjoiY2w3dWVxb2RrMDEwdjQwbXN1YjFrNXUydSJ9.PUIYBvPpJDpe3tUBcS55rw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/anikhossain/cl7ulry78001a14oy4jdfvu54', // style URL
        scrollZoom: false,
        // center: [-74.5, 40], // starting position [lng, lat]
        // zoom: 9, // starting zoom
        // projection: 'globe', // display the map as a 3D globe
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({ offset: 30 })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extends map bound to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
};
