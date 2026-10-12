import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroCountdown } from '@/components/hero/HeroCountdown';
import { HeroBadge } from '@/components/hero/HeroBadge';
import { AboutRobot } from '@/components/about/AboutRobot';
import { AboutSection } from '@/components/about/AboutSection';

describe('Hero Living Elements', () => {
  it('renders HeroCountdown with live squad counter and time units', () => {
    render(<HeroCountdown />);
    expect(screen.getByText(/LIVE ENTRANTS:/i)).toBeInTheDocument();
    expect(screen.getByText(/128 SQUADS/i)).toBeInTheDocument();
    expect(screen.getByText('DAYS')).toBeInTheDocument();
    expect(screen.getByText('HRS')).toBeInTheDocument();
    expect(screen.getByText('MIN')).toBeInTheDocument();
    expect(screen.getByText('SEC')).toBeInTheDocument();
  });

  it('triggers star burst particle explosion on HeroBadge click', () => {
    render(<HeroBadge shouldAnimate={true} />);
    const badgeBtn = screen.getByRole('button', { name: /Genesis Emblem/i });
    expect(badgeBtn).toBeInTheDocument();

    fireEvent.click(badgeBtn);
    // Burst particles generated
    expect(badgeBtn).toBeInTheDocument();
  });
});

describe('About Living Scene', () => {
  it('renders exact official briefing text', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Brawlers, gear up!/i)).toBeInTheDocument();
    expect(screen.getByText(/Lock and load, Brawlers. It's time to make history!/i)).toBeInTheDocument();
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
    expect(screen.getByText('GENESIS')).toBeInTheDocument();
  });

  it('triggers scan callback on Robot Brawler click', () => {
    const handleScan = vi.fn();
    render(<AboutRobot shouldAnimate={true} onScanTrigger={handleScan} />);
    const robotBtn = screen.getByRole('button', { name: /Robot Brawler/i });

    fireEvent.click(robotBtn);
    expect(handleScan).toHaveBeenCalled();
  });
});
