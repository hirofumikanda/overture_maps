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

map.on("load", async () => {
  map.addControl(new maplibregl.NavigationControl());
  const image_point = await map.loadImage("icons/point.png");
  map.addImage("point", image_point.data);
});

map.on("contextmenu", (e) => {
  // クリックした位置の地物を取得
  const features = map.queryRenderedFeatures(e.point);
  resetHightlightLayers();

  if (features.length > 0) {
    // コンソールにクリック地点の地物一覧表示
    console.log("フィーチャ数：" + features.length);
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      console.log("レイヤーID：" + feature.layer.id);
      console.log("フィーチャID：" + feature.id);
      console.log(JSON.stringify(feature.properties, null, 2));
    }
    const lineFeatures = features.filter((f) => "layer" in f && f.layer.type === "line");
    if (lineFeatures.length > 0) {
      map.getSource("highlight-source-line").setData({
        type: "FeatureCollection",
        features: lineFeatures,
      });
    }
    const fillFeatures = features.filter((f) => "layer" in f && f.layer.type === "fill" && f.layer.id !== "land");
    if (fillFeatures.length > 0) {
      map.getSource("highlight-source-line").setData({
        type: "FeatureCollection",
        features: fillFeatures,
      });
    }
  }
  function resetHightlightLayers() {
    if (map.getSource("highlight-source-line")) {
      map.removeLayer("highlight-layer-line");
      map.removeSource("highlight-source-line");
    }
    map.addSource("highlight-source-line", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    map.addLayer({
      id: "highlight-layer-line",
      type: "line",
      source: "highlight-source-line",
      paint: {
        "line-color": "rgb(255, 0, 0)",
        "line-width": 2,
        "line-opacity": 0.8,
      },
    });
    if (map.getSource("highlight-source-fill")) {
      map.removeLayer("highlight-layer-fill");
      map.removeSource("highlight-source-fill");
    }
    map.addSource("highlight-source-fill", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    map.addLayer({
      id: "highlight-layer-fill",
      type: "fill",
      source: "highlight-source-fill",
      paint: {
        "fill-outline-color": "rgb(255, 0, 0)",
      },
    });
  }
});