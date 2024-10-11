import { Viewer } from "@photo-sphere-viewer/core";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import { VisibleRangePlugin } from "@photo-sphere-viewer/visible-range-plugin";

const floorsData = {
  1: [
    {
      value: 20,
      height: "55 метров",
    },
    {
      value: 15,
      height: "45 метров",
    },
    {
      value: 10,
      height: "35 метров",
    },
  ],
  2: [
    {
      value: 20,
      height: "55 метров",
    },
    {
      value: 15,
      height: "45 метров",
    },
    {
      value: 10,
      height: "35 метров",
    },
  ],
};

let currentTower = 1;
let currentFloor = floorsData[currentTower][1];

const viewer = new Viewer({
  plugins: [
    [
      VisibleRangePlugin,
      {
        verticalRange: [-Math.PI / 5, Math.PI / 5],
      },
    ],
  ],
  navbar: false,
  container: document.querySelector("#viewer"),
  adapter: EquirectangularTilesAdapter,
  panorama: {
    width: 8192,
    cols: 16,
    rows: 8,
    baseUrl: `./assets/low/${currentTower}/${currentFloor.value}.jpg`,
    tileUrl: (col, row) => {
      return `./assets/tiles/${currentTower}/${currentFloor.value}_${col}_${row}.jpg`;
    },
  },
  lang: {
    loading: "Загрузка...",
    loadError: "Панорама не найдена.",
  },
});

// const floorsContainer = document.getElementById("floors-container");

function setLoadingState(value) {
  document
    .querySelectorAll("[data-panorama-control]")
    .forEach((control) => (control.disabled = value));
}

function setCurrentTower(tower) {
  currentTower = tower;

  document
    .querySelectorAll("[data-set-tower]")
    .forEach((button) => (button.ariaCurrent = false));

  document.querySelector(`[data-set-tower='${tower}']`).ariaCurrent = true;
}

// function setCurrentFloor(floor) {
//   currentFloor = floor;

//   document
//     .querySelectorAll("[data-set-floor]")
//     .forEach((button) => (button.ariaCurrent = false));

//   document.querySelector(
//     `[data-set-floor='${floor.value}']`
//   ).ariaCurrent = true;
// }

function setCaption(floor) {
  document.getElementById("caption-floor").textContent = floor.value + " этаж";
  document.getElementById("caption-floor-height").textContent = floor.height;
}

// function renderFloors(tower) {
//   floorsContainer.replaceChildren();

//   floorsData[tower]
//     .sort((a, b) => b.value - a.value)
//     .forEach((floor) => {
//       const button = document.createElement("button");
//       button.type = "button";
//       button.dataset.setFloor = floor.value;
//       button.dataset.panoramaControl = "";
//       button.textContent = floor.value + " этаж";

//       floorsContainer.append(button);
//     });
// }

// renderFloors(currentTower);
setCurrentTower(currentTower);
// setCurrentFloor(currentFloor);
setCaption(currentFloor);

function setTowerHandler(tower) {
  const floor = floorsData[tower][1];

  setLoadingState(true);

  viewer
    .setPanorama({
      width: 8192,
      cols: 16,
      rows: 8,
      baseUrl: `./assets/low/${tower}/${floor.value}.jpg`,
      tileUrl: (col, row) => {
        return `./assets/tiles/${tower}/${floor.value}_${col}_${row}.jpg`;
      },
    })
    .then(() => {
      renderFloors(tower);
      setCurrentFloor(floor);
      setCaption(floor);
    })
    .finally(() => {
      setLoadingState(false);
    });

  setCurrentTower(tower);
}

// function setFloorHandler(floor) {
//   setLoadingState(true);
//   viewer
//     .setPanorama({
//       width: 8192,
//       cols: 16,
//       rows: 8,
//       baseUrl: `./assets/low/${currentTower}/${floor.value}.jpg`,
//       tileUrl: (col, row) => {
//         return `./assets/tiles/${currentTower}/${floor.value}_${col}_${row}.jpg`;
//       },
//     })
//     .finally(() => {
//       setLoadingState(false);
//     });

//   setCurrentFloor(floor);
//   setCaption(floor);
// }

document.addEventListener("click", (event) => {
  const setTowerButton = event.target.closest("[data-set-tower]");
  const setFloorButton = event.target.closest("[data-set-floor]");
  const fullscreenButton = event.target.closest("#fullscreen");
  const zoomInButton = event.target.closest("#zoom-in");
  const zoomOutButton = event.target.closest("#zoom-out");

  if (setTowerButton) setTowerHandler(setTowerButton.dataset.setTower);
  // if (setFloorButton) setFloorHandler(setFloorButton.dataset.setFloor);
  if (fullscreenButton) viewer.toggleFullscreen();
  if (zoomInButton) viewer.zoomIn(50);
  if (zoomOutButton) viewer.zoomOut(50);
});
