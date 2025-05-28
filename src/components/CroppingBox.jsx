import React from 'react';

const edges = [
    { dir: 'top-left', style: { top: -7, left: -7, cursor: 'nwse-resize' } },
    { dir: 'top-right', style: { top: -7, right: -7, cursor: 'nesw-resize' } },
    { dir: 'bottom-left', style: { bottom: -7, left: -7, cursor: 'nesw-resize' } },
    { dir: 'bottom-right', style: { bottom: -7, right: -7, cursor: 'nwse-resize' } },
    { dir: 'top', style: { top: -7, left: '50%', cursor: 'ns-resize' } },
    { dir: 'bottom', style: { bottom: -7, left: '50%', cursor: 'ns-resize' } },
    { dir: 'left', style: { left: -7, top: '50%', cursor: 'ew-resize' } },
    { dir: 'right', style: { right: -7, top: '50%', cursor: 'ew-resize' } },
];

// Standalone buttons for external use
export const CropPreviewButton = ({ onClick, style, children = "Crop & Preview", ...rest }) => (
    <button
        onClick={onClick}
        style={{
            fontWeight: 600,
            color: "#fff",
            background: "#4A90E2",
            border: "none",
            borderRadius: 3,
            padding: "4px 12px",
            ...style
        }}
        {...rest}
    >
        {children}
    </button>
);

export const CancelCropButton = ({ onClick, style, children = "Cancel", ...rest }) => (
    <button
        onClick={onClick}
        style={{
            fontWeight: 600,
            color: "#fff",
            background: "#e24a4a",
            border: "none",
            borderRadius: 3,
            padding: "4px 12px",
            ...style
        }}
        {...rest}
    >
        {children}
    </button>
);

const CroppingBox = ({
    getSelectionStyles,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    isSelecting,
    selectionBoxRef,
    handleSaveClick,
    stopCropping,
    selectionRect,
    showDefaultButtons
}) => (
    <div
        ref={selectionBoxRef}
        style={getSelectionStyles()}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
    >
        {edges.map((edge) => (
            <div
                key={edge.dir}
                style={{
                    ...edge.style,
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    background: '#fff',
                    border: '1px solid #4A90E2',
                    borderRadius: 6,
                    marginLeft: edge.style.left === '50%' ? -6 : 0,
                    marginTop: edge.style.top === '50%' ? -6 : 0,
                    marginRight: edge.style.right === '50%' ? -6 : 0,
                    marginBottom: edge.style.bottom === '50%' ? -6 : 0,
                    zIndex: 11,
                }}
                onMouseDown={(e) => handleResizeStart(e, edge.dir)}
                onTouchStart={(e) => handleResizeStart(e, edge.dir)}
                onMouseMove={handleResizeMove}
                onTouchMove={handleResizeMove}
                onMouseUp={handleResizeEnd}
                onTouchEnd={handleResizeEnd}
            />
        ))}
        {showDefaultButtons && (
            <div style={{
                position: 'absolute', bottom: -30, right: 0, zIndex: 12,
                display: 'flex', gap: 6,
            }}>
                <CropPreviewButton onClick={handleSaveClick} />
                <CancelCropButton onClick={stopCropping} />
            </div>
        )}
    </div>
);

export default CroppingBox;
