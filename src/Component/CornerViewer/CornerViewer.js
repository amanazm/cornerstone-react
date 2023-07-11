import React, { useEffect, useRef } from "react";
import { StackViewport, RenderingEngine } from "@cornerstonejs/core";
import { ViewportType } from "@cornerstonejs/core/dist/esm/enums";
import { createImageIdsAndCacheMetaData } from "../../utils/demo/helpers";

const CornerstoneViewer = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const contentElement = contentRef.current;

    const initializeViewer = async () => {
      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      const element = document.createElement("div");
      element.style.width = "500px";
      element.style.height = "500px";

      contentElement.appendChild(element);

      const renderingEngineId = "myRenderingEngine";
      const viewportId = "CT_AXIAL_STACK";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const viewportInput = {
        viewportId,
        element,
        type: ViewportType.STACK,
      };

      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(viewportInput.viewportId);

      viewport.setStack(imageIds, 60);

      viewport.render();
    };

    initializeViewer();
  }, []);

  return <div ref={contentRef}></div>;
};

export default CornerstoneViewer;
