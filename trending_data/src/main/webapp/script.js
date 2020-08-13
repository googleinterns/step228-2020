
let map;

/* eslint-disable no-unused-vars */
/**

 * Initialise map
 */
function initMap() {
  const initPos = new google.maps.LatLng(-34.397, 150.644);
  map = new google.maps.Map(document.getElementById('map'), {
    center: initPos,
    zoom: 8,
  });

  const infoString =
    '<h2>This is a hardcoded tweet</h2>' +
    '<p>@twitter_person says: Super popular #tweet :o</p>';

  const infoWindow = new google.maps.InfoWindow({
    content: infoString,
    maxWidth: 200,
  });

  const marker = new google.maps.Marker({
    position: initPos,
    map,
    title: 'Trending Tweet',
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
} /* eslint-enable no-unused-vars */


