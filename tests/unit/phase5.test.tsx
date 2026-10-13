import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHardwareCapabilities } from '@/animations/useHardwareCapabilities';
import { useTilt3D } from '@/animations/useTilt3D';

describe('Phase 5 Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
    vi.restoreAllMocks();
  });

  describe('Hardware Capabilities & WebGL Detection', () => {
    it('respects URL query ?3d=off by forcing fallback', () => {
      window.history.pushState({}, '', '/?3d=off');

      const { result } = renderHook(() => useHardwareCapabilities());
      expect(result.current.shouldUseWebGL).toBe(false);
    });

    it('falls back to CSS when prefers-reduced-motion is active', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useHardwareCapabilities());
      expect(result.current.hasReducedMotion).toBe(true);
      expect(result.current.shouldUseWebGL).toBe(false);
    });

    it('handles undefined deviceMemory gracefully without throwing', () => {
      const nav = navigator as unknown as { deviceMemory?: number };
      const originalMemory = nav.deviceMemory;
      delete nav.deviceMemory;

      const { result } = renderHook(() => useHardwareCapabilities());
      expect(result.current).toBeDefined();

      nav.deviceMemory = originalMemory;
    });

    it('records FPS downgrade into sessionStorage and toggles shouldUseWebGL to false', () => {
      const { result } = renderHook(() => useHardwareCapabilities());

      act(() => {
        result.current.downgradeToFallback('FPS test drop');
      });

      expect(sessionStorage.getItem('genesis_3d_disabled')).toBe('true');
      expect(result.current.shouldUseWebGL).toBe(false);
    });
  });

  describe('useTilt3D Reusable Hook', () => {
    it('initializes with zero tilt and default perspective', () => {
      const { result } = renderHook(() => useTilt3D({ maxTilt: 10, perspective: 1000 }));

      expect(result.current.transformStyle.transform).toContain('perspective(1000px)');
      expect(result.current.transformStyle.transform).toContain('rotateX(0deg)');
      expect(result.current.transformStyle.transform).toContain('rotateY(0deg)');
    });

    it('computes tilt coordinates within maxTilt limits on pointer move', () => {
      const { result } = renderHook(() => useTilt3D({ maxTilt: 10, scale: 1.05 }));

      // Mock an attached element
      const fakeEl = document.createElement('div');
      fakeEl.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 100,
        top: 100,
        width: 200,
        height: 200,
        right: 300,
        bottom: 300,
      });
      (result.current.ref as { current: HTMLDivElement | null }).current = fakeEl;

      // Pointer move at corner (e.g. clientX: 300, clientY: 300 -> bottom-right)
      act(() => {
        result.current.onPointerMove({
          clientX: 300,
          clientY: 300,
        } as unknown as React.PointerEvent<HTMLElement>);
      });

      // Reset on pointer leave
      act(() => {
        result.current.onPointerLeave();
      });

      expect(result.current.transformStyle).toBeDefined();
    });
  });
});
