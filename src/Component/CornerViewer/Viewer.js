import React from "react";
import CornerstoneViewport from "react-cornerstone-viewport";

const Viewer = () => {
  const tools = [
    // Mouse
    { name: "Wwwc", mode: "active", modeOptions: { mouseButtonMask: 1 } },
    { name: "Zoom", mode: "active", modeOptions: { mouseButtonMask: 2 } },
    { name: "Pan", mode: "active", modeOptions: { mouseButtonMask: 4 } },
    // Scroll
    { name: "StackScrollMouseWheel", mode: "active" },
    // Touch
    { name: "PanMultiTouch", mode: "active" },
    { name: "ZoomTouchPinch", mode: "active" },
    { name: "StackScrollMultiTouch", mode: "active" },
  ];

  const imageIds = [
    "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ];

  return (
    <div>
      <h2>Basic Demo</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <CornerstoneViewport
          tools={tools}
          imageIds={imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>
    </div>
  );
};

export default Viewer;
