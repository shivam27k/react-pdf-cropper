import { useCallback, useEffect } from 'react';

const useDragging = ({
    containerRef,
    // isCropping,
    isSelecting,
    isDraggingActive,
    setDragStartPos,
    isDragging,
    setIsDragging,
    dragStartPos,
    setSelectionRect,
}) => {
    const handleDragStart = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            // if (!isCropping || isSelecting || !isDraggingActive) return;
            if (isSelecting || !isDraggingActive) return;
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            setDragStartPos({ x: clientX, y: clientY });
            setIsDragging(true);
        },
        [isSelecting, isDraggingActive, setDragStartPos, setIsDragging]
        // [isCropping, isSelecting, isDraggingActive, setDragStartPos, setIsDragging]
    );

    const handleDragMove = useCallback(
        (e) => {
            if (!isDragging) return;
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
            let deltaX = clientX - dragStartPos.x;
            let deltaY = clientY - dragStartPos.y;

            setSelectionRect((prevRect) => {
                let newLeft = prevRect.left + deltaX;
                let newTop = prevRect.top + deltaY;
                const viewerBounds = containerRef.current.getBoundingClientRect();
                const rectRight = newLeft + prevRect.width;
                const rectBottom = newTop + prevRect.height;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (rectRight > viewerBounds.width)
                    newLeft = viewerBounds.width - prevRect.width;
                if (rectBottom > viewerBounds.height)
                    newTop = viewerBounds.height - prevRect.height;

                return {
                    ...prevRect,
                    left: newLeft,
                    top: newTop,
                };
            });

            setDragStartPos({ x: clientX, y: clientY });
        },
        [isDragging, dragStartPos, setSelectionRect, containerRef, setDragStartPos]
    );

    const handleDragEnd = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, [setIsDragging]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    return {
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
};

export default useDragging;
