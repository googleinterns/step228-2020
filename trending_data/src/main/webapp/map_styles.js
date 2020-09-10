export {darkMode, darkModeWithBorders, standard, darkerStandard,
  blueCountriesWithBorders, simplifiedStandardWithBorders};

const darkMode = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#8ec3b9',
      },
    ],
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1a3646',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4b6878',
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#64779e',
      },
    ],
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4b6878',
      },
    ],
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#334e87',
      },
    ],
  },
  {
    'featureType': 'landscape.natural',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#283d6a',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#6f9ba5',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'poi.business',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#3C7680',
      },
    ],
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#304a7d',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#98a5be',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2c6675',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#255763',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#b0d5ce',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#98a5be',
      },
    ],
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#283d6a',
      },
    ],
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#3a4762',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#0e1626',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#4e6d70',
      },
    ],
  },
];

const standard = [];

const darkerStandard = [
  {
    'featureType': 'landscape',
    'stylers': [
      {
        'saturation': -45,
      },
      {
        'lightness': -20,
      },
    ],
  },
  {
    'featureType': 'water',
    'stylers': [
      {
        'saturation': -60,
      },
      {
        'lightness': -35,
      },
    ],
  },
];

const darkModeWithBorders = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#8ec3b9',
      },
    ],
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1a3646',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#161c69',
      },
      {
        'saturation': -5,
      },
      {
        'lightness': -10,
      },
      {
        'visibility': 'on',
      },
      {
        'weight': 3,
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4b6878',
      },
      {
        'weight': 2.5,
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#64779e',
      },
    ],
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#4b6878',
      },
    ],
  },
  {
    'featureType': 'landscape',
    'stylers': [
      {
        'color': '#1e2743',
      },
      {
        'saturation': -5,
      },
      {
        'visibility': 'on',
      },
    ],
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#334e87',
      },
    ],
  },
  {
    'featureType': 'landscape.natural',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#283d6a',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#6f9ba5',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'poi.business',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#3C7680',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#304a7d',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#98a5be',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2c6675',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#255763',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#b0d5ce',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#023e58',
      },
    ],
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#98a5be',
      },
    ],
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1d2c4d',
      },
    ],
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#283d6a',
      },
    ],
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#3a4762',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#0e1626',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#4e6d70',
      },
    ],
  },
];

const simplifiedStandardWithBorders = [
  {
    'featureType': 'administrative',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#9c997c',
      },
      {
        'weight': 1.5,
      },
    ],
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'landscape',
    'stylers': [
      {
        'color': '#fffad1',
      },
    ],
  },
];

const blueCountriesWithBorders = [
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#898a9a',
      },
      {
        'weight': 2,
      },
    ],
  },
  {
    'featureType': 'landscape',
    'stylers': [
      {
        'color': '#373c76',
      },
    ],
  },
  {
    'featureType': 'poi',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
];
