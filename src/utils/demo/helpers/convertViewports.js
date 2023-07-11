import {
  Types,
  Enums,
  volumeLoader,
  setVolumesForViewports,
  utilities,
  cache,
  getRenderingEngine,
} from "@cornerstonejs/core";
const { ViewportType } = Enums;
const VOLUME_LOADER_SCHEME = "wadors";
let renderingEngineId = "ManentiaRenderingEngine";

export function _convertVolumeToStackViewport({ toolGroup }) {
  const renderingEngine = getRenderingEngine(renderingEngineId);

  const viewport = renderingEngine?.getViewport("CT_STACK_0");

  const element = document.getElementById("CT_STACK_0");
  const viewportIdStack = "CT_STACK_0";
  let id = viewportIdStack;

  // Create a stack viewport
  const viewportInput = {
    viewportId: viewportIdStack,
    type: ViewportType.STACK,
    element,
    defaultOptions: {
      background: [0, 0, 0],
    },
  };

  renderingEngine.enableElement(viewportInput);

  // Set the tool group on the viewport
  toolGroup.addViewport(id, renderingEngine.id);

  // Get the stack viewport that was created
  const stackViewport = renderingEngine.getViewport(id);

  const actorEntry = viewport.getDefaultActor();
  const { uid: volumeId } = actorEntry;
  const volume = cache.getVolume(volumeId);

  const imageIds = volume.imageIds;

  // if this is the first time decaching do it
  if (!cache.getImageLoadObject(imageIds[0])) {
    volume.decache();
  }

  const stack = volume.imageIds;

  // Set the stack on the viewport
  const currentIndex = Math.floor(stack.length / 2);
  stackViewport.setStack(stack, currentIndex);

  // Render the image
  viewport.render();
}

export async function _convertStackToVolumeViewport({ toolGroup }) {
  const renderingEngine = getRenderingEngine(renderingEngineId);

  const viewport = renderingEngine?.getViewport("CT_STACK_0");

  // Define a unique id for the volume
  const volumeName = "CT_VOLUME_ID"; // Id of the volume less loader prefix
  const volumeLoaderScheme = "cornerstoneStreamingImageVolume"; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id

  const element = document.getElementById("CT_STACK_0");
  const viewportIdStack = "CT_STACK_0";

  let imageIds = viewport.getImageIds();
  imageIds = imageIds.map((imageId) => {
    const imageURI = utilities.imageIdToURI(imageId);
    return `${VOLUME_LOADER_SCHEME}:${imageURI}`;
  });

  const viewportInputArray = [
    {
      viewportId: viewportIdStack,
      type: ViewportType.ORTHOGRAPHIC,
      element,
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
        background: [0.2, 0.4, 0.2],
      },
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // we need to add back the viewport to the toolGroup since volume viewport
  // is replacing the stack viewport, and on stackViewport destroy, the toolGroup
  // will remove the viewport from the toolGroup
  toolGroup.addViewport(viewportIdStack, renderingEngine.id);

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Set the volume to load
  volume.load();

  setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportIdStack]);

  // Render the image
  renderingEngine.renderViewports([viewportIdStack]);
}
