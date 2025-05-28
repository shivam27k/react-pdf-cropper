import { useState, useCallback, useEffect } from 'react';
import useCroppingLogic from './useCroppingLogic';
import useDragging from './useDragging';
import useSelection from './useSelection';
import useResizer from './useResizer';

const useCropping = ({
    containerRef,
    isCropping,
    setIsCropping,
    currentPage,
    watermarkImage,
    watermarkProps,
    onCrop,
}) => {
    const [startPos, setStartPos] = useState(null);
    const [endPos, setEndPos] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingActive, setIsDraggingActive] = useState(true);

    const [selectionRect, setSelectionRect] = useState({
        width: 200,
        height: 200,
        left: window.innerWidth * 0.25,
        top: 120,
    });
    const [dragStartPos, setDragStartPos] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // If currentPage changes, reset selection
    useEffect(() => {
        if (isCropping) resetSelection();
        // eslint-disable-next-line
    }, [currentPage, isCropping]);

    const { handleResizeEnd, handleResizeStart, handleResizeMove } = useResizer({
        containerRef,
        selectionRect,
        setSelectionRect,
    });

    const {
        handleStart,
        handleMove,
        handleEnd,
        resetSelection,
        getSelectionStyles,
    } = useSelection({
        containerRef,
        isCropping, // <--- ONLY allow when cropping is active!
        isSelecting,
        setSelectionRect,
        setStartPos,
        startPos,
        setEndPos,
        setIsSelecting,
        setIsDraggingActive,
        selectionRect,
        isDragging,
    });

    const { handleDragStart, handleDragMove, handleDragEnd } = useDragging({
        containerRef,
        isCropping, // <--- ONLY allow when cropping is active!
        isSelecting,
        isDraggingActive,
        setDragStartPos,
        isDragging,
        setIsDragging,
        dragStartPos,
        setSelectionRect,
    });

    const { handleSaveClick } = useCroppingLogic({
        containerRef,
        currentPage,
        selectionRect,
        setCroppedImage,
        setShowModal,
        watermarkImage,
        watermarkProps,
        onCrop,
    });

    const handleDownload = useCallback(() => {
        if (!croppedImage) return;
        let link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowModal(false);
        resetSelection();
        if (setIsCropping) setIsCropping(false);
    }, [croppedImage, resetSelection, setIsCropping]);

    const handleCancel = useCallback(() => {
        setCroppedImage(null);
        setShowModal(false);
        resetSelection();
        if (setIsCropping) setIsCropping(false);
    }, [resetSelection, setIsCropping]);

    return {
        startPos,
        endPos,
        isSelecting,
        isDragging,
        selectionRect,
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
        resetSelection,
        handleCancel,
        setSelectionRect,
        getSelectionStyles,
        handleResizeEnd,
        handleResizeStart,
        handleResizeMove,
    };
};

export default useCropping;
