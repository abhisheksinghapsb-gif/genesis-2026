import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SponsorsSection } from '@/components/sponsors/SponsorsSection';
import { MemoriesSection } from '@/components/memories/MemoriesSection';
import { FaqSection } from '@/components/faq/FaqSection';
import { FooterSection } from '@/components/footer/FooterSection';

describe('Sponsors Component', () => {
  it('renders sponsor tiers and logos', () => {
    render(<SponsorsSection />);
    expect(screen.getByText('SPONSORS')).toBeInTheDocument();
    expect(screen.getByText(/TITLE SPONSORS/i)).toBeInTheDocument();
    expect(screen.getByText(/PLATFORM SPONSORS/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Cloud Technologies/i)).toBeInTheDocument();
    expect(screen.getByText(/Gamedoora/i)).toBeInTheDocument();
  });

  it('opens and closes the sponsor partnership modal', () => {
    render(<SponsorsSection />);
    const partnerButtons = screen.getAllByRole('button', { name: /Partner with Genesis/i });
    expect(partnerButtons.length).toBeGreaterThan(0);

    // Open partnership modal
    fireEvent.click(partnerButtons[0]!);
    expect(screen.getByRole('dialog', { name: /Become a Sponsor/i })).toBeInTheDocument();

    // Close via Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Become a Sponsor/i })).not.toBeInTheDocument();
  });

  it('toggles collapse for sponsor window', () => {
    render(<SponsorsSection />);
    const collapseBtn = screen.getByRole('button', { name: /Collapse TITLE SPONSORS/i });
    fireEvent.click(collapseBtn);
    expect(screen.getByRole('button', { name: /Expand TITLE SPONSORS/i })).toBeInTheDocument();
  });
});

describe('Memories Component', () => {
  it('renders section and year filter chips', () => {
    render(<MemoriesSection />);
    expect(screen.getByText('MEMORIES')).toBeInTheDocument();
    expect(screen.getByText('ALL EDITIONS')).toBeInTheDocument();
    expect(screen.getByText('GENESIS 2025')).toBeInTheDocument();
    expect(screen.getByText('GENESIS 2024')).toBeInTheDocument();
    expect(screen.getByText('GENESIS 2023')).toBeInTheDocument();
  });

  it('filters memories when year chip is clicked', () => {
    render(<MemoriesSection />);
    const chip2024 = screen.getByText('GENESIS 2024');
    fireEvent.click(chip2024);
    // Should filter items to 2024
    expect(screen.getAllByText(/GENESIS 3.0/i).length).toBeGreaterThan(0);
  });

  it('opens memories lightbox on item click and supports keyboard navigation', () => {
    render(<MemoriesSection />);
    const memoryCards = screen.getAllByRole('button');
    // Find a memory card button
    const card = memoryCards.find((btn) => btn.textContent?.includes('GRAND LAN FINALS'));
    expect(card).toBeDefined();

    if (card) {
      fireEvent.click(card);
      expect(screen.getByRole('dialog', { name: /Memory: GRAND LAN FINALS/i })).toBeInTheDocument();

      // Keyboard arrow navigation
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      // Should show next memory
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Escape closes
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  });
});

describe('FAQ Component', () => {
  it('renders FAQs and allows searching', () => {
    render(<FaqSection />);
    expect(screen.getByText('FAQS')).toBeInTheDocument();
    expect(screen.getByText(/Who can participate/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search questions/i);
    fireEvent.change(searchInput, { target: { value: 'VR' } });

    expect(screen.getByText(/What is the VR track/i)).toBeInTheDocument();
    expect(screen.queryByText(/Who can participate/i)).not.toBeInTheDocument();
  });

  it('toggles accordion answer', () => {
    render(<FaqSection />);
    const questionBtn = screen.getByText(/Who can participate/i);
    // Question 1 is initially open by default
    expect(screen.getByText(/Students currently enrolled in recognized colleges/i)).toBeInTheDocument();

    // Clicking it collapses it
    fireEvent.click(questionBtn);
    expect(screen.queryByText(/Students currently enrolled in recognized colleges/i)).not.toBeInTheDocument();
  });

  it('opens and closes help desk modal on clicking still stuck', () => {
    render(<FaqSection />);
    const stuckBtn = screen.getByRole('button', { name: /Open contact inquiry modal/i });
    fireEvent.click(stuckBtn);

    expect(screen.getByRole('dialog', { name: /Ask the Organizers/i })).toBeInTheDocument();

    // Close via Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Ask the Organizers/i })).not.toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('renders brand info, social links, and brochure downloader', () => {
    render(<FooterSection />);
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText(/RULEBOOK \/ BROCHURE/i)).toBeInTheDocument();
    expect(screen.getByText(/BACK TO TOP/i)).toBeInTheDocument();
    expect(screen.getByText(/DISCORD/i)).toBeInTheDocument();
    expect(screen.getByText(/INSTAGRAM/i)).toBeInTheDocument();
  });

  it('launches back to top rocket on click', () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<FooterSection />);
    const rocketBtn = screen.getByRole('button', { name: /Launch back to top of page/i });
    fireEvent.click(rocketBtn);

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
