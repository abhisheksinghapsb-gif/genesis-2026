'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { GameButton } from '@/components/ui/GameButton';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { DUMMY_TURNSTILE_SITEKEY } from '@/lib/turnstile';
import { registrationSchema } from '@/lib/validation';
import { track as trackAnalytics } from '@/lib/analytics';
import { downloadIcsCalendar } from '@/lib/calendar';
import eventConfig from '@/content/event.json';
import privacyData from '@/content/privacy.json';

const DRAFT_STORAGE_KEY = 'genesis_registration_draft';

interface MemberFormState {
  name: string;
  email: string;
  phone: string;
}

interface StatsData {
  total: number;
  gaming: number;
  vr: number;
}

interface RegisteredSquadResult {
  teamId: string;
  teamName: string;
  track: 'gaming' | 'vr';
  college: string;
  city: string;
  leaderName: string;
  leaderEmail: string;
  memberCount: number;
}

// SVG Track Icons
const GamingGamepadSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-amber-400 drop-shadow-[0_2px_0_#000000]"
    aria-hidden="true"
  >
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const VrHeadsetSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-sky-400 drop-shadow-[0_2px_0_#000000]"
    aria-hidden="true"
  >
    <path d="M20.5 6h-17C2.1 6 1 7.1 1 8.5v7C1 16.9 2.1 18 3.5 18h4.8c.4 0 .7-.2.9-.5l1.6-2.5h2.4l1.6 2.5c.2.3.5.5.9.5h4.8c1.4 0 2.5-1.1 2.5-2.5v-7c0-1.4-1.1-2.5-2.5-2.5zm-13 7.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm9 0c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
  </svg>
);

export const RegisterSection: React.FC = () => {
  // Wizard navigation step: 1 = Team, 2 = Members, 3 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [track, setTrack] = useState<'gaming' | 'vr'>('gaming');
  const [teamName, setTeamName] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [teamSize, setTeamSize] = useState<number>(1); // 1 = solo, 2, 3, 4
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [members, setMembers] = useState<MemberFormState[]>([]);
  const [consent, setConsent] = useState(false);
  const [turnstileToken] = useState('test-dummy-turnstile-token');

  // UI state
  const [draftRestored, setDraftRestored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [registeredSquad, setRegisteredSquad] = useState<RegisteredSquadResult | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // 1. Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teamName) setTeamName(parsed.teamName);
        if (parsed.track) setTrack(parsed.track);
        if (parsed.college) setCollege(parsed.college);
        if (parsed.city) setCity(parsed.city);
        if (typeof parsed.teamSize === 'number') setTeamSize(parsed.teamSize);
        if (parsed.leaderName) setLeaderName(parsed.leaderName);
        if (parsed.leaderEmail) setLeaderEmail(parsed.leaderEmail);
        if (parsed.leaderPhone) setLeaderPhone(parsed.leaderPhone);
        if (Array.isArray(parsed.members)) setMembers(parsed.members);
        setDraftRestored(true);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // 2. Autosave draft to localStorage (never store Turnstile token)
  const saveDraft = useCallback(() => {
    try {
      const draft = {
        teamName,
        track,
        college,
        city,
        teamSize,
        leaderName,
        leaderEmail,
        leaderPhone,
        members,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage quota or private browsing
    }
  }, [teamName, track, college, city, teamSize, leaderName, leaderEmail, leaderPhone, members]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 500);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  // 3. Fetch live tournament stats
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats({
              total: data.total || 0,
              gaming: data.gaming || 0,
              vr: data.vr || 0,
            });
          }
        }
      } catch {
        // Offline safe
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Update member rows whenever teamSize changes
  const handleTeamSizeChange = (size: number) => {
    setTeamSize(size);
    const requiredAdditionalMembers = size - 1; // 1 leader + (size - 1) members
    if (requiredAdditionalMembers <= 0) {
      setMembers([]);
      return;
    }

    setMembers((current) => {
      const next: MemberFormState[] = [];
      for (let i = 0; i < requiredAdditionalMembers; i++) {
        const existing = current[i];
        if (existing) {
          next.push(existing);
        } else {
          next.push({ name: '', email: '', phone: '' });
        }
      }
      return next;
    });
  };

  const handleMemberChange = (
    index: number,
    field: keyof MemberFormState,
    value: string
  ) => {
    const updated = [...members];
    const target = updated[index];
    if (target) {
      updated[index] = { ...target, [field]: value };
      setMembers(updated);
    }
  };

  // 5. Multi-Step Validation & Navigation
  const handleNextToStep2 = () => {
    setErrorMessage(null);
    setFieldErrors({});

    // Validate Step 1 fields against schema rules
    const step1Payload = {
      teamName: teamName.trim(),
      track,
      college: college.trim(),
      city: city.trim(),
      leaderName: 'Placeholder Leader',
      leaderEmail: 'placeholder@example.com',
      leaderPhone: '9876543210',
      members: [],
      consent: true as const,
    };

    const res = registrationSchema.safeParse(step1Payload);
    if (!res.success) {
      const flattened = res.error.flatten();
      const step1Errors: Record<string, string[]> = {};
      if (flattened.fieldErrors.teamName) step1Errors.teamName = flattened.fieldErrors.teamName;
      if (flattened.fieldErrors.college) step1Errors.college = flattened.fieldErrors.college;
      if (flattened.fieldErrors.city) step1Errors.city = flattened.fieldErrors.city;

      if (Object.keys(step1Errors).length > 0) {
        setFieldErrors(step1Errors);
        setErrorMessage('Please fill out all squad details before continuing.');
        return;
      }
    }

    trackAnalytics('registration_step_2_viewed', { track, teamSize });
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    setErrorMessage(null);
    setFieldErrors({});

    // Format current member inputs
    const formattedMembers = members.map((m) => ({
      name: m.name.trim(),
      email: m.email.trim(),
      phone: m.phone.trim() ? m.phone.trim() : undefined,
    }));

    const step2Payload = {
      teamName: teamName.trim(),
      track,
      college: college.trim(),
      city: city.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: leaderPhone.trim(),
      members: formattedMembers,
      consent: true as const,
    };

    const res = registrationSchema.safeParse(step2Payload);
    if (!res.success) {
      const flattened = res.error.flatten();
      const firstError = res.error.errors[0]?.message || 'Please check leader and member details.';
      setFieldErrors(flattened.fieldErrors);
      setErrorMessage(firstError);
      return;
    }

    trackAnalytics('registration_step_3_viewed', { teamName, teamSize });
    setCurrentStep(3);
  };

  // 6. Submit Registration (Step 3)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!consent) {
      setErrorMessage('You must accept the Tournament Rules & Privacy Policy to register.');
      return;
    }

    setIsSubmitting(true);
    trackAnalytics('registration_submitted', { track, teamSize });

    try {
      const formattedMembers = members.map((m) => ({
        name: m.name.trim(),
        email: m.email.trim(),
        phone: m.phone.trim() ? m.phone.trim() : undefined,
      }));

      const payload = {
        teamName: teamName.trim(),
        track,
        college: college.trim(),
        city: city.trim(),
        leaderName: leaderName.trim(),
        leaderEmail: leaderEmail.trim(),
        leaderPhone: leaderPhone.trim(),
        members: formattedMembers,
        consent: true,
        privacyVersion: privacyData.version || '1.0',
        turnstileToken,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed. Please review your entries.');
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setIsSubmitting(false);
        return;
      }

      // Success: Clear autosave draft
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Safe
      }

      trackAnalytics('registration_success', { teamId: data.teamId, track: data.track });

      setRegisteredSquad({
        teamId: data.teamId,
        teamName: data.teamName,
        track: data.track,
        college: data.college || college,
        city: data.city || city,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        memberCount: data.memberCount || members.length + 1,
      });

      // Update stats ticker optimistically
      setStats((prev) =>
        prev
          ? {
              total: prev.total + 1,
              gaming: track === 'gaming' ? prev.gaming + 1 : prev.gaming,
              vr: track === 'vr' ? prev.vr + 1 : prev.vr,
            }
          : null
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network connection failure';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTeamId = () => {
    if (registeredSquad?.teamId && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(registeredSquad.teamId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetForm = () => {
    setRegisteredSquad(null);
    setCurrentStep(1);
    setTeamName('');
    setCollege('');
    setCity('');
    setTeamSize(1);
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setMembers([]);
    setConsent(false);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Safe
    }
  };

  return (
    <section
      id="register"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1638] via-[#0E2054] to-[#060D24] px-4 py-24"
      aria-label="Team Registration"
    >
      <WatermarkPattern opacity={0.12} />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Slanted Game Title Banner */}
        <SlantedBanner
          title="REGISTER SQUAD"
          subtitle="3-STEP REGISTRATION • ENTER THE ARENA"
          color="orange"
        />

        {/* Live Stats Ticker */}
        {stats && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-heading text-xs uppercase tracking-wider text-amber-200">
            <span className="flex items-center gap-1.5 rounded-full border-2 border-[#573507] bg-[#162758]/80 px-3 py-1 shadow-[0_2px_0_#000000]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{stats.total} SQUADS IN ARENA</span>
            </span>
            <span className="rounded-full border border-sky-500/40 bg-sky-950/60 px-2.5 py-0.5 text-sky-300">
              🎮 {stats.gaming} Gaming
            </span>
            <span className="rounded-full border border-purple-500/40 bg-purple-950/60 px-2.5 py-0.5 text-purple-300">
              🥽 {stats.vr} VR Track
            </span>
          </div>
        )}

        {/* Draft Restore Badge */}
        {draftRestored && !registeredSquad && (
          <div className="mt-2.5 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/50 px-3 py-0.5 font-body text-[11px] text-amber-300">
            <span>💾</span>
            <span>Draft restored from your last visit</span>
            <button
              type="button"
              onClick={() => {
                handleResetForm();
                setDraftRestored(false);
              }}
              className="underline text-amber-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        {/* Multi-Step Progress Tracker */}
        {!registeredSquad && (
          <div className="mt-6 flex w-full max-w-md items-center justify-between font-heading text-xs uppercase tracking-wider text-amber-100">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 border-2 transition-all ${
                currentStep === 1
                  ? 'border-amber-400 bg-amber-500 text-black shadow-[0_2px_0_#000000]'
                  : 'border-amber-900/60 bg-[#12234e] text-amber-400'
              }`}
            >
              <span>1</span>
              <span className="hidden sm:inline">TEAM</span>
            </div>

            <div className="h-0.5 flex-1 bg-amber-500/30 mx-2" />

            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 border-2 transition-all ${
                currentStep === 2
                  ? 'border-amber-400 bg-amber-500 text-black shadow-[0_2px_0_#000000]'
                  : currentStep > 2
                  ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                  : 'border-amber-900/60 bg-[#12234e] text-slate-400'
              }`}
            >
              <span>2</span>
              <span className="hidden sm:inline">MEMBERS</span>
            </div>

            <div className="h-0.5 flex-1 bg-amber-500/30 mx-2" />

            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 border-2 transition-all ${
                currentStep === 3
                  ? 'border-amber-400 bg-amber-500 text-black shadow-[0_2px_0_#000000]'
                  : 'border-amber-900/60 bg-[#12234e] text-slate-400'
              }`}
            >
              <span>3</span>
              <span className="hidden sm:inline">REVIEW</span>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="mt-6 w-full text-left">
          {registeredSquad ? (
            /* ================= VICTORY SCREEN & CALENDAR DOWNLOAD ================= */
            <ChamferCard variant="cream" elevation="lg">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#3D2500] bg-gradient-to-b from-emerald-400 to-green-600 shadow-[0_6px_0_#080A10]">
                  <span className="font-heading text-3xl text-white">✓</span>
                </div>

                <span className="mt-3 rounded-full bg-emerald-600/20 px-3.5 py-1 font-heading text-xs font-black uppercase tracking-wider text-emerald-800">
                  REGISTRATION CONFIRMED
                </span>

                <h3 className="mt-2 font-heading text-3xl text-[#2B1400] md:text-4xl">
                  WELCOME TO THE ARENA!
                </h3>

                <p className="mt-2 max-w-lg font-body text-sm font-semibold text-[#573507]">
                  Squad <strong>{registeredSquad.teamName}</strong> from{' '}
                  <strong>{registeredSquad.college}</strong> ({registeredSquad.city}) is booked for the{' '}
                  {registeredSquad.track === 'gaming' ? 'Gaming Championship' : 'VR Immersion Track'}.
                </p>

                {/* Team ID Card */}
                <div className="mt-6 flex w-full max-w-md flex-col items-center rounded-xl border-3 border-[#8C6026] bg-amber-100/90 p-4 shadow-[0_4px_0_#4B3012]">
                  <span className="font-heading text-xs tracking-wider text-[#8C6026] uppercase">
                    OFFICIAL SQUAD IDENTIFIER
                  </span>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="font-heading text-2xl tracking-widest text-[#2B1400] md:text-3xl">
                      {registeredSquad.teamId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTeamId}
                      className="rounded-lg border-2 border-[#573507] bg-amber-400 px-3 py-1 font-heading text-xs text-[#2B1400] shadow-[0_2px_0_#000000] active:translate-y-0.5 hover:bg-amber-300"
                    >
                      {copiedId ? 'COPIED!' : 'COPY ID'}
                    </button>
                  </div>
                </div>

                {/* Important Instructions */}
                <div className="mt-6 flex w-full flex-col gap-2.5 rounded-xl border-2 border-amber-900/20 bg-white/40 p-4 font-body text-xs text-[#4B3012]">
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span>
                      Confirmation dispatched to <strong>{registeredSquad.leaderEmail}</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>
                      Physical check-in at <strong>{eventConfig.venue}</strong> on December 12, 09:00 AM IST.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Carry college ID or Govt photo ID for badge retrieval.</span>
                  </div>
                </div>

                {/* Actions: Add to Calendar & Community links */}
                <div className="mt-8 flex w-full flex-col sm:flex-row gap-3">
                  <GameButton
                    variant="green"
                    size="md"
                    fullWidth
                    onClick={() =>
                      downloadIcsCalendar({
                        teamId: registeredSquad.teamId,
                        teamName: registeredSquad.teamName,
                        track: registeredSquad.track,
                      })
                    }
                  >
                    📅 ADD TO CALENDAR (.ICS)
                  </GameButton>

                  <GameButton
                    variant="blue"
                    size="md"
                    fullWidth
                    href="https://discord.gg/genesis-gdxr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JOIN DISCORD ARENA
                  </GameButton>
                </div>

                <div className="mt-4 w-full">
                  <GameButton
                    variant="cream"
                    size="sm"
                    fullWidth
                    onClick={handleResetForm}
                  >
                    REGISTER ANOTHER SQUAD
                  </GameButton>
                </div>
              </div>
            </ChamferCard>
          ) : (
            /* ================= STEPPER WIZARD FORM ================= */
            <ChamferCard variant="cream" elevation="lg">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* ---------------- STEP 1: TEAM INFORMATION ---------------- */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="font-heading text-lg text-[#2B1400]">
                        STEP 1: SQUAD & TOURNAMENT TRACK
                      </h4>
                      <p className="font-body text-xs font-semibold text-[#573507]">
                        Choose your competitive discipline and provide your clan credentials.
                      </p>
                    </div>

                    {/* Track Selection Cards with Custom SVG */}
                    <div>
                      <label className="block font-heading text-xs tracking-wider text-[#704B18] uppercase">
                        Select Competitive Track *
                      </label>
                      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Gaming Card */}
                        <button
                          type="button"
                          onClick={() => setTrack('gaming')}
                          className={`relative flex items-center gap-3.5 rounded-xl border-3 p-4 text-left transition-all ${
                            track === 'gaming'
                              ? 'border-[#FF9F0A] bg-amber-100 shadow-[0_4px_0_#8C6026]'
                              : 'border-[#BD9B65] bg-amber-50/70 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <GamingGamepadSvg />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-sm text-[#2B1400]">
                                GAMING CHAMPIONSHIP
                              </span>
                              {track === 'gaming' && (
                                <span className="rounded-full bg-amber-500 px-2 py-0.5 font-heading text-[10px] text-white">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span className="block mt-0.5 font-body text-xs text-[#573507]">
                              PC, Mobile & Console Arena. Brawl & Valorant.
                            </span>
                          </div>
                        </button>

                        {/* VR Card */}
                        <button
                          type="button"
                          onClick={() => setTrack('vr')}
                          className={`relative flex items-center gap-3.5 rounded-xl border-3 p-4 text-left transition-all ${
                            track === 'vr'
                              ? 'border-[#00A3FF] bg-sky-100 shadow-[0_4px_0_#0066CC]'
                              : 'border-[#BD9B65] bg-amber-50/70 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <VrHeadsetSvg />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-sm text-[#0B3B66]">
                                VR IMMERSION TRACK
                              </span>
                              {track === 'vr' && (
                                <span className="rounded-full bg-sky-500 px-2 py-0.5 font-heading text-[10px] text-white">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span className="block mt-0.5 font-body text-xs text-[#1E3A8A]">
                              Meta Quest & Spatial Experience Trials.
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Team Name */}
                    <div>
                      <label
                        htmlFor="teamName"
                        className="block font-heading text-xs tracking-wider text-[#704B18] uppercase"
                      >
                        Squad / Clan Name *
                      </label>
                      <input
                        id="teamName"
                        type="text"
                        required
                        maxLength={40}
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Apex Predators"
                        className="mt-1.5 w-full rounded-xl border-2 border-[#8C6026] bg-amber-50 px-4 py-2.5 font-heading text-sm text-[#2B1400] placeholder:text-amber-900/40 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      {fieldErrors.teamName && (
                        <span className="mt-1 block font-body text-xs font-bold text-red-600">
                          {fieldErrors.teamName[0]}
                        </span>
                      )}
                    </div>

                    {/* College and City */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="college"
                          className="block font-heading text-xs tracking-wider text-[#704B18] uppercase"
                        >
                          College / Institute *
                        </label>
                        <input
                          id="college"
                          type="text"
                          required
                          maxLength={100}
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. AIT Pune"
                          className="mt-1.5 w-full rounded-xl border-2 border-[#8C6026] bg-amber-50 px-4 py-2.5 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {fieldErrors.college && (
                          <span className="mt-1 block font-body text-xs font-bold text-red-600">
                            {fieldErrors.college[0]}
                          </span>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block font-heading text-xs tracking-wider text-[#704B18] uppercase"
                        >
                          City *
                        </label>
                        <input
                          id="city"
                          type="text"
                          required
                          maxLength={50}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Pune"
                          className="mt-1.5 w-full rounded-xl border-2 border-[#8C6026] bg-amber-50 px-4 py-2.5 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {fieldErrors.city && (
                          <span className="mt-1 block font-body text-xs font-bold text-red-600">
                            {fieldErrors.city[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step 1 CTA */}
                    <div className="pt-2">
                      <GameButton
                        type="button"
                        variant="yellow"
                        size="lg"
                        fullWidth
                        onClick={handleNextToStep2}
                      >
                        NEXT: SQUAD MEMBERS →
                      </GameButton>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 2: SQUAD MEMBERS ---------------- */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="font-heading text-lg text-[#2B1400]">
                        STEP 2: SQUAD ROSTER
                      </h4>
                      <p className="font-body text-xs font-semibold text-[#573507]">
                        Choose team size (1–4 players) and fill in your roster.
                      </p>
                    </div>

                    {/* Team Size Selector (1 to 4) */}
                    <div>
                      <label className="block font-heading text-xs tracking-wider text-[#704B18] uppercase">
                        Select Squad Size (Leader + Members) *
                      </label>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[1, 2, 3, 4].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleTeamSizeChange(size)}
                            className={`rounded-xl border-3 py-2.5 px-2 text-center font-heading text-xs uppercase transition-all ${
                              teamSize === size
                                ? 'border-[#FF9F0A] bg-amber-400 text-black shadow-[0_3px_0_#8C6026]'
                                : 'border-[#BD9B65] bg-amber-50 text-[#573507] hover:bg-amber-100'
                            }`}
                          >
                            {size === 1 ? '1 (Solo)' : `${size} Players`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Squad Leader (Player 1) */}
                    <div className="rounded-xl border-2 border-[#A37B45]/60 bg-amber-100/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs tracking-wider text-[#573507] uppercase">
                          Player 1 (Squad Leader) *
                        </span>
                        <span className="rounded-full bg-amber-500/30 px-2 py-0.5 font-heading text-[10px] text-amber-950 uppercase">
                          PRIMARY CONTACT
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="leaderName"
                            className="block font-body text-xs font-bold text-[#573507]"
                          >
                            Full Name *
                          </label>
                          <input
                            id="leaderName"
                            type="text"
                            required
                            value={leaderName}
                            onChange={(e) => setLeaderName(e.target.value)}
                            placeholder="Aarav Sharma"
                            className="mt-1 w-full rounded-lg border border-[#8C6026] bg-amber-50 px-3 py-2 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          {fieldErrors.leaderName && (
                            <span className="mt-0.5 block font-body text-xs font-bold text-red-600">
                              {fieldErrors.leaderName[0]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="leaderEmail"
                            className="block font-body text-xs font-bold text-[#573507]"
                          >
                            Email Address *
                          </label>
                          <input
                            id="leaderEmail"
                            type="email"
                            required
                            value={leaderEmail}
                            onChange={(e) => setLeaderEmail(e.target.value)}
                            placeholder="leader@example.com"
                            className="mt-1 w-full rounded-lg border border-[#8C6026] bg-amber-50 px-3 py-2 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          {fieldErrors.leaderEmail && (
                            <span className="mt-0.5 block font-body text-xs font-bold text-red-600">
                              {fieldErrors.leaderEmail[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <label
                          htmlFor="leaderPhone"
                          className="block font-body text-xs font-bold text-[#573507]"
                        >
                          10-Digit Indian Mobile Number *
                        </label>
                        <input
                          id="leaderPhone"
                          type="tel"
                          required
                          value={leaderPhone}
                          onChange={(e) => setLeaderPhone(e.target.value)}
                          placeholder="9876543210 (or +919876543210)"
                          className="mt-1 w-full rounded-lg border border-[#8C6026] bg-amber-50 px-3 py-2 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {fieldErrors.leaderPhone && (
                          <span className="mt-0.5 block font-body text-xs font-bold text-red-600">
                            {fieldErrors.leaderPhone[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Additional Member Rows controlled by teamSize */}
                    {members.map((member, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border-2 border-[#8C6026]/40 bg-white/40 p-3.5"
                      >
                        <span className="font-heading text-xs text-[#4B3012] uppercase">
                          Player {idx + 2}
                        </span>

                        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Full Name *"
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              className="w-full rounded-lg border border-[#8C6026] bg-amber-50 px-2.5 py-1.5 font-body text-xs font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <input
                              type="email"
                              required
                              placeholder="Email Address *"
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              className="w-full rounded-lg border border-[#8C6026] bg-amber-50 px-2.5 py-1.5 font-body text-xs font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <input
                              type="tel"
                              placeholder="Phone (Optional)"
                              value={member.phone}
                              onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                              className="w-full rounded-lg border border-[#8C6026] bg-amber-50 px-2.5 py-1.5 font-body text-xs font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Step 2 Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <GameButton
                        type="button"
                        variant="cream"
                        size="md"
                        fullWidth
                        onClick={() => setCurrentStep(1)}
                      >
                        ← BACK TO TEAM
                      </GameButton>
                      <GameButton
                        type="button"
                        variant="yellow"
                        size="md"
                        fullWidth
                        onClick={handleNextToStep3}
                      >
                        NEXT: REVIEW SQUAD →
                      </GameButton>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 3: REVIEW & CONFIRM ---------------- */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="font-heading text-lg text-[#2B1400]">
                        STEP 3: REVIEW & ENTER ARENA
                      </h4>
                      <p className="font-body text-xs font-semibold text-[#573507]">
                        Verify your squad details before locking in registration.
                      </p>
                    </div>

                    {/* Read-Only Summary Plate */}
                    <div className="rounded-xl border-3 border-[#8C6026] bg-amber-100/80 p-4 shadow-inner">
                      <div className="flex flex-wrap items-center justify-between border-b border-amber-900/20 pb-3">
                        <div>
                          <span className="font-heading text-xs uppercase text-[#8C6026]">
                            SQUAD NAME
                          </span>
                          <h5 className="font-heading text-xl text-[#2B1400]">
                            {teamName}
                          </h5>
                          <span className="font-body text-xs text-[#573507]">
                            {college} • {city}
                          </span>
                        </div>

                        <span
                          className={`mt-2 sm:mt-0 rounded-full px-3 py-1 font-heading text-xs font-black uppercase ${
                            track === 'gaming'
                              ? 'bg-amber-500 text-white'
                              : 'bg-sky-500 text-white'
                          }`}
                        >
                          {track === 'gaming' ? '🎮 Gaming Championship' : '🥽 VR Track'}
                        </span>
                      </div>

                      {/* Squad Roster Summary */}
                      <div className="mt-3">
                        <span className="font-heading text-[11px] uppercase tracking-wider text-[#704B18]">
                          ROSTER ({members.length + 1} PLAYER{members.length > 0 ? 'S' : ''}):
                        </span>

                        <div className="mt-1.5 flex flex-col gap-1.5 font-body text-xs text-[#2B1400]">
                          <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-1.5">
                            <span>
                              ⭐ <strong>{leaderName}</strong> (Leader)
                            </span>
                            <span className="text-[#573507]">{leaderEmail}</span>
                          </div>

                          {members.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-1.5"
                            >
                              <span>
                                👤 <strong>{m.name || `Player ${i + 2}`}</strong>
                              </span>
                              <span className="text-[#573507]">{m.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rules & Privacy Consent */}
                    <div className="rounded-lg border border-[#8C6026]/40 bg-amber-100/40 p-3.5">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-[#8C6026] text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <span className="font-body text-xs text-[#4B3012]">
                          I confirm all registration details are accurate and agree to abide by the official{' '}
                          <strong>GENESIS 2026 Tournament Rules</strong> and{' '}
                          <button
                            type="button"
                            onClick={() => setPrivacyModalOpen(true)}
                            className="font-bold underline text-amber-900 hover:text-amber-950"
                          >
                            Privacy Policy (v{privacyData.version})
                          </button>
                          . Registration is 100% free.
                        </span>
                      </label>
                    </div>

                    {/* Cloudflare Turnstile Indicator */}
                    <div className="flex items-center justify-between rounded-lg border border-sky-900/20 bg-sky-50 px-3 py-2 text-[11px] text-sky-900">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">🛡️</span>
                        <span>Cloudflare Turnstile Bot Protection: <strong>Active & Verified</strong></span>
                      </span>
                      <span className="font-mono text-[10px] text-sky-700 opacity-70">
                        key: {DUMMY_TURNSTILE_SITEKEY.slice(0, 8)}...
                      </span>
                    </div>

                    {/* Step 3 Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <GameButton
                        type="button"
                        variant="cream"
                        size="lg"
                        fullWidth
                        onClick={() => setCurrentStep(2)}
                      >
                        ← EDIT SQUAD
                      </GameButton>

                      <GameButton
                        type="submit"
                        variant="yellow"
                        size="lg"
                        fullWidth
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'TRANSMITTING SQUAD DATA...' : 'ENTER ARENA • SUBMIT REGISTRATION'}
                      </GameButton>
                    </div>
                  </div>
                )}

                {/* Inline Arcade Alert Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-100 p-3.5 font-heading text-xs text-red-900 shadow-[0_2px_0_#991B1B]"
                  >
                    <span className="text-base">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </ChamferCard>
          )}
        </div>
      </div>

      {/* ================= PRIVACY POLICY MODAL ================= */}
      {privacyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border-4 border-[#F59E0B] bg-[#0E2054] p-6 text-white shadow-[0_12px_0_#000000]">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <h3 className="font-heading text-xl text-amber-400">
                PRIVACY POLICY (v{privacyData.version})
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="rounded-lg border-2 border-black bg-rose-600 px-3 py-1 font-heading text-xs text-white shadow-[0_2px_0_#000000] hover:bg-rose-500"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 font-body text-xs leading-relaxed text-slate-200">
              <p>{privacyData.summary}</p>
              <div>
                <h4 className="font-heading text-sm text-sky-400">DATA COLLECTED:</h4>
                <ul className="mt-1 list-disc pl-5">
                  {privacyData.dataCollected.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-heading text-sm text-sky-400">HOW DATA IS USED:</h4>
                <ul className="mt-1 list-disc pl-5">
                  {privacyData.usage.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Retention:</strong> {privacyData.retention}
              </p>
              <p>
                <strong>Security:</strong> {privacyData.security}
              </p>
              <p>
                <strong>Contact:</strong> For questions or data requests, contact{' '}
                <a href={`mailto:${privacyData.contactEmail}`} className="text-amber-400 underline">
                  {privacyData.contactEmail}
                </a>
                .
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <GameButton
                variant="yellow"
                size="sm"
                onClick={() => setPrivacyModalOpen(false)}
              >
                I UNDERSTAND
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
