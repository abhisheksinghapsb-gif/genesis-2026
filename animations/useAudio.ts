'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS } from './tokens';

export function useAudio() {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChoice = localStorage.getItem(STORAGE_KEYS.soundEnabled);
      // Muted by default, never autoplay
      if (savedChoice === 'true') {
        setIsAudioEnabled(true);
      }
    }
  }, []);

  const playSynthesizedAmbient = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create a gentle sci-fi ambient warm drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low warm A2 note

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2); // Soft volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  }, []);

  const stopSynthesizedAmbient = useCallback(() => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContextRef.current.currentTime + 0.5,
        );
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          oscillatorRef.current = null;
        }, 500);
      }
    } catch {
      // Audio cleanup
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const nextState = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.soundEnabled, String(nextState));
      }
      if (nextState) {
        playSynthesizedAmbient();
      } else {
        stopSynthesizedAmbient();
      }
      return nextState;
    });
  }, [playSynthesizedAmbient, stopSynthesizedAmbient]);

  return {
    isAudioEnabled,
    toggleAudio,
  };
}
