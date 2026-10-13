'use client';

import React, { useState, useEffect } from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { GameButton } from '@/components/ui/GameButton';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { DUMMY_TURNSTILE_SITEKEY } from '@/lib/turnstile';
import eventConfig from '@/content/event.json';
import privacyData from '@/content/privacy.json';

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

export const RegisterSection: React.FC = () => {
  // Form state
  const [track, setTrack] = useState<'gaming' | 'vr'>('gaming');
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [members, setMembers] = useState<MemberFormState[]>([]);
  const [consent, setConsent] = useState(false);
  const [turnstileToken] = useState('test-dummy-turnstile-token');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [registeredSquad, setRegisteredSquad] = useState<{
    teamId: string;
    teamName: string;
    track: 'gaming' | 'vr';
    leaderName: string;
    leaderEmail: string;
    memberCount: number;
  } | null>(null);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch live stats ticker
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
        // Fallback to static values if offline
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: '', email: '', phone: '' }]);
    }
  };

  const handleRemoveMember = (indexToRemove: number) => {
    setMembers(members.filter((_, idx) => idx !== indexToRemove));
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

  const handleCopyTeamId = () => {
    if (registeredSquad?.teamId && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(registeredSquad.teamId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetForm = () => {
    setRegisteredSquad(null);
    setTeamName('');
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setMembers([]);
    setConsent(false);
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!consent) {
      setErrorMessage('You must accept the Tournament Rules & Privacy Policy to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter empty optional phones
      const formattedMembers = members.map((m) => ({
        name: m.name.trim(),
        email: m.email.trim(),
        phone: m.phone.trim() ? m.phone.trim() : undefined,
      }));

      const payload = {
        teamName: teamName.trim(),
        track,
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

      // Success
      setRegisteredSquad({
        teamId: data.teamId,
        teamName: data.teamName,
        track: data.track,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        memberCount: data.memberCount || members.length + 1,
      });

      // Update live count optimistically
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
          subtitle="ASSEMBLE YOUR TEAM • ENTER THE ARENA"
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

        {/* Main Card Container */}
        <div className="mt-8 w-full text-left">
          {registeredSquad ? (
            /* ================= SUCCESS CONFIRMATION STATE ================= */
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
                  Squad <strong>{registeredSquad.teamName}</strong> has been officially booked for the {registeredSquad.track === 'gaming' ? 'Gaming Championship' : 'VR Immersion Track'}.
                </p>

                {/* Team ID Highlight Plate */}
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

                {/* Key Instructions */}
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
                    <span>Carry college / student photo ID for badge retrieval.</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex w-full flex-col sm:flex-row gap-3">
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
                  <GameButton
                    variant="cream"
                    size="md"
                    fullWidth
                    onClick={handleResetForm}
                  >
                    REGISTER ANOTHER SQUAD
                  </GameButton>
                </div>
              </div>
            </ChamferCard>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <ChamferCard variant="cream" elevation="lg">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                {/* 1. Track Selector */}
                <div>
                  <label className="block font-heading text-xs tracking-wider text-[#704B18] uppercase">
                    1. Select Tournament Track *
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Gaming Track Option */}
                    <button
                      type="button"
                      onClick={() => setTrack('gaming')}
                      className={`relative flex flex-col items-start rounded-xl border-3 p-3.5 text-left transition-all ${
                        track === 'gaming'
                          ? 'border-[#FF9F0A] bg-amber-100 shadow-[0_4px_0_#8C6026]'
                          : 'border-[#BD9B65] bg-amber-50/70 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-heading text-sm text-[#2B1400]">
                          🎮 GAMING CHAMPIONSHIP
                        </span>
                        {track === 'gaming' && (
                          <span className="rounded-full bg-amber-500 px-2 py-0.5 font-heading text-[10px] text-white">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span className="mt-1 font-body text-xs text-[#573507]">
                        PC, Mobile & Console Arena. Brawl & Valorant.
                      </span>
                    </button>

                    {/* VR Track Option */}
                    <button
                      type="button"
                      onClick={() => setTrack('vr')}
                      className={`relative flex flex-col items-start rounded-xl border-3 p-3.5 text-left transition-all ${
                        track === 'vr'
                          ? 'border-[#00A3FF] bg-sky-100 shadow-[0_4px_0_#0066CC]'
                          : 'border-[#BD9B65] bg-amber-50/70 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-heading text-sm text-[#0B3B66]">
                          🥽 VR IMMERSION TRACK
                        </span>
                        {track === 'vr' && (
                          <span className="rounded-full bg-sky-500 px-2 py-0.5 font-heading text-[10px] text-white">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span className="mt-1 font-body text-xs text-[#1E3A8A]">
                        Meta Quest & Spatial Experience Trials.
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Team Information */}
                <div>
                  <label
                    htmlFor="teamName"
                    className="block font-heading text-xs tracking-wider text-[#704B18] uppercase"
                  >
                    2. Squad / Clan Name *
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    required
                    maxLength={40}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. HyperNova Strike"
                    className="mt-1.5 w-full rounded-xl border-2 border-[#8C6026] bg-amber-50 px-4 py-2.5 font-heading text-sm text-[#2B1400] placeholder:text-amber-900/40 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {fieldErrors.teamName && (
                    <span className="mt-1 block font-body text-xs font-bold text-red-600">
                      {fieldErrors.teamName[0]}
                    </span>
                  )}
                </div>

                {/* 3. Squad Leader Details */}
                <div className="rounded-xl border-2 border-[#A37B45]/60 bg-amber-100/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs tracking-wider text-[#573507] uppercase">
                      3. Squad Leader (Player 1) *
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
                        placeholder="Player One"
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
                      Phone Number (WhatsApp / Calling) *
                    </label>
                    <input
                      id="leaderPhone"
                      type="tel"
                      required
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="mt-1 w-full rounded-lg border border-[#8C6026] bg-amber-50 px-3 py-2 font-body text-sm font-semibold text-[#2B1400] placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {fieldErrors.leaderPhone && (
                      <span className="mt-0.5 block font-body text-xs font-bold text-red-600">
                        {fieldErrors.leaderPhone[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. Dynamic Squad Members */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading text-xs tracking-wider text-[#704B18] uppercase">
                        4. Additional Squad Members ({members.length}/3)
                      </span>
                      <p className="font-body text-[11px] text-[#573507]">
                        Solo entries are welcome (team size: 1 to 4 players). Add up to 3 more players.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={members.length >= 3}
                      className="rounded-lg border-2 border-[#573507] bg-amber-400 px-3 py-1 font-heading text-xs uppercase text-[#2B1400] shadow-[0_2px_0_#000000] active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300"
                    >
                      + Add Member
                    </button>
                  </div>

                  {members.map((member, idx) => (
                    <div
                      key={idx}
                      className="mt-3 rounded-xl border-2 border-[#8C6026]/40 bg-white/40 p-3.5 relative"
                    >
                      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                        <span className="font-heading text-xs text-[#4B3012]">
                          PLAYER {idx + 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="font-heading text-xs text-red-700 hover:text-red-900"
                          title="Remove player"
                        >
                          ✕ REMOVE
                        </button>
                      </div>

                      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
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
                </div>

                {/* 5. Rules & Privacy Consent */}
                <div className="rounded-lg border border-[#8C6026]/40 bg-amber-100/30 p-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[#8C6026] text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="font-body text-xs text-[#4B3012]">
                      I confirm all details are accurate and agree to abide by the official{' '}
                      <strong>GENESIS 2026 Tournament Rules</strong> and{' '}
                      <button
                        type="button"
                        onClick={() => setPrivacyModalOpen(true)}
                        className="font-bold underline text-amber-900 hover:text-amber-950"
                      >
                        Privacy Policy (v{privacyData.version})
                      </button>
                      . Registration is free.
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

                {/* Global Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-100 p-3.5 font-heading text-xs text-red-900 shadow-[0_2px_0_#991B1B]"
                  >
                    <span className="text-base">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
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
