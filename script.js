// =======================
// STATE
// =======================
let lastPosition = null;
let count = 0;

let watchId = null;          // geolocation watcher
let isTracking = false;      // Start / Pause state
let locationEnabled = false; // 📍 ON / OFF state

// =======================
// ELEMENTS
// =======================
const counterEl = document.getElementById("counter");
const startPauseBtn = document.getElementById("startPauseBtn");
const restartBtn = document.getElementById("restartBtn");
const locationBtn = document.getElementById("locationToggle");

// =======================
// DISTANCE CALCULATION
// =======================
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// =======================
// LOCATION HANDLER
// =======================
function trackPosition(position) {
  const { latitude, longitude } = position.coords;

  if (!lastPosition) {
    lastPosition = { latitude, longitude };
    return;
  }

  const distance = getDistanceFromLatLonInMeters(
    lastPosition.latitude,
    lastPosition.longitude,
    latitude,
    longitude
  );

  if (distance >= 50) {
    count++;
    counterEl.textContent = count;
    lastPosition = { latitude, longitude };
    console.log(`50 meters traveled. Count: ${count}`);
  }
}

// =======================
// START GEOLOCATION
// =======================
function startGeolocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    trackPosition,
    (error) => {
      console.log("Location error:", error.message);
      stopGeolocation();
    },
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
  );
}

// =======================
// STOP GEOLOCATION
// =======================
function stopGeolocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// =======================
// 📍 LOCATION TOGGLE (MASTER SWITCH)
// =======================
locationBtn.addEventListener("click", () => {
  if (!locationEnabled) {
    locationEnabled = true;
    locationBtn.textContent = "📍 ON";

    // Start tracking only if Start button is active
    if (isTracking) startGeolocation();
  } else {
    locationEnabled = false;
    locationBtn.textContent = "📍 OFF";

    stopGeolocation();
  }
});

// =======================
// ▶ START / ⏸ PAUSE
// =======================
startPauseBtn.addEventListener("click", () => {
  if (!locationEnabled) {
    alert("Please turn ON location first 📍");
    return;
  }

  if (!isTracking) {
    // START
    startGeolocation();
    isTracking = true;
    startPauseBtn.textContent = "⏸ Pause";
  } else {
    // PAUSE
    stopGeolocation();
    isTracking = false;
    startPauseBtn.textContent = "▶ Start";
  }
});

// =======================
// ⟲ RESTART
// =======================
restartBtn.addEventListener("click", () => {
  stopGeolocation();

  lastPosition = null;
  count = 0;
  isTracking = false;

  counterEl.textContent = 0;
  startPauseBtn.textContent = "▶ Start";

  // If location is ON, keep permission but not tracking
  if (locationEnabled) {
    console.log("Location ready, waiting for Start");
  }
});
