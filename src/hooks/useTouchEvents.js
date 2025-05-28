import { useEffect } from 'react';

const useTouchEvents = (elementRef, handlers, isActive = true) => {
    useEffect(() => {
        const isMobile =
            'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const element = elementRef.current;

        if (isMobile && element && isActive) {
            const { handleStart, handleMove, handleEnd } = handlers;

            element.addEventListener('touchstart', handleStart, {
                passive: false,
            });
            element.addEventListener('touchmove', handleMove, {
                passive: false,
            });
            element.addEventListener('touchend', handleEnd, {
                passive: false,
            });

            return () => {
                element.removeEventListener('touchstart', handleStart);
                element.removeEventListener('touchmove', handleMove);
                element.removeEventListener('touchend', handleEnd);
            };
        }
    }, [elementRef, handlers, isActive]);
};

export default useTouchEvents;
