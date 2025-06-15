import { floorRooms } from './rooms.js';
import { roomCoords } from './roomcoords.js';
import { roomDirections} from './directions.js'



let map = L.map('leafletMap', {
  crs: L.CRS.Simple,
  minZoom: -1,
  maxZoom: 5
});

let currentLayerGroup = L.layerGroup().addTo(map);

function showRooms(floor) {
  const roomList = document.getElementById('roomNames');
  const directionsBox = document.getElementById('directions');
  roomList.innerHTML = '';
  currentLayerGroup.clearLayers();
  directionsBox.textContent = '';

  const bounds = [[0, 0], [600, 700]];
  map.setView([200, 350], 0);
  map.setMaxBounds(bounds);

  const rooms = floorRooms[floor] || [];
  const coords = roomCoords[floor] || {};

  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room;
    li.setAttribute('data-room', room);
    roomList.appendChild(li);

    const shape = L.polygon(coords[room], {
      color: '#00338e',
      fillColor: 'blue',
      fillOpacity: 0.2
    }).addTo(currentLayerGroup);

    shape.bindTooltip(room, { permanent: true, direction: 'center', className: 'room-label' });
    shape._roomName = room;
  });

  document.querySelectorAll("#roomNames li").forEach(li => {
    li.addEventListener("click", () => {
      const selected = li.getAttribute("data-room");
      currentLayerGroup.eachLayer(layer => {
        if (layer._roomName === selected) {
          layer.setStyle({ fillColor: 'orange', color: 'red' });
          map.fitBounds(layer.getBounds());
        } else {
          layer.setStyle({ fillColor: 'blue', color: '#00338e' });
        }
      });
     
    const directionText = roomDirections[selected] || "No directions available.";
    document.getElementById('directions').textContent = directionText;
  
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showRooms(22); // Load default floor first

  // Attach event listeners to all floor buttons after DOM is ready
  document.querySelectorAll('.floor-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      const floor = parseInt(button.textContent.match(/\d+/)[0]);
      showRooms(floor);
    });
    
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const roomList = document.getElementById("roomNames");

  roomList.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "LI") {
      // Remove 'selected' class from all
      Array.from(roomList.children).forEach(li => li.classList.remove("selected"));

      // Add 'selected' class to clicked one
      e.target.classList.add("selected");
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const floorButtons = document.querySelectorAll(".floor-buttons button");

  floorButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove 'selected' from all buttons
      floorButtons.forEach(btn => btn.classList.remove("selected"));

      // Add 'selected' to clicked button
      button.classList.add("selected");
    });
  });
});

