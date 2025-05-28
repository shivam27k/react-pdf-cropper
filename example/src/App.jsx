import React, { useCallback, useRef, useState } from "react";
// PDF Viewer library
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// PDF cropper package (custom!)
import PDFCropperOverlay, { handleDownload, CancelCropButton, CropPreviewButton } from "react-pdf-cropper";

function App() {
  // Ref to the container wrapping the PDF viewer pages (needed for cropper)
  const containerRef = useRef();

  // Holds the current PDF file (can be file or URL)
  const [pdfFile, setPdfFile] = useState("/sample.pdf");

  // Stores the cropped image (as data URL)
  const [croppedImage, setCroppedImage] = useState(null);

  // Keeps track of the currently viewed PDF page (1-based, for overlay)
  const [page, setPage] = useState(1);

  // Controls whether cropping overlay is shown/active
  const [isCropping, setIsCropping] = useState(false);

  // Handlers provided by the cropper overlay to control cropping externally
  const [handlers, setHandlers] = useState({});

  // This callback is given to the cropper overlay, so it can "register" its internal handlers.
  // Called when cropping mode starts. You can now use these for external crop/cancel buttons.
  const getHandlers = useCallback((handlers) => {
    setHandlers(handlers);
  }, []);

  // When user clicks "Crop & Preview" button, call cropper's handler if ready
  const handleCropSave = useCallback(() => {
    if (handlers?.handleSaveClick) {
      handlers.handleSaveClick();
    }
  }, [handlers]);

  // When user clicks "Cancel" button, call cropper's cancel handler if ready
  const handleCropCancel = useCallback(() => {
    if (handlers?.stopCropping) {
      handlers.stopCropping();
    }
  }, [handlers]);

  return (
    <div style={{ maxWidth: '100%', margin: "0 auto", padding: 24 }}>
      <h2>React PDF Viewer + Cropper Example</h2>

      {/* ---- PDF File Picker ---- */}
      <input
        type="file"
        accept="application/pdf"
        onChange={e => {
          if (e.target.files[0]) {
            // Create a local URL for the uploaded PDF file
            setPdfFile(URL.createObjectURL(e.target.files[0]));
          }
        }}
        style={{ marginBottom: 16 }}
      />

      {/* ---- Cropper Controls ---- */}
      <div style={{ display: "flex", gap: 10, marginTop: 10, marginBottom: 30 }}>
        {/* Start cropping button (disabled if already in cropping mode) */}
        <button
          style={{
            height: '100%',
            background: "#4A90E2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: 600,
            cursor: isCropping ? "not-allowed" : "pointer",
          }}
          disabled={isCropping}
          onClick={() => setIsCropping(true)}
        >
          Start Cropping
        </button>

        {/* External Cropper Action Buttons - Only show when cropping is active */}
        {isCropping && (
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Cancel Crop - custom usable button, uses external handler */}
            <CancelCropButton onClick={handleCropCancel} />
            {/* Crop & Preview - custom usable button, uses external handler */}
            <CropPreviewButton onClick={handleCropSave} />
          </div>
        )}
      </div>

      {/* ---- PDF Viewer and Cropping Overlay ---- */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            border: "1px solid #ccc",
            width: 1000,
            height: 900,
            margin: "0 auto",
            background: "#fafbfc"
          }}
        >
          {/* PDF Worker & Viewer */}
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[defaultLayoutPlugin()]}
              defaultScale={1}
              // PDF Viewer pages are zero-indexed; we use +1 for user-facing/currentPage
              onPageChange={e => setPage(e.currentPage + 1)}
            />
          </Worker>

          {/* --- PDF Cropper Overlay --- */}
          {/* Only active when isCropping === true.
              Pass a getHandlers callback so the overlay gives you its crop/cancel handlers,
              allowing full control from your UI. */}
          <PDFCropperOverlay
            containerRef={containerRef}
            isCropping={isCropping}
            setIsCropping={setIsCropping}
            // watermarkImage="/abc.jpg" // (optional) Add watermarks to screenshots
            currentPage={page}
            onCrop={setCroppedImage} // Called when cropping completes
            showDefaultButtons={false} // Hide built-in box buttons (use your own!)
            getHandlers={getHandlers}  // Exposes handlers for use outside the cropbox
          />
        </div>

        {/* ---- Cropped Image Preview & Download ---- */}
        {croppedImage && (
          <div style={{ maxWidth: 400 }}>
            <h4>Cropped image preview:</h4>
            <img
              src={croppedImage}
              alt="Cropped"
              style={{ maxWidth: 400, border: "1px solid #ddd" }}
            />
            {/* Universal download handler from the package */}
            <button onClick={() => handleDownload(croppedImage)}>
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
