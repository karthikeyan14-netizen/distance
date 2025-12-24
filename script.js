let lastPosition = null;
let count = 0;
let watchId = null;
let isTracking = false;

const counterEl = document.getElementById("counter");
const startPauseBtn = document.getElementById("startPauseBtn");
const restartBtn = document.getElementById("restartBtn");

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
      counterEl.innerText = count;
      lastPosition = { latitude, longitude };
      console.log(`50 meters traveled. Count: ${count}`);
    }
  } else {
    lastPosition = { latitude, longitude };
  }
}

// Start / Pause button
startPauseBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  if (!isTracking) {
    // START
    watchId = navigator.geolocation.watchPosition(
      trackPosition,
      (error) => console.log("Error: " + error.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    isTracking = true;
    startPauseBtn.textContent = "⏸ Pause";
  } else {
    // PAUSE
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    isTracking = false;
    startPauseBtn.textContent = "▶ Start";
  }
});

// Restart button (reset everything)
restartBtn.addEventListener("click", () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = null;
  isTracking = false;
  lastPosition = null;
  count = 0;

  counterEl.innerText = 0;
  startPauseBtn.textContent = "▶ Start";
});
