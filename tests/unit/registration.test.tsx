import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterSection } from '@/components/register/RegisterSection';

describe('Phase 7: RegisterSection 3-Step Wizard Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();

    // Default mock for /api/stats
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              total: 128,
              gaming: 84,
              vr: 44,
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            teamId: 'GEN-2026-9999',
            teamName: 'Cyber Titans',
            track: 'gaming',
            college: 'AIT Pune',
            city: 'Pune',
            leaderName: 'Test Leader',
            leaderEmail: 'leader@example.com',
            memberCount: 2,
          }),
        });
      })
    );
  });

  it('renders Step 1 with team name, SVG track cards, college, and city inputs', async () => {
    render(<RegisterSection />);

    await waitFor(() => {
      expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/STEP 1: SQUAD & TOURNAMENT TRACK/i)).toBeInTheDocument();
    expect(screen.getByText(/GAMING CHAMPIONSHIP/i)).toBeInTheDocument();
    expect(screen.getByText(/VR IMMERSION TRACK/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Squad \/ Clan Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/College \/ Institute/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i })).toBeInTheDocument();
  });

  it('validates Step 1 fields before advancing to Step 2', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    const nextBtn = screen.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i });
    fireEvent.click(nextBtn);

    // Shows friendly inline error
    expect(screen.getByText(/Please fill out all squad details before continuing/i)).toBeInTheDocument();

    // Fill valid Step 1 details
    fireEvent.change(screen.getByLabelText(/Squad \/ Clan Name/i), {
      target: { value: 'HyperNova Force' },
    });
    fireEvent.change(screen.getByLabelText(/College \/ Institute/i), {
      target: { value: 'Army Institute of Technology' },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: 'Pune' },
    });

    fireEvent.click(nextBtn);

    // Advances to Step 2
    await waitFor(() => {
      expect(screen.getByText(/STEP 2: SQUAD ROSTER/i)).toBeInTheDocument();
    });
  });

  it('controls member input rows via the team size selector (1 to 4)', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    // Advance to Step 2
    fireEvent.change(screen.getByLabelText(/Squad \/ Clan Name/i), { target: { value: 'Alpha Clan' } });
    fireEvent.change(screen.getByLabelText(/College \/ Institute/i), { target: { value: 'COEP' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Pune' } });
    fireEvent.click(screen.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i }));

    await waitFor(() => expect(screen.getByText(/STEP 2: SQUAD ROSTER/i)).toBeInTheDocument());

    // Default is 1 (Solo) -> Leader only, no Player 2
    expect(screen.getByText(/Player 1 \(Squad Leader\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Player 2/i)).not.toBeInTheDocument();

    // Select 3 Players
    const threePlayersBtn = screen.getByRole('button', { name: /3 Players/i });
    fireEvent.click(threePlayersBtn);

    // Now Player 2 and Player 3 rows appear
    expect(screen.getByText(/Player 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Player 3/i)).toBeInTheDocument();
    expect(screen.queryByText(/Player 4/i)).not.toBeInTheDocument();

    // Select 4 Players
    const fourPlayersBtn = screen.getByRole('button', { name: /4 Players/i });
    fireEvent.click(fourPlayersBtn);
    expect(screen.getByText(/Player 4/i)).toBeInTheDocument();
  });

  it('restores saved draft from localStorage on load', async () => {
    localStorage.setItem(
      'genesis_registration_draft',
      JSON.stringify({
        teamName: 'Drafted Legends',
        track: 'vr',
        college: 'MIT Pune',
        city: 'Pune',
        teamSize: 2,
        leaderName: 'Draft Leader',
        leaderEmail: 'draft@example.com',
        leaderPhone: '9876543210',
        members: [{ name: 'Draft Member 2', email: 'member2@example.com', phone: '' }],
      })
    );

    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    expect(screen.getByText(/Draft restored from your last visit/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Drafted Legends')).toBeInTheDocument();
    expect(screen.getByDisplayValue('MIT Pune')).toBeInTheDocument();
  });

  it('advances through Step 1, Step 2, and displays read-only review in Step 3', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    // Step 1
    fireEvent.change(screen.getByLabelText(/Squad \/ Clan Name/i), { target: { value: 'Cyber Titans' } });
    fireEvent.change(screen.getByLabelText(/College \/ Institute/i), { target: { value: 'AIT Pune' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Pune' } });
    fireEvent.click(screen.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i }));

    // Step 2
    await waitFor(() => expect(screen.getByText(/STEP 2: SQUAD ROSTER/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Commander Star' } });
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), { target: { value: 'star@example.com' } });
    fireEvent.change(screen.getByLabelText(/10-Digit Indian Mobile/i), { target: { value: '9876543210' } });

    fireEvent.click(screen.getByRole('button', { name: /NEXT: REVIEW SQUAD →/i }));

    // Step 3
    await waitFor(() => expect(screen.getByText(/STEP 3: REVIEW & ENTER ARENA/i)).toBeInTheDocument());
    expect(screen.getByText('Cyber Titans')).toBeInTheDocument();
    expect(screen.getByText(/AIT Pune • Pune/i)).toBeInTheDocument();
    expect(screen.getByText(/Commander Star/i)).toBeInTheDocument();

    // Check consent checkbox and submit
    const consentBox = screen.getByRole('checkbox');
    fireEvent.click(consentBox);

    const submitBtn = screen.getByRole('button', { name: /ENTER ARENA • SUBMIT/i });
    fireEvent.click(submitBtn);

    // Victory screen
    await waitFor(() => {
      expect(screen.getByText(/WELCOME TO THE ARENA!/i)).toBeInTheDocument();
      expect(screen.getByText(/GEN-2026-9999/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ADD TO CALENDAR \(\.ICS\)/i })).toBeInTheDocument();
    });
  });
});
