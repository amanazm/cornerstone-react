import React from "react";
import "./App.css";
import CornerstoneElement from "./Component/CornerstoneElement/CornerstoneElement";
// import Viewer from "./Component/CornerViewer/Viewer";
// import CornerstoneViewer from "./Component/CornerViewer/CornerStoneViewerVolume";

const App = () => {
  const imageId =
    "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";

  const stack = {
    imageIds: [imageId],
    currentImageIdIndex: 0,
  };
  return (
    <div className="App">
      <header className="App-header">
        <h2>Cornerstone React Component Example</h2>
        <CornerstoneElement stack={{ ...stack }} />
        {/* <CornerstoneViewer /> */}
      </header>
    </div>
  );
};

export default App;
