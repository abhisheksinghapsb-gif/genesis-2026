import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameButton } from '@/components/ui/GameButton';
import { NumberedCoin } from '@/components/ui/NumberedCoin';
import { ShieldBadge } from '@/components/ui/ShieldBadge';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { GameDrawer } from '@/components/hud/GameDrawer';

describe('UI & Game Components', () => {
  it('renders GameButton with text and tactile drop-base styles', () => {
    render(<GameButton variant="yellow">TEST BUTTON</GameButton>);
    const btn = screen.getByRole('button', { name: /TEST BUTTON/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('font-heading');
  });

  it('renders NumberedCoin with zero-padded number', () => {
    render(<NumberedCoin number={1} />);
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('renders ShieldBadge with rank label', () => {
    render(<ShieldBadge rank="1ST" tier="gold" />);
    expect(screen.getByText('1ST')).toBeInTheDocument();
  });

  it('renders SlantedBanner with title and subtitle', () => {
    render(<SlantedBanner title="TIMELINE" subtitle="ROADMAP TO VICTORY" color="orange" />);
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('ROADMAP TO VICTORY')).toBeInTheDocument();
  });
});

describe('GameDrawer Navigation', () => {
  it('renders all sections and triggers section selection', () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <GameDrawer
        isOpen={true}
        activeSectionId="home"
        isAudioEnabled={false}
        isReducedMotion={false}
        onClose={handleClose}
        onSelectSection={handleSelect}
        onToggleAudio={vi.fn()}
        onToggleMotion={vi.fn()}
      />,
    );

    expect(screen.getByText('GENESIS MENU')).toBeInTheDocument();
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('PRIZES')).toBeInTheDocument();

    const timelineBtn = screen.getByRole('button', { name: /TIMELINE/i });
    fireEvent.click(timelineBtn);
    expect(handleSelect).toHaveBeenCalledWith('timeline');
    expect(handleClose).toHaveBeenCalled();
  });

  it('handles Escape key to close drawer', () => {
    const handleClose = vi.fn();
    render(
      <GameDrawer
        isOpen={true}
        activeSectionId="home"
        isAudioEnabled={false}
        isReducedMotion={false}
        onClose={handleClose}
        onSelectSection={vi.fn()}
        onToggleAudio={vi.fn()}
        onToggleMotion={vi.fn()}
      />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });
});
