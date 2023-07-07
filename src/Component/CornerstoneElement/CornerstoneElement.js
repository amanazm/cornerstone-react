import React, { useEffect, useRef, useState } from "react";
import "./CornerstoneElement.css";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

const CornerstoneElement = ({ stack }) => {
  const elementRef = useRef(null);
  const [viewport, setViewport] = useState(null);
  const [imageId, setImageId] = useState(null);

  useEffect(() => {
    const element = elementRef.current;

    const onWindowResize = () => {
      console.log("onWindowResize");
      cornerstone.resize(element);
    };

    const onImageRendered = () => {
      const viewport = cornerstone.getViewport(element);
      console.log(viewport);
      setViewport(viewport);
      console.log(viewport);
    };

    const onNewImage = () => {
      const enabledElement = cornerstone.getEnabledElement(element);
      setImageId(enabledElement.image.imageId);
    };

    cornerstone.enable(element);

    cornerstone.loadImage(stack.imageIds[0]).then((image) => {
      cornerstone.displayImage(element, image);

      const stackData = cornerstoneTools.addStackStateManager(element, [
        "stack",
      ]);
      if (stackData && stackData.data && stackData.data.length > 0) {
        const stackState = stackData.data[0];
        stackState.currentImageIdIndex = stack.currentImageIdIndex;
        stackState.imageIds = stack.imageIds;
        cornerstoneTools.addToolState(element, "stack", stackState);
      }

      cornerstoneTools.mouseInput?.enable(element);
      cornerstoneTools.mouseWheelInput?.enable(element);
      cornerstoneTools.wwwc?.activate(element, 1);
      cornerstoneTools.pan?.activate(element, 2);
      cornerstoneTools.zoom?.activate(element, 4);
      cornerstoneTools.zoomWheel?.activate(element);
      cornerstoneTools.touchInput?.enable(element);
      cornerstoneTools.panTouchDrag?.activate(element);
      cornerstoneTools.zoomTouchPinch?.activate(element);

      element.addEventListener("cornerstoneimagerendered", onImageRendered);
      element.addEventListener("cornerstonenewimage", onNewImage);
      window.addEventListener("resize", onWindowResize);
    });

    return () => {
      element.removeEventListener("cornerstoneimagerendered", onImageRendered);
      element.removeEventListener("cornerstonenewimage", onNewImage);
      window.removeEventListener("resize", onWindowResize);
      cornerstone.disable(element);
    };
  }, [stack]);

  return (
    <div>
      <div className="viewportElement" ref={elementRef}>
        <canvas className="cornerstone-canvas" />
        <div className="bottomLeft">Zoom: {viewport && viewport.scale}</div>
        <div className="bottomRight">
          WW/WC: {viewport && viewport.voi.windowWidth} /{" "}
          {viewport && viewport.voi.windowCenter}
        </div>
      </div>
    </div>
  );
};

export default CornerstoneElement;
