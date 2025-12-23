let lastPosition = null;
let count = 0;

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function trackPosition(position) {
  const { latitude, longitude } = position.coords;

  if (lastPosition) {
    const distance = getDistanceFromLatLonInMeters(
      lastPosition.latitude,
      lastPosition.longitude,
      latitude,
      longitude
    );

    if (distance >= 50) {
      count++;
      lastPosition = { latitude, longitude };
      console.log(`You traveled 50 meters! Count: ${count}`);
      document.getElementById("counter").innerText = count;
    }
  } else {
    lastPosition = { latitude, longitude };
  }
}

// Start tracking only when button is pressed
document.getElementById("startBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      trackPosition,
      (error) => console.log("Error: " + error.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
    alert("Tracking started! Move around to increment the counter.");
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
