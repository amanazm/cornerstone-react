import React, { useEffect, useRef } from "react";
import {
  RenderingEngine,
  ViewportType,
  ToolGroupManager,
  addTool,
  setVolumesForViewports,
  Enums,
} from "@cornerstonejs/core";
import { createImageIdsAndCacheMetaData } from "./utils/demo/helpers";
import {
  SegmentationDisplayTool,
  BrushTool,
  SegmentationTool,
} from "./utils/demo/tools";

const CornerstoneSegmentation = () => {
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

      // Create the viewport grid
      const viewportGrid = document.createElement("div");
      viewportGrid.style.display = "flex";
      viewportGrid.style.flexDirection = "row";

      // Create elements for each viewport
      const element1 = document.createElement("div");
      element1.style.width = "500px";
      element1.style.height = "500px";

      const element2 = document.createElement("div");
      element2.style.width = "500px";
      element2.style.height = "500px";

      const element3 = document.createElement("div");
      element3.style.width = "500px";
      element3.style.height = "500px";

      // Append elements to the viewport grid
      viewportGrid.appendChild(element1);
      viewportGrid.appendChild(element2);
      viewportGrid.appendChild(element3);

      // Append the viewport grid to the content container
      content.appendChild(viewportGrid);

      // Add the SegmentationDisplayTool and BrushTool
      addTool(SegmentationDisplayTool);
      addTool(BrushTool);
      addTool(SegmentationTool);

      const volumeName = "CT_VOLUME_ID";
      const toolGroupId = "CT_TOOLGROUP";
      const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
      const volumeId = `${volumeLoaderScheme}:${volumeName}`;
      const segmentationId = "MY_SEGMENTATION_ID";

      // Create the tool group
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

      // Add the tools to the tool group
      toolGroup.addTool(SegmentationDisplayTool.toolName);
      toolGroup.addTool(BrushTool.toolName);
      toolGroup.addTool(SegmentationTool.toolName);
      toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

      // Set the active tool to BrushTool
      toolGroup.setToolActive(BrushTool.toolName, {
        bindings: [{ mouseButton: "left" }],
      });

      // Create a volume in memory for CT
      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      });

      // Create a segmentation of the same resolution as the CT volume
      await volumeLoader.createAndCacheDerivedVolume(volumeId, {
        volumeId: segmentationId,
      });

      // Add the segmentations to the state
      segmentation.addSegmentations([
        {
          segmentationId,
          representation: {
            type: csToolsEnums.SegmentationRepresentations.Labelmap,
            data: {
              volumeId: segmentationId,
            },
          },
        },
      ]);

      // Create the rendering engine
      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      // Create the viewports
      const viewportId1 = "CT_AXIAL";
      const viewportId2 = "CT_SAGITTAL";
      const viewportId3 = "CT_CORONAL";

      const viewportInputArray = [
        {
          viewportId: viewportId1,
          type: ViewportType.ORTHOGRAPHIC,
          element: element1,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: viewportId2,
          type: ViewportType.ORTHOGRAPHIC,
          element: element2,
          defaultOptions: {
            orientation: Enums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: viewportId3,
          type: ViewportType.ORTHOGRAPHIC,
          element: element3,
          defaultOptions: {
            orientation: Enums.OrientationAxis.CORONAL,
          },
        },
      ];

      // Set the viewports on the rendering engine
      renderingEngine.setViewports(viewportInputArray);

      // Add the viewports to the tool group
      toolGroup.addViewport(viewportId1, renderingEngineId);
      toolGroup.addViewport(viewportId2, renderingEngineId);
      toolGroup.addViewport(viewportId3, renderingEngineId);

      // Load the volume
      volume.load();

      // Set the volumes for the viewports
      await setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        [viewportId1, viewportId2, viewportId3]
      );

      // Add the segmentation representation to the tool group
      await segmentation.addSegmentationRepresentations(toolGroupId, [
        {
          segmentationId,
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
        },
      ]);

      // Render the image
      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
    };

    manipulateCornerstone();
  }, []);

  return <div ref={contentRef} id="content"></div>;
};

export default CornerstoneSegmentation;
