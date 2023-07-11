import React, { useEffect, useRef } from "react";
import {
  RenderingEngine,
  ViewportType,
  ToolGroupManager,
  addTool,
  setVolumesForViewports,
  Enums,
} from "@cornerstonejs/core";
import { createImageIdsAndCacheMetaData } from "../../utils/demo/helpers";

const CornerstoneManipulator = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const manipulateCornerstone = async () => {
      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      const content = contentRef.current;

      // element for axial view
      const element1 = document.createElement("div");
      element1.style.width = "500px";
      element1.style.height = "500px";

      // element for sagittal view
      const element2 = document.createElement("div");
      element2.style.width = "500px";
      element2.style.height = "500px";

      content.appendChild(element1);
      content.appendChild(element2);

      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const volumeId = "cornerstoneStreamingImageVolume: myVolume";

      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      });

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

      addTool(BidirectionalTool);

      const toolGroupId = "myToolGroup";
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      toolGroup.addTool(BidirectionalTool.toolName);

      toolGroup.addViewport(viewportId1, renderingEngineId);
      toolGroup.addViewport(viewportId2, renderingEngineId);
      toolGroup.setToolActive(BidirectionalTool.toolName, {
        bindings: [
          {
            mouseButton: "left",
          },
        ],
      });

      volume.load();

      setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId,
            callback: ({ volumeActor }) => {
              volumeActor
                .getProperty()
                .getRGBTransferFunction(0)
                .setMappingRange(-180, 220);
            },
          },
        ],
        [viewportId1, viewportId2]
      );

      renderingEngine.renderViewports([viewportId1, viewportId2]);
    };

    manipulateCornerstone();
  }, []);

  return <div ref={contentRef} id="content"></div>;
};

export default CornerstoneManipulator;
