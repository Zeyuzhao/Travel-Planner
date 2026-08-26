import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

const icons = {
  route: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 19c-2.2 0-4-1.8-4-4s1.8-4 4-4h12a2 2 0 1 0 0-4h-2"/><circle cx="8" cy="7" r="3"/><circle cx="18" cy="15" r="3"/></svg>`,
  heart: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>`,
  phrase: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></svg>`,
};

const itinerary = [
  {
    day: "01",
    date: "OCT 16",
    city: "Tokyo",
    title: "Land softly",
    detail: "Check in, stretch your legs in Daikanyama, then ramen under the lanterns in Ebisu.",
    focus: [35.6812, 139.7671],
    zoom: 12,
  },
  {
    day: "02",
    date: "OCT 17",
    city: "Tokyo",
    title: "Old Tokyo, new Tokyo",
    detail: "Early Asakusa, Kiyosumi gardens, and a golden-hour wander through Shibuya.",
    focus: [35.6952, 139.7577],
    zoom: 11,
  },
  {
    day: "03",
    date: "OCT 18",
    city: "Tokyo → Kyoto",
    title: "Ride the Tokaido",
    detail: "Tokyo Station bento, Mount Fuji-side seats, then a quiet first night in Gion.",
    bounds: [[34.9858, 135.7588], [35.6812, 139.7671]],
  },
  {
    day: "04",
    date: "OCT 19",
    city: "Kyoto",
    title: "Temples before breakfast",
    detail: "Kiyomizu-dera at opening, Philosopher’s Path, then Pontocho after dark.",
    focus: [35.0116, 135.7681],
    zoom: 12,
  },
  {
    day: "05",
    date: "OCT 20",
    city: "Kyoto → Nara",
    title: "A day among the deer",
    detail: "JR Nara Line south; Tōdai-ji, Kasuga paths, and a late train onward to Osaka.",
    bounds: [[34.6805, 135.818], [34.9858, 135.7588]],
  },
  {
    day: "06",
    date: "OCT 21",
    city: "Osaka",
    title: "Eat the city",
    detail: "Kuromon Market, retro Shinsekai, and a Dotonbori crawl—one plate at a time.",
    focus: [34.6777, 135.5018],
    zoom: 12,
  },
  {
    day: "07",
    date: "OCT 22",
    city: "Osaka",
    title: "One last view",
    detail: "Nakazakicho coffee, Osaka Castle park, and sunset from the Umeda Sky Building.",
    focus: [34.7025, 135.4959],
    zoom: 12,
  },
];

const testingBanner = import.meta.env.MODE === "development" ? `
  <div class="testing-banner" role="status" aria-label="Testing environment notice">
    <strong>Testing environment</strong>
    <span aria-hidden="true">•</span>
    <span>Changes here are for validation only</span>
  </div>
` : "";

document.querySelector("#app").innerHTML = `
  ${testingBanner}
  <div class="trip-shell">
    <aside class="sidebar">
      <header class="trip-header">
        <p class="eyebrow">A trip for two</p>
        <h1>Japan,<br><em>together.</em></h1>
        <div class="trip-meta">
          <div><span>Depart</span><strong>SEA · OCT 15</strong></div>
          <span class="meta-arrow">→</span>
          <div><span>Return</span><strong>OCT 23 · SEA</strong></div>
        </div>
      </header>

      <nav class="section-tabs" aria-label="Trip guide sections">
        <button class="tab active" data-tab="itinerary" aria-selected="true">${icons.route}<span>Route</span></button>
        <button class="tab" data-tab="proposal" aria-selected="false">${icons.heart}<span>Moment</span></button>
        <button class="tab" data-tab="phrases" aria-selected="false">${icons.phrase}<span>Speak</span></button>
      </nav>

      <div class="sidebar-content">
        <section class="panel active" id="itinerary" aria-labelledby="itinerary-heading">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Seven good days</p>
              <h2 id="itinerary-heading">The itinerary</h2>
            </div>
            <span class="distance-pill">645 km by rail</span>
          </div>
          <div class="day-list">
            ${itinerary.map((item, index) => `
              <button class="day-card ${index === 0 ? "selected" : ""}" data-day="${index}" aria-label="Show day ${Number(item.day)} on the map">
                <span class="day-number">${item.day}</span>
                <span class="day-copy">
                  <span class="day-line"><strong>${item.title}</strong><small>${item.date}</small></span>
                  <span class="day-city">${item.city}</span>
                  <span class="day-detail">${item.detail}</span>
                </span>
                <span class="card-arrow">↗</span>
              </button>
            `).join("")}
          </div>
          <div class="home-flight"><span>OCT 23</span><strong>KIX → SEA</strong><small>Head home, camera roll full.</small></div>
        </section>

        <section class="panel" id="proposal" aria-labelledby="proposal-heading" hidden>
          <p class="eyebrow">A quiet yes</p>
          <h2 id="proposal-heading">The proposal spot</h2>
          <div class="proposal-card">
            <div class="proposal-art"><span>鴨川デルタ</span><b>35.0308° N<br>135.7717° E</b></div>
            <div class="proposal-copy">
              <span class="recommendation">Our pick · October 19</span>
              <h3>Kamo River Delta</h3>
              <p>Two rivers meet beneath Kyoto’s eastern mountains. Cross the stepping stones, find a quiet patch on the east bank, and let the evening turn gold.</p>
            </div>
          </div>
          <div class="moment-timeline">
            <div><span>17:45</span><p>Pick up two favorite treats near Demachiyanagi and walk down to the river.</p></div>
            <div><span>18:10</span><p>Cross the stepping stones; settle on the quieter east bank facing the mountains.</p></div>
            <div><span>18:30</span><p>Evening light, the question, then dinner already booked back in Gion.</p></div>
          </div>
          <button class="map-action" data-location="proposal">Show the spot on the map <span>↗</span></button>
          <p class="plan-b"><strong>Rain plan:</strong> the enclosed Skyway at Kyoto Station—city lights, shelter, and plenty of room to find your own moment.</p>
        </section>

        <section class="panel" id="phrases" aria-labelledby="phrases-heading" hidden>
          <p class="eyebrow">Tiny phrases, big smiles</p>
          <h2 id="phrases-heading">Say it simply</h2>
          <div class="phrase-list">
            <button class="phrase-row"><span class="jp">こんにちは</span><span><strong>Konnichiwa</strong><small>Hello</small></span><b>▶</b></button>
            <button class="phrase-row"><span class="jp">ありがとう<br>ございます</span><span><strong>Arigatō gozaimasu</strong><small>Thank you very much</small></span><b>▶</b></button>
            <button class="phrase-row"><span class="jp">二人です</span><span><strong>Futari desu</strong><small>Table for two</small></span><b>▶</b></button>
            <button class="phrase-row"><span class="jp">これをください</span><span><strong>Kore o kudasai</strong><small>This one, please</small></span><b>▶</b></button>
            <button class="phrase-row"><span class="jp">駅はどこですか</span><span><strong>Eki wa doko desu ka?</strong><small>Where is the station?</small></span><b>▶</b></button>
            <button class="phrase-row"><span class="jp">乾杯！</span><span><strong>Kanpai!</strong><small>Cheers!</small></span><b>▶</b></button>
          </div>
          <p class="tap-note">Tap a phrase to practice its rhythm.</p>
        </section>

      </div>
    </aside>

    <main class="map-stage">
      <div id="map" aria-label="Interactive map of the rail route from Tokyo to Kyoto, Nara, and Osaka"></div>
      <button class="fit-route" aria-label="Fit the complete route on the map">Fit route</button>
    </main>
  </div>
`;

const map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: true,
  minZoom: 5,
}).setView([35.35, 137.65], 7);

L.control.zoom({ position: "topright" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
  maxZoom: 19,
  opacity: 0.42,
  attribution: '&copy; <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>',
}).addTo(map);

const railStations = {
  tokyo: { name: "Tokyo", coords: [35.6811412, 139.7674549] },
  shinagawa: { name: "Shinagawa", coords: [35.6286974, 139.7391291] },
  shinYokohama: { name: "Shin-Yokohama", coords: [35.5072282, 139.6174221] },
  nagoya: { name: "Nagoya", coords: [35.1707285, 136.8818431] },
  kyoto: { name: "Kyoto", coords: [34.9853497, 135.758766] },
  tofukuji: { name: "Tōfukuji", coords: [34.9812619, 135.7700213] },
  rokujizo: { name: "Rokujizō", coords: [34.9335726, 135.7963125] },
  uji: { name: "Uji", coords: [34.8904111, 135.8007079] },
  joyo: { name: "Jōyō", coords: [34.8560656, 135.7808145] },
  tamamizu: { name: "Tamamizu", coords: [34.800257, 135.8070307] },
  kizu: { name: "Kizu", coords: [34.7358877, 135.8249246] },
  nara: { name: "Nara", coords: [34.6808117, 135.8189414] },
  koriyama: { name: "Kōriyama", coords: [34.6480872, 135.7903341] },
  yamatoKoizumi: { name: "Yamato-Koizumi", coords: [34.6224108, 135.7636549] },
  horyuji: { name: "Hōryūji", coords: [34.6016824, 135.7391165] },
  oji: { name: "Ōji", coords: [34.5973636, 135.7035805] },
  kyuhoji: { name: "Kyūhōji", coords: [34.6224465, 135.5840263] },
  tennoji: { name: "Tennōji", coords: [34.6473432, 135.5152413] },
  shinImamiya: { name: "Shin-Imamiya", coords: [34.6498493, 135.502195] },
  taisho: { name: "Taishō", coords: [34.6656183, 135.4786895] },
  bentencho: { name: "Bentenchō", coords: [34.670288, 135.4618301] },
  nishikujo: { name: "Nishikujō", coords: [34.6822701, 135.4663099] },
  fukushima: { name: "Fukushima", coords: [34.6972584, 135.4868438] },
  osaka: { name: "Osaka", coords: [34.7022133, 135.4955732] },
};

const station = (id) => railStations[id].coords;

const railSegments = [
  {
    name: "Nozomi · Tokaido Shinkansen",
    sub: "Tokyo → Kyoto · 5 stops · about 2h 10m",
    color: "#e4573f",
    stops: ["tokyo", "shinagawa", "shinYokohama", "nagoya", "kyoto"],
    coords: [
      station("tokyo"),[35.6555,139.7459],station("shinagawa"),[35.5698,139.6828],
      station("shinYokohama"),[35.4434,139.5667],[35.3606,139.4686],[35.2564,139.155],
      [35.1034,139.0777],[35.1260,138.9107],[35.1420,138.6635],[35.1030,138.5295],
      [34.9716,138.3889],[34.8543,138.2494],[34.7693,138.0144],[34.7038,137.7346],
      [34.7628,137.3817],[34.9689,137.0602],station("nagoya"),[35.3158,136.6856],
      [35.3154,136.2905],[35.1232,136.1875],[35.0373,135.9818],station("kyoto")
    ],
  },
  {
    name: "Miyakoji Rapid · JR Nara Line",
    sub: "Kyoto → Nara · 8 stops · about 45m",
    color: "#355f57",
    stops: ["kyoto", "tofukuji", "rokujizo", "uji", "joyo", "tamamizu", "kizu", "nara"],
    coords: [
      station("kyoto"),station("tofukuji"),[34.9568,135.7688],station("rokujizo"),
      [34.9049,135.7930],station("uji"),[34.8777,135.8060],station("joyo"),
      [34.8261,135.8060],station("tamamizu"),[34.7880,135.8150],station("kizu"),
      [34.7010,135.8210],station("nara")
    ],
  },
  {
    name: "Yamatoji Rapid",
    sub: "Nara → Osaka · 13 stops · about 50m",
    color: "#d49b38",
    stops: [
      "nara", "koriyama", "yamatoKoizumi", "horyuji", "oji", "kyuhoji", "tennoji",
      "shinImamiya", "taisho", "bentencho", "nishikujo", "fukushima", "osaka",
    ],
    coords: [
      station("nara"),station("koriyama"),station("yamatoKoizumi"),station("horyuji"),
      station("oji"),[34.6018,135.6460],[34.6215,135.6007],station("kyuhoji"),
      [34.6384,135.5702],station("tennoji"),station("shinImamiya"),station("taisho"),
      station("bentencho"),station("nishikujo"),station("fukushima"),station("osaka")
    ],
  },
];

const routeGroup = L.featureGroup().addTo(map);

railSegments.forEach((segment) => {
  L.polyline(segment.coords, {
    color: "#fffaf0",
    weight: 9,
    opacity: 0.9,
    lineCap: "round",
  }).addTo(routeGroup);
  const line = L.polyline(segment.coords, {
    color: segment.color,
    weight: 5,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(routeGroup);
  line.bindTooltip(`<strong>${segment.name}</strong><br><span>${segment.sub}</span>`, {
    sticky: true,
    className: "route-tooltip",
  });

  segment.stops.slice(1, -1).forEach((stationId, index) => {
    const stop = railStations[stationId];
    L.circleMarker(stop.coords, {
      radius: 4,
      color: "#fffaf0",
      weight: 2,
      fillColor: segment.color,
      fillOpacity: 1,
    }).bindTooltip(`<strong>${stop.name} Station</strong><br><span>Stop ${index + 2} of ${segment.stops.length}</span>`, {
      direction: "top",
      offset: [0, -5],
      className: "route-tooltip station-tooltip",
    }).addTo(routeGroup);
  });
});

const cities = [
  { name: "Tokyo", code: "TYO", date: "OCT 16–18", coords: station("tokyo"), color: "#e4573f" },
  { name: "Kyoto", code: "KYO", date: "OCT 18–20", coords: station("kyoto"), color: "#355f57" },
  { name: "Nara", code: "NAR", date: "OCT 20", coords: station("nara"), color: "#355f57" },
  { name: "Osaka", code: "OSA", date: "OCT 20–23", coords: station("osaka"), color: "#d49b38" },
];

cities.forEach((city, index) => {
  const marker = L.marker(city.coords, {
    icon: L.divIcon({
      className: "city-marker-wrap",
      html: `<div class="city-marker" style="--marker:${city.color}"><b>${index + 1}</b><span>${city.code}</span></div>`,
      iconSize: [64, 40],
      iconAnchor: [20, 20],
    }),
  }).addTo(routeGroup);
  marker.bindPopup(`<div class="city-popup"><small>${city.date}</small><strong>${city.name}</strong><span>${city.code}</span></div>`, {
    closeButton: false,
    offset: [0, -10],
  });
});

const proposalMarker = L.marker([35.0308, 135.7717], {
  icon: L.divIcon({
    className: "proposal-marker-wrap",
    html: `<div class="proposal-marker">${icons.heart}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  }),
});
proposalMarker.bindPopup(`<div class="city-popup"><small>THE MOMENT</small><strong>Kamo River Delta</strong><span>Golden hour · Oct 19</span></div>`, {
  closeButton: false,
  offset: [0, -8],
});

const fitRoute = () => map.fitBounds(routeGroup.getBounds(), { padding: [60, 60] });
fitRoute();

document.querySelector(".fit-route").addEventListener("click", fitRoute);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      const active = panel.id === target;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (target === "proposal") {
      proposalMarker.addTo(map);
    } else if (map.hasLayer(proposalMarker)) {
      map.removeLayer(proposalMarker);
    }
  });
});

document.querySelectorAll(".day-card").forEach((card) => {
  card.addEventListener("click", () => {
    const selected = itinerary[Number(card.dataset.day)];
    document.querySelectorAll(".day-card").forEach((item) => item.classList.toggle("selected", item === card));
    if (selected.bounds) {
      map.fitBounds(selected.bounds, { padding: [90, 90], maxZoom: 8 });
    } else {
      map.flyTo(selected.focus, selected.zoom, { duration: 1.1 });
    }
  });
});

document.querySelector('[data-location="proposal"]').addEventListener("click", () => {
  proposalMarker.addTo(map).openPopup();
  map.flyTo([35.0308, 135.7717], 13, { duration: 1.2 });
});

document.querySelectorAll(".phrase-row").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".phrase-row").forEach((item) => item.classList.remove("playing"));
    row.classList.add("playing");
    window.setTimeout(() => row.classList.remove("playing"), 1300);
  });
});

window.addEventListener("resize", () => window.setTimeout(() => map.invalidateSize(), 120));
