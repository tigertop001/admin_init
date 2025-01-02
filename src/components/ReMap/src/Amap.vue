<script setup lang="ts">
import { reactive, getCurrentInstance, onBeforeMount, onUnmounted } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import AMapLoader from "@amap/amap-jsapi-loader";
import { mapJson } from "../api";
import car from "@/assets/car.png";

export interface MapConfigureInter {
  on: Fn;
  destroy?: Fn;
  clearEvents?: Fn;
  addControl?: Fn;
  setCenter?: Fn;
  setZoom?: Fn;
  plugin?: Fn;
}

defineOptions({
  name: "Amap"
});

let MarkerCluster;
let map: MapConfigureInter;

const instance = getCurrentInstance();

const mapSet = reactive({
  loading: deviceDetection() ? false : true
});

// 地图创建完成(动画关闭)
const complete = (): void => {
  if (map) {
    map.on("complete", () => {
      mapSet.loading = false;
    });
  }
};

onBeforeMount(() => {
  if (!instance) return;
  const { MapConfigure } = instance.appContext.config.globalProperties.$config;
  const { options } = MapConfigure;

  AMapLoader.load({
    key: MapConfigure.amapKey,
    version: "2.0",
    plugins: ["AMap.MarkerCluster"]
  })
    .then(AMap => {
      map = new AMap.Map(instance.refs.mapview, options);

      map.plugin(["AMap.ToolBar", "AMap.MapType"], () => {
        map.addControl(new AMap.ToolBar());
        map.addControl(
          new AMap.MapType({
            defaultType: 0
          })
        );
      });

      MarkerCluster = new AMap.MarkerCluster(map, [], {
        gridSize: 80,
        maxZoom: 14,
        renderMarker(ctx) {
          const { marker, data } = ctx;
          if (Array.isArray(data) && data[0]) {
            const { driver, plateNumber, orientation } = data[0];
            const content = `<img style="transform: scale(1) rotate(${
              360 - Number(orientation)
            }deg);" src='${car}' />`;
            marker.setContent(content);
            marker.setLabel({
              direction: "bottom",
              offset: new AMap.Pixel(-4, 0),
              content: `<div> ${plateNumber}(${driver})</div>`
            });
            marker.setOffset(new AMap.Pixel(-18, -10));
            marker.on("click", ({ lnglat }) => {
              map.setZoom(13);
              map.setCenter(lnglat);
            });
          }
        }
      });

      mapJson()
        .then(({ data }) => {
          const points: object = data.map(v => {
            return {
              lnglat: [v.lng, v.lat],
              ...v
            };
          });
          if (MarkerCluster) MarkerCluster.setData(points);
        })
        .catch(err => {
          console.log("err:", err);
        });

      complete();
    })
    .catch(() => {
      mapSet.loading = false;
      throw "地图加载失败，请重新加载";
    });
});

onUnmounted(() => {
  if (map) {
    map.destroy() && map.clearEvents("click");
  }
});
</script>

<template>
  <div id="mapview" ref="mapview" v-loading="mapSet.loading" />
</template>

<style lang="scss" scoped>
#mapview {
  height: calc(100vh - 86px);
}

:deep(.amap-marker-label) {
  border: none !important;
}
</style>
