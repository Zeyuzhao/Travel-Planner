import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

const map = L.map('map', { zoomControl: false, scrollWheelZoom: true, touchZoom: true, attributionControl: true }).setView([35.12, 136.2], 7.4);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const stops = {
  tokyo: { name: 'Tokyo', coords: [35.6812, 139.7671], caption: 'Asakusa · Meiji Jingu · Shibuya' },
  kyoto: { name: 'Kyoto', coords: [34.9855, 135.7580], caption: 'Arashiyama · Gion · Kiyomizu-dera' },
  nara: { name: 'Nara', coords: [34.6802, 135.8196], caption: 'Nara Park · Tōdai-ji · Naramachi' },
  osaka: { name: 'Osaka', coords: [34.7025, 135.4959], caption: 'Dōtonbori · Tonbori Riverwalk · Namba' }
};

// Simplified station-to-station geometry of the Tokaido Shinkansen and Yamatoji/Nara corridors.
const shinkansen = [[35.6812,139.7671],[35.562,139.661],[35.437,139.641],[35.298,139.471],[35.256,139.157],[35.154,138.681],[35.103,138.512],[35.059,137.689],[35.171,136.881],[35.103,136.852],[35.029,135.777],[34.9855,135.758]];
const naraLine = [[34.9855,135.758],[34.959,135.766],[34.882,135.807],[34.788,135.834],[34.704,135.832],[34.6802,135.8196]];
const osakaLine = [[34.6802,135.8196],[34.678,135.789],[34.681,135.738],[34.679,135.693],[34.681,135.63],[34.683,135.57],[34.7025,135.4959]];
const routeStyle = { color: '#d65b41', weight: 4, opacity: .9, lineCap: 'round', lineJoin: 'round' };
[shinkansen, naraLine, osakaLine].forEach(points => L.polyline(points, routeStyle).addTo(map));

function iconFor(number) { return L.divIcon({ className: 'stop-icon-wrap', html: `<span class="stop-icon">${number}</span>`, iconSize:[30,30], iconAnchor:[15,15] }); }
Object.entries(stops).forEach(([id, stop], index) => {
  L.marker(stop.coords, { icon: iconFor(index + 1), title: stop.name }).addTo(map)
    .bindPopup(`<div class="popup"><b>${stop.name}</b><span>${stop.caption}</span></div>`);
});

document.querySelectorAll('[data-stop]').forEach(button => button.addEventListener('click', () => {
  const stop = stops[button.dataset.stop];
  map.flyTo(stop.coords, 11, { duration: 1.1 });
  document.querySelectorAll('.itinerary li').forEach(item => item.classList.remove('active'));
  button.closest('li').classList.add('active');
}));
