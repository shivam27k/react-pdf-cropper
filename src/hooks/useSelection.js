import { useCallback } from 'react';

const useSelection = ({
    containerRef,
    isCropping,
    isSelecting,
    setSelectionRect,
    setStartPos,
    startPos,
    setEndPos,
    setIsSelecting,
    setIsDraggingActive,
    selectionRect,
    isDragging,
}) => {
    const handleStart = useCallback(
        (e) => {
            if (!isCropping) return;
            e.preventDefault();
            e.stopPropagation();
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            let rect = containerRef.current.getBoundingClientRect();
            setStartPos({ x: clientX - rect.left, y: clientY - rect.top });
            setEndPos(null);
            setIsSelecting(true);
            setIsDraggingActive(false);
        },
        [isCropping, containerRef, setStartPos, setEndPos, setIsSelecting, setIsDraggingActive]
    );

    const handleMove = useCallback(
        (e) => {
            if (!isCropping || !isSelecting) return;
            e.preventDefault();
            e.stopPropagation();
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            let rect = containerRef.current.getBoundingClientRect();
            let newEndPos = { x: clientX - rect.left, y: clientY - rect.top };
            setEndPos(newEndPos);

            let width = Math.abs(newEndPos.x - startPos.x);
            let height = Math.abs(newEndPos.y - startPos.y);
            let left = Math.min(startPos.x, newEndPos.x);
            let top = Math.min(startPos.y, newEndPos.y);

            setSelectionRect({ width, height, left, top });
        },
        [isCropping, isSelecting, startPos, containerRef, setEndPos, setSelectionRect]
    );

    const handleEnd = useCallback(
        (e) => {
            if (!isCropping || !isSelecting) return;
            e.preventDefault();
            e.stopPropagation();
            setIsSelecting(false);
            setIsDraggingActive(true);
        },
        [isCropping, isSelecting, setIsSelecting, setIsDraggingActive]
    );

    const getSelectionStyles = useCallback(() => {
        return {
            width: selectionRect?.width,
            height: selectionRect?.height,
            left: selectionRect?.left,
            top: selectionRect?.top,
            border: '2px dashed #4A90E2',
            backgroundColor: 'rgba(74, 144, 226, 0.3)',
            position: 'absolute',
            zIndex: 10,
            cursor: isDragging ? 'grabbing' : 'grab',
        };
    }, [selectionRect, isDragging]);

    const resetSelection = useCallback(() => {
        setStartPos(null);
        setEndPos(null);
        setSelectionRect({
            width: 200,
            height: 200,
            left: window.innerWidth * 0.25,
            top: 120,
        });
    }, [setStartPos, setEndPos, setSelectionRect]);

    return {
        handleStart,
        handleMove,
        handleEnd,
        resetSelection,
        getSelectionStyles,
    };
};

export default useSelection;
