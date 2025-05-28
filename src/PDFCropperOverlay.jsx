import React, { useEffect, useRef } from 'react';
import useCropping from './hooks/useCropping';
import CroppingBox from './components/CroppingBox';

const PDFCropperOverlay = ({
    containerRef,           // ref to <div> wrapping the user's PDF canvas
    isCropping,             // NEW: control cropping mode from parent
    setIsCropping,          // NEW: set cropping mode from overlay/buttons
    watermarkImage,
    watermarkProps,
    currentPage,
    onCrop,
    showDefaultButtons = true, // NEW: control UI visibility
    getHandlers,
    ...props
}) => {
    // const handlersSetRef = useRef(false);

    // All cropping state/logic is managed here
    const {
        isSelecting,
        croppedImage,
        showModal,
        handleStart,
        handleMove,
        handleEnd,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleSaveClick,
        handleDownload,
        handleCancel,
        getSelectionStyles,
        handleResizeEnd,
        handleResizeMove,
        handleResizeStart,
        selectionRect,
        setSelectionRect,
        resetSelection,
    } = useCropping({
        containerRef,
        isCropping,
        setIsCropping,
        currentPage,
        watermarkImage,
        watermarkProps,
        onCrop,
    });

    // Reset the ref when cropping mode changes
    // useEffect(() => {
    //     if (!isCropping) {
    //         handlersSetRef.current = false;
    //     }
    // }, [isCropping]);

    // Only set handlers once per cropping session
    useEffect(() => {
        if (isCropping && showDefaultButtons === false && typeof getHandlers === "function") {
            getHandlers({
                handleSaveClick,
                stopCropping: handleCancel,
            });
            // handlersSetRef.current = true;
        }
    }, [isCropping, showDefaultButtons, getHandlers, handleSaveClick, handleCancel]);

    // Only render overlay UI if cropping is active
    if (!isCropping) return null;

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 100,
                }}
            >
                <div
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                >
                    <CroppingBox
                        getSelectionStyles={getSelectionStyles}
                        handleDragEnd={handleDragEnd}
                        handleDragStart={handleDragStart}
                        handleDragMove={handleDragMove}
                        handleResizeEnd={handleResizeEnd}
                        handleResizeMove={handleResizeMove}
                        handleResizeStart={handleResizeStart}
                        isSelecting={isSelecting}
                        setSelectionRect={setSelectionRect}
                        selectionRect={selectionRect}
                        handleSaveClick={handleSaveClick}
                        showDefaultButtons={showDefaultButtons} // Always show buttons in overlay
                        stopCropping={handleCancel} // This disables cropping mode and resets everything
                    />
                </div>
            </div>
        </>
    );
};

export default PDFCropperOverlay;
