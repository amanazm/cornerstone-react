import React, { useEffect, useRef } from "react";
import { ViewportType } from "@cornerstonejs/core/dist/esm/enums";
import * as cornerstoneTools from "cornerstone-tools";
import { RenderingEngine, Enums } from "@cornerstonejs/core";
import { createImageIdsAndCacheMetaData } from "../../utils/demo/helpers";

const CornerstoneViewer = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const initializeViewer = async () => {
      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      const contentElement = contentRef.current;

      const viewportGrid = document.createElement("div");
      viewportGrid.style.display = "flex";
      viewportGrid.style.flexDirection = "row";

      // Element for axial view
      const element1 = document.createElement("div");
      element1.style.width = "500px";
      element1.style.height = "500px";

      // Element for sagittal view
      const element2 = document.createElement("div");
      element2.style.width = "500px";
      element2.style.height = "500px";

      viewportGrid.appendChild(element1);
      viewportGrid.appendChild(element2);

      contentElement.appendChild(viewportGrid);

      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const volumeId = "cornerstoneStreamingImageVolume:myVolume";

      // Define a volume in memory
      const volume = await cornerstoneTools.volumeLoader.createAndCacheVolume(
        volumeId,
        {
          imageIds,
        }
      );

      const viewportId1 = "CT_AXIAL";
      const viewportId2 = "CT_SAGITTAL";

      const viewportInput = [
        {
          viewportId: viewportId1,
          element: element1,
          type: ViewportType.ORTHOGRAPHIC,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: viewportId2,
          element: element2,
          type: ViewportType.ORTHOGRAPHIC,
          defaultOptions: {
            orientation: Enums.OrientationAxis.SAGITTAL,
          },
        },
      ];

      renderingEngine.setViewports(viewportInput);

      // Set the volume to load
      volume.load();

      cornerstoneTools.setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        [viewportId1, viewportId2]
      );

      // Render the image
      renderingEngine.renderViewports([viewportId1, viewportId2]);
    };

    initializeViewer();
  }, []);

  return <div ref={contentRef}></div>;
};

export default CornerstoneViewer;
