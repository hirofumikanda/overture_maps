import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  hash: true,
  style: "styles/style.json",
  center: [139.767, 35.681],
  zoom: 10,
});

map.addControl(new maplibregl.NavigationControl(), "top-right");
