import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineSection } from '@/components/timeline/TimelineSection';
import { PrizesSection } from '@/components/prizes/PrizesSection';

describe('Timeline Component', () => {
  it('renders all 4 milestones from timeline.json', () => {
    render(<TimelineSection />);
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('REGISTRATIONS OPEN')).toBeInTheDocument();
    expect(screen.getByText('GRAND FINALE')).toBeInTheDocument();
  });

  it('opens milestone details modal on clicking a card and closes on escape', () => {
    render(<TimelineSection />);
    const detailButtons = screen.getAllByRole('button', { name: /View rules and venue details/i });
    expect(detailButtons.length).toBe(4);

    // Open first modal
    fireEvent.click(detailButtons[0]!);
    expect(screen.getByText(/STAGE 01/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Prize Pool Component', () => {
  it('renders confirmed prizes from prizes.json', () => {
    render(<PrizesSection />);
    expect(screen.getByText('PRIZE POOL')).toBeInTheDocument();
    expect(screen.getByText('MAIN GAMING CHAMPIONSHIP')).toBeInTheDocument();
    expect(screen.getByText('VR TRACK ARENA')).toBeInTheDocument();
    expect(screen.getByText('CHAMPION')).toBeInTheDocument();
    expect(screen.getByText('VR CHAMPION')).toBeInTheDocument();
  });

  it('allows collapsing and expanding panels with the red button', () => {
    render(<PrizesSection />);
    const collapseMainBtn = screen.getByRole('button', { name: /Collapse Main Gaming panel/i });
    expect(collapseMainBtn).toBeInTheDocument();

    // Collapse
    fireEvent.click(collapseMainBtn);
    expect(screen.getByRole('button', { name: /Expand Main Gaming panel/i })).toBeInTheDocument();

    // Expand
    const expandBtn = screen.getByRole('button', { name: /Expand Main Gaming panel/i });
    fireEvent.click(expandBtn);
    expect(screen.getByRole('button', { name: /Collapse Main Gaming panel/i })).toBeInTheDocument();
  });
});
