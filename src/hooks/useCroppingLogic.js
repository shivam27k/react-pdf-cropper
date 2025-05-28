import { useCallback } from 'react';

const useCroppingLogic = ({
    containerRef,
    currentPage, // required for correct canvas selection!
    selectionRect,
    setCroppedImage,
    setShowModal,
    watermarkImage,
    watermarkProps,
    onCrop,
}) => {
    const captureSelectedArea = useCallback(() => {
        if (!containerRef.current || !selectionRect) return;

        // 1. Find the right page div using aria-label
        const selector = `[aria-label="PDF-Page-${currentPage}"], [aria-label="Page ${currentPage}"]`;
        const currentPageDiv = containerRef.current.querySelector(selector);

        console.log('Current Page:', currentPage);
        console.log('Selection Rect:', selectionRect);
        console.log('Current Page Div:', currentPageDiv);

        // 2. Find canvas within that div
        const canvas = currentPageDiv ? currentPageDiv.querySelector('canvas') : null;
        console.log('Canvas for Crop:', canvas);

        if (!canvas) {
            console.log('Could not find PDF canvas for cropping!');
            return;
        }

        // 3. Get rects and offsets
        const containerRect = containerRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const offsetX = canvasRect.left - containerRect.left;
        const offsetY = canvasRect.top - containerRect.top;

        // 4. Map selection from container to canvas coordinates
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const sx = (selectionRect.left - offsetX) * scaleX;
        const sy = (selectionRect.top - offsetY) * scaleY;
        const sw = selectionRect.width * scaleX;
        const sh = selectionRect.height * scaleY;

        console.log({ sx, sy, sw, sh, canvasW: canvas.width, canvasH: canvas.height });

        // 5. Check bounds
        if (sw <= 0 || sh <= 0) {
            console.log("Invalid crop area! Try making a bigger selection.");
            return;
        }
        if (sx < 0 || sy < 0 || sx + sw > canvas.width || sy + sh > canvas.height) {
            console.log("Selection outside of canvas. Try cropping inside the page.");
            return;
        }

        // 6. Prepare the output canvas
        const whiteStripHeight = watermarkImage ? (sw * 0.25) + 10 : 0;
        const scaleFactor = 2;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = sw * scaleFactor;
        croppedCanvas.height = (sh + whiteStripHeight) * scaleFactor;
        const ctx = croppedCanvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scaleFactor, scaleFactor);

        // White strip at the top
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, sw, whiteStripHeight);

        // Cropped image below white strip
        ctx.drawImage(
            canvas,
            sx, sy, sw, sh,
            0, whiteStripHeight, sw, sh
        );

        // 7. Add watermark if needed
        const finalizeAndShow = () => {
            const dataURL = croppedCanvas.toDataURL('image/png', 1);
            console.log('dataURL:', dataURL);
            if (dataURL && dataURL !== "data:,") {
                setCroppedImage(dataURL);
                setShowModal(true);
                if (onCrop) onCrop(dataURL);
            } else {
                console.log("Cropping failed. Try a different area.");
            }
        };

        if (watermarkImage) {
            const img = new window.Image();
            img.src = watermarkImage;
            img.onload = () => {
                const opacity = watermarkProps?.opacity ?? 0.15;
                const tileWidth = watermarkProps?.tileWidth ?? (sw * 0.25);
                const tileHeight = watermarkProps?.tileHeight ?? (img.height / img.width) * tileWidth;

                ctx.globalAlpha = 1.0;
                // Centered logo on white strip
                ctx.drawImage(
                    img,
                    (sw - tileWidth) / 2,
                    (whiteStripHeight - tileHeight) / 2,
                    tileWidth,
                    tileHeight
                );
                // Tiled watermark on cropped content
                ctx.globalAlpha = opacity;
                for (let x = 0; x < sw; x += tileWidth + 20) {
                    for (let y = whiteStripHeight; y < sh + whiteStripHeight; y += tileHeight + 20) {
                        ctx.drawImage(img, x, y, tileWidth, tileHeight);
                    }
                }
                ctx.globalAlpha = 1.0;

                finalizeAndShow(true);
            };
            img.onerror = () => {
                console.log("Could not load watermark image.");
                finalizeAndShow(false);
            };
        } else {
            finalizeAndShow(false);
        }
    }, [
        selectionRect,
        containerRef,
        currentPage,
        watermarkImage,
        watermarkProps,
        setCroppedImage,
        setShowModal,
        onCrop,
    ]);

    const handleSaveClick = useCallback(() => {
        captureSelectedArea();
    }, [captureSelectedArea]);

    return {
        handleSaveClick,
    };
};

export default useCroppingLogic;
