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
}
