import React, { useEffect, useRef } from "react";
import { addTool } from "@cornerstonejs/toolkit";
import { ViewportType } from "@cornerstonejs/core/dist/esm/enums";
import * as cornerstoneTools from "cornerstone-tools";
import { RenderingEngine, ToolGroupManager } from "@cornerstonejs/core";
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

      const element = document.createElement("div");

      // Disable the default context menu
      element.oncontextmenu = (e) => e.preventDefault();
      element.style.width = "500px";
      element.style.height = "500px";

      content.appendChild(element);

      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const viewportId = "CT_AXIAL_STACK";

      const viewportInput = {
        viewportId,
        element,
        type: ViewportType.STACK,
      };

      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(viewportId);

      viewport.setStack(imageIds);

      viewport.render();

      addTool(ZoomTool);
      addTool(WindowLevelTool);

      const toolGroupId = "myToolGroup";
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

      // Add tools to the ToolGroup
      toolGroup.addTool(ZoomTool.toolName);
      toolGroup.addTool(WindowLevelTool.toolName);

      toolGroup.addViewport(viewportId, renderingEngineId);

      // Set the windowLevel tool to be active when the mouse left button is pressed
      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: "left",
          },
        ],
      });

      // Set the zoom tool to be active when the mouse right button is pressed
      toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [
          {
            mouseButton: "right",
          },
        ],
      });
    };

    manipulateCornerstone();
  }, []);

  return <div ref={contentRef} id="content"></div>;
};

export default CornerstoneManipulator;
