/**
 * Client-side API layer for GENESIS 2026.
 * Resolves with mock successes when NEXT_PUBLIC_API_BASE is unset,
 * allowing full frontend testing in static-export mode.
 */

export interface LeadSubmission {
  contact: string;
  contactType: 'email' | 'phone';
  source?: string;
  consent: boolean;
}

export interface MessageSubmission {
  name: string;
  contact: string;
  message: string;
  consent: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function submitLead(payload: LeadSubmission): Promise<ApiResponse> {
  if (!API_BASE) {
    // Mock simulation
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      message: 'You have been registered for announcements! We will notify you when tickets open.',
    };
  }

  try {
    const res = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}

export async function submitMessage(payload: MessageSubmission): Promise<ApiResponse> {
  if (!API_BASE) {
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      message: 'Your question was sent to the GDXR crew! We will get back to you shortly.',
    };
  }

  try {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}
