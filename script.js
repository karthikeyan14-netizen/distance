let watchId = null;
let last = null;
let totalMeters = 0;

function rad(v) {
  return v * Math.PI / 180;
}

function haversine(a, b) {
  const R = 6371000;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) *
    Math.cos(rad(b.lat)) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function onLocation(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  const time = pos.timestamp;

  const current = {
    lat: latitude,
    lon: longitude,
    time
  };

  if (last) {
    const dt = (current.time - last.time) / 1000; // sec
    if (dt > 0) {
      const d = haversine(last, current);
      const speed = d / dt; // m/s

      // ODOMETER RULES
      const MAX_SPEED = 60; // m/s (~216 km/h)
      const MIN_MOVE = Math.max(accuracy, 4); // meters

      if (speed <= MAX_SPEED && d >= MIN_MOVE) {
        totalMeters += d;
      }
    }
  }

  last = current;

  document.getElementById("distance").innerText =
    (totalMeters / 1000).toFixed(2) + " km";
}

function startOdometer() {
  totalMeters = 0;
  last = null;

  watchId = navigator.geolocation.watchPosition(
    onLocation,
    err => console.error(err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 1000
    }
  );

  console.log("Odometer started");
}

function stopOdometer() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("Odometer stopped");
  }
}
