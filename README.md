# react-pdf-cropper

> A blazing fast, customizable PDF cropper for React.
> Drag, resize, crop, watermark, preview, and download any region of any PDF—right from your web app.

## ✨ Features

-   🖼 **Drag, resize, and move** the selection box with mouse or touch—just like an image editor.

-   💡 **Works with any PDF renderer**: drop into [react-pdf-viewer](https://react-pdf-viewer.dev/), your own PDF.js setup, or any HTML canvas-based viewer.

-   ⚡ **Zero dependency screenshot**: Crops directly from PDF.js canvas, no html2canvas needed, no lag.

-   🪄 **Add your logo or watermark** to any cropped image.

-   💾 **Instant download utility**: Save your crop with one click.

-   🧩 **Fully UI-agnostic**: Hide built-in buttons, add your own controls anywhere.

-   🤲 **Hooks & external control**: All actions (crop, cancel, download) available outside the cropbox.

-   🚀 **Production-ready**: Used in real-world news, content, and SaaS workflows.

## 📦 Installation

```
npm install react-pdf-cropper
# or
yarn add react-pdf-cropper
```

## 🚀 Quick Example

With [react-pdf-viewer](https://react-pdf-viewer.dev/)

```
import React, { useRef, useState, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PDFCropperOverlay, { handleDownload, CropPreviewButton, CancelCropButton } from "react-pdf-cropper";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function App() {
  const containerRef = useRef();
  const [pdfFile, setPdfFile] = useState("/sample.pdf");
  const [croppedImage, setCroppedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [handlers, setHandlers] = useState({});

  // Cropper overlay gives you crop/cancel handlers for your own buttons
  const getHandlers = useCallback((handlers) => setHandlers(handlers), []);

  return (
    <div>
      <button onClick={() => setIsCropping(true)} disabled={isCropping}>
        Start Cropping
      </button>
      {isCropping && (
        <>
          <CancelCropButton onClick={handlers.stopCropping} />
          <CropPreviewButton onClick={handlers.handleSaveClick} />
        </>
      )}
      <div ref={containerRef} style={{ position: "relative", width: 800, height: 900 }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfFile}
            plugins={[defaultLayoutPlugin()]}
            onPageChange={e => setPage(e.currentPage + 1)}
          />
        </Worker>
        <PDFCropperOverlay
          containerRef={containerRef}
          isCropping={isCropping}
          setIsCropping={setIsCropping}
          currentPage={page}
          onCrop={setCroppedImage}
          getHandlers={getHandlers}
          showDefaultButtons={false}  // Use your own buttons!
        />
      </div>
      {croppedImage && (
        <>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: 400, border: "1px solid #ddd" }} />
          <button onClick={() => handleDownload(croppedImage)}>
            Download Cropped Image
          </button>
        </>
      )}
    </div>
  );
}

export default App;
```

## 🧩 API Reference

### `<PDFCropperOverlay />`

| Props            | Type     | Required | Description                                                                            |
| ---------------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `containerRef`   | `ref`    | ✔        | Ref to the DOM element containing your PDF page canvas                                 |
| `isCropping`     | `bool`   | ✔        | Should the cropping overlay be active? (controlled from your app)                      |
| `setIsCropping`  | `func`   | ✔        | Function to close/hide cropping overlay (used by cancel, after crop, etc.)             |
| `currentPage`    | `number` | ✔        | The current page number (1-based, not zero-indexed)                                    |
| `onCrop`         | `func`   |          | Callback called with the cropped image `dataURL ((dataUrl) => {})`                     |
| `getHandlers`    | `func`   |          | Callback giving you crop/cancel handlers (`({ handleSaveClick, stopCropping }) => {}`) |
| `watermarkImage` | `string` |          | (Optional) URL/data URL for watermark logo/image                                       |
| `watermarkProps` | `object` |          | (Optional) `{ opacity, tileWidth, tileHeight }` for watermark tiling                   |
| `watermarkImage` | `bool`   |          | Show built-in crop/cancel buttons in cropbox? (default: `true`)                        |

---

### Exported Buttons

-   `<CropPreviewButton onClick={...} />` — Use in your own UI to trigger crop/preview.

-   `<CancelCropButton onClick={...} />` — Use in your own UI to cancel cropping.

### Utility

-   `handleDownload(imageDataUrl, filename = "cropped-image.png")` — Instantly download the cropped image.

## 🎨 Customization

-   **External UI**:

    Pass `showDefaultButtons={false}` to hide the cropbox’s own buttons and use the exported buttons in your layout.

-   Watermark:

    Add `watermarkImage="/logo.png"` and tweak `watermarkProps` as needed.

-   Styling:

    Tweak cropbox and buttons in your own CSS or fork to change cropbox design.

## 📁 Example Project

A full-featured example React app is included in the [example/](https://github.com/shivam27k/react-pdf-cropper) folder of this repo.


-   Open it, run `npm install`, then `npm run dev`.

-   Try cropping, previewing, downloading, and watermarking on any PDF (don't forget to install the package first).

There is an example video in the `public` folder for your reference as well.

## 💡 FAQ

Q: Does this support touch/mobile?

A: Yes! All drag, resize, and crop actions are available via mouse and touch.

Q: Do I need to use `react-pdf-viewer`?

A: No! Any PDF viewer that renders to a canvas (from PDF.js) will work, as long as you pass a ref to the container with the canvas.

Q: Is html2canvas used?

A: No. Cropping works directly on the PDF.js-rendered canvas, so it’s much faster and sharper.

Q: Can I style the crop box?

A: Yes—either with your own CSS, or by modifying the CroppingBox component.

Q: Can I use my own crop/cancel buttons?

A: Yes! Just hide the built-in ones and use the exported `<CropPreviewButton />` and `<CancelCropButton />`, passing the handlers from `getHandlers`.

Q: How do I add a watermark?

A: Pass a watermark image and optionally watermarkProps (opacity, tiling, etc).

## 🛠️ Contributing

PRs and issues are very welcome!

1. Fork this repo

2. Add features or fixes in a branch

3. Add/adjust an example in example/ if needed

4. PRs should be clear and well-commented.

## 👤 Author

Made by Shivam Kumar >\_<

[GitHub](https://github.com/shivam27k) | [LikedIn](https://linkedin.com/shivam-27k)

## 📑 License

> MIT — Free for personal, commercial, and open-source use.

---

Questions?

Open an issue or ping me on GitHub.

Enjoy cropping PDFs with React! 🎉
