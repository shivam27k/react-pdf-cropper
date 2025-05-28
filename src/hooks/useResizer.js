import { useCallback, useEffect, useRef, useState } from 'react';

const useResizer = ({ containerRef, selectionRect, setSelectionRect, isCropping }) => {
    const [resizing, setResizing] = useState(false);
    const [resizingDirection, setResizingDirection] = useState(null);

    // Use refs for latest values
    const resizingRef = useRef(resizing);
    const directionRef = useRef(resizingDirection);

    useEffect(() => { resizingRef.current = resizing }, [resizing]);
    useEffect(() => { directionRef.current = resizingDirection }, [resizingDirection]);

    // Reset when crop mode ends
    useEffect(() => {
        if (!isCropping) {
            setResizing(false);
            setResizingDirection(null);
        }
    }, [isCropping]);

    // Defensive: always reset on blur (window loses focus)
    useEffect(() => {
        function handleWindowBlur() {
            setResizing(false);
            setResizingDirection(null);
        }
        window.addEventListener('blur', handleWindowBlur);
        return () => window.removeEventListener('blur', handleWindowBlur);
    }, []);

    const resizeRect = useCallback((moveX, moveY, rect, direction) => {
        let { left, top, width, height } = rect;
        switch (direction) {
            case 'top-left':
                width += left - moveX;
                height += top - moveY;
                left = moveX;
                top = moveY;
                break;
            case 'top-right':
                width = moveX - left;
                height += top - moveY;
                top = moveY;
                break;
            case 'bottom-left':
                width += left - moveX;
                height = moveY - top;
                left = moveX;
                break;
            case 'bottom-right':
                width = moveX - left;
                height = moveY - top;
                break;
            case 'left':
                width += left - moveX;
                left = moveX;
                break;
            case 'right':
                width = moveX - left;
                break;
            case 'top':
                height += top - moveY;
                top = moveY;
                break;
            case 'bottom':
                height = moveY - top;
                break;
            default:
                break;
        }
        return { left, top, width, height };
    }, []);

    const handleResizeStart = useCallback((e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        setResizing(true);
        setResizingDirection(direction);
    }, []);

    // Global event handlers must always refer to .current
    const handleGlobalMouseMove = useCallback((e) => {
        if (!resizingRef.current || !directionRef.current) return;
        const { clientX, clientY } = e.touches?.[0] || e;
        const rect = containerRef.current.getBoundingClientRect();
        const moveX = clientX - rect.left;
        const moveY = clientY - rect.top;
        setSelectionRect(prevRect => resizeRect(moveX, moveY, prevRect, directionRef.current));
    }, [containerRef, setSelectionRect, resizeRect]);

    const handleGlobalMouseUp = useCallback(() => {
        setResizing(false);
        setResizingDirection(null);
    }, []);

    useEffect(() => {
        if (resizing) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
            window.addEventListener('touchmove', handleGlobalMouseMove);
            window.addEventListener('touchend', handleGlobalMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleGlobalMouseMove);
                window.removeEventListener('mouseup', handleGlobalMouseUp);
                window.removeEventListener('touchmove', handleGlobalMouseMove);
                window.removeEventListener('touchend', handleGlobalMouseUp);
            };
        }
    }, [resizing, handleGlobalMouseMove, handleGlobalMouseUp]);

    const handleResizeMove = useCallback(
        (e) => {
            // For immediate visual feedback (but most work is handled by globals)
            if (!resizing || !resizingDirection) return;
            const { clientX, clientY } = e.touches?.[0] || e;
            const rect = containerRef.current.getBoundingClientRect();
            const moveX = clientX - rect.left;
            const moveY = clientY - rect.top;
            setSelectionRect(prevRect => resizeRect(moveX, moveY, prevRect, resizingDirection));
        },
        [resizing, resizingDirection, containerRef, setSelectionRect, resizeRect]
    );

    const handleResizeEnd = useCallback(() => {
        setResizing(false);
        setResizingDirection(null);
    }, []);

    return {
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd,
    };
};

export default useResizer;
