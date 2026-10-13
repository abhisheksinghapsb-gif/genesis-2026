import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterSection } from '@/components/register/RegisterSection';

describe('Phase 6: RegisterSection UI Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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
            teamName: 'Test Squad',
            track: 'gaming',
            leaderName: 'Test Leader',
            leaderEmail: 'test@example.com',
            memberCount: 1,
          }),
        });
      })
    );
  });

  it('renders section title, track choices, and initial inputs', async () => {
    render(<RegisterSection />);

    await waitFor(() => {
      expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/GAMING CHAMPIONSHIP/i)).toBeInTheDocument();
    expect(screen.getByText(/VR IMMERSION TRACK/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Squad \/ Clan Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it('allows switching tracks between Gaming and VR', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    const vrButton = screen.getByText(/VR IMMERSION TRACK/i).closest('button');
    expect(vrButton).toBeInTheDocument();

    if (vrButton) {
      fireEvent.click(vrButton);
    }

    // VR Track is now selected
    expect(screen.getByText(/Meta Quest & Spatial Experience Trials/i)).toBeInTheDocument();
  });

  it('dynamically adds up to 3 additional members and allows removing them', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    const addMemberBtn = screen.getByRole('button', { name: /\+ Add Member/i });
    expect(addMemberBtn).toBeInTheDocument();

    // Add Player 2
    fireEvent.click(addMemberBtn);
    expect(screen.getByText(/PLAYER 2/i)).toBeInTheDocument();

    // Add Player 3
    fireEvent.click(addMemberBtn);
    expect(screen.getByText(/PLAYER 3/i)).toBeInTheDocument();

    // Add Player 4
    fireEvent.click(addMemberBtn);
    expect(screen.getByText(/PLAYER 4/i)).toBeInTheDocument();

    // At 3 additional members (4 players total), Add button should be disabled
    expect(addMemberBtn).toBeDisabled();

    // Remove one member
    const removeButtons = screen.getAllByRole('button', { name: /✕ REMOVE/i });
    expect(removeButtons.length).toBe(3);
    const firstRemoveBtn = removeButtons[0];
    expect(firstRemoveBtn).toBeDefined();
    if (firstRemoveBtn) {
      fireEvent.click(firstRemoveBtn);
    }

    // Now 2 members left, button enabled again
    expect(screen.getByRole('button', { name: /\+ Add Member/i })).not.toBeDisabled();
  });

  it('opens and closes the Privacy Policy modal', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    const privacyBtn = screen.getByRole('button', { name: /Privacy Policy/i });
    fireEvent.click(privacyBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/HOW DATA IS USED/i)).toBeInTheDocument();

    const understandBtn = screen.getByRole('button', { name: /I UNDERSTAND/i });
    fireEvent.click(understandBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays error if submitted without checking the consent checkbox', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    // Fill in team name
    const teamNameInput = screen.getByLabelText(/Squad \/ Clan Name/i);
    fireEvent.change(teamNameInput, { target: { value: 'Omega Squad' } });

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /ENTER ARENA/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/You must accept the Tournament Rules & Privacy Policy/i)
    ).toBeInTheDocument();
  });

  it('submits valid registration and shows success victory panel with Team ID', async () => {
    render(<RegisterSection />);
    await waitFor(() => expect(screen.getByText(/REGISTER SQUAD/i)).toBeInTheDocument());

    // Fill form
    fireEvent.change(screen.getByLabelText(/Squad \/ Clan Name/i), {
      target: { value: 'HyperNova Force' },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Commander Star' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'star@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+919876543210' },
    });

    // Check consent
    const consentCheckbox = screen.getByRole('checkbox');
    fireEvent.click(consentCheckbox);

    // Submit
    const submitBtn = screen.getByRole('button', { name: /ENTER ARENA/i });
    fireEvent.click(submitBtn);

    // Victory screen displays Team ID
    await waitFor(() => {
      expect(screen.getByText(/WELCOME TO THE ARENA!/i)).toBeInTheDocument();
      expect(screen.getByText(/GEN-2026-9999/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /REGISTER ANOTHER SQUAD/i })).toBeInTheDocument();
    });
  });
});
