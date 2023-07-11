import initProviders from "./initProviders";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import initCornerstoneWADOImageLoader from "./initCornerstoneWADOImageLoader";
import initVolumeLoader from "./initVolumeLoader";
import {
  init as csRenderInit,
  imageLoadPoolManager,
} from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";

imageLoadPoolManager.maxNumRequests = {
  interaction: 100,
  thumbnail: 75,
  prefetch: 10,
};

let appConfig = {};
// TODO: Cypress tests are currently grabbing this from the window?
window.cornerstone = cornerstone;
window.cornerstoneTools = cornerstoneTools;

// For debugging e2e tests that are failing on CI
cornerstone.setUseCPURendering(Boolean(appConfig.useCPURendering));
cornerstone.setConfiguration({
  ...cornerstone.getConfiguration(),
  rendering: {
    ...cornerstone.getConfiguration().rendering,
    strictZSpacingForVolumeViewport: appConfig.strictZSpacingForVolumeViewport,
  },
});

const MAX_CACHE_SIZE_1GB = 1073741824;
const maxCacheSize = appConfig.maxCacheSize;
cornerstone.cache.setMaxCacheSize(
  maxCacheSize ? maxCacheSize : MAX_CACHE_SIZE_1GB
);

export default async function initDemo() {
  initProviders();
  initCornerstoneWADOImageLoader();
  initVolumeLoader();
  await csRenderInit();
  await csToolsInit();
}
