'use client';

import React, { useState } from 'react';
import { Button3D } from '@/components/ui/Button3D';
import { Banner } from '@/components/ui/Banner';
import { Window } from '@/components/ui/Window';
import { Badge } from '@/components/ui/Badge';
import { Node } from '@/components/ui/Node';
import { InfoDot } from '@/components/ui/InfoDot';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { Accordion } from '@/components/ui/Accordion';
import { Wordmark } from '@/components/ui/Wordmark';

export default function StyleguidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const demoFaqs = [
    {
      q: 'Who can participate?',
      a: 'College students from any academic branch across India can team up and participate.',
    },
    {
      q: 'Is there a registration fee?',
      a: 'Registration is 100% free for all rounds of GENESIS 2026.',
    },
  ];

  return (
    <div className="min-h-screen bg-blue-screen bg-pattern-tile p-6 md:p-12 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <a href="/" className="px-4 py-2 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition">
          ← BACK HOME
        </a>
        <h1 className="text-2xl font-bold font-display">STYLEGUIDE</h1>
      </div>

      <main className="max-w-5xl mx-auto space-y-12 mt-8">
        {/* Wordmark */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40 text-center">
          <h2 className="text-xl font-bold mb-4 font-display text-white">GENESIS Wordmark</h2>
          <Wordmark size="large" />
        </section>

        {/* Buttons */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40">
          <h2 className="text-xl font-bold mb-6 font-display text-white">3D Buttons</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Button3D
              variant="yellow"
              className="w-[240px] h-[64px] text-xl"
              onClick={() => setToastVisible(true)}
            >
              REGISTER
            </Button3D>

            <Button3D variant="slate" className="w-[140px] h-[52px] text-base">
              SLATE TAB
            </Button3D>

            <Button3D variant="orange" className="w-[200px] h-[58px] text-lg">
              ORANGE BTN
            </Button3D>

            <Button3D variant="red-close" onClick={() => alert('Close clicked!')} />

            <Button3D variant="blue-mini" className="text-white font-bold">
              i
            </Button3D>
          </div>
        </section>

        {/* Banner */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40 text-center">
          <h2 className="text-xl font-bold mb-6 font-display text-white">Title Banners</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <Banner title="TIMELINE" />
            <Banner title="PRIZE POOL" />
            <Banner title="SPONSORS" />
          </div>
        </section>

        {/* Badges */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40">
          <h2 className="text-xl font-bold mb-6 font-display text-white">Prize Badges</h2>
          <div className="flex flex-wrap items-center justify-around gap-6">
            <Badge rank={1} amount={17500} />
            <Badge rank={2} amount={15000} />
            <Badge rank={3} amount={12500} />
          </div>
        </section>

        {/* Nodes and Dots */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40">
          <h2 className="text-xl font-bold mb-6 font-display text-white">Nodes & Info Dots</h2>
          <div className="flex items-center gap-6">
            <Node number={1} />
            <Node number={2} isActive={true} />
            <Node number={3} />
            <Node number={4} />
            <InfoDot onClick={() => setModalOpen(true)} />
          </div>
        </section>

        {/* Windows and Accordion */}
        <section className="space-y-6">
          <Window title="SAMPLE GAME WINDOW">
            <p className="font-body text-base mb-4">
              This is a standard collapsible game window with a bevel strip and custom body styling.
            </p>
            <Accordion items={demoFaqs} />
          </Window>
        </section>

        {/* Interactive Modals and Toast */}
        <section className="bg-panel-body/60 p-6 rounded-lg border border-black/40 flex gap-4">
          <Button3D variant="yellow" className="px-6 py-3" onClick={() => setModalOpen(true)}>
            Open Sample Modal
          </Button3D>
          <Button3D variant="slate" className="px-6 py-3" onClick={() => setToastVisible(true)}>
            Trigger Toast
          </Button3D>
        </section>
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="STAGE DETAILS">
        <div className="space-y-4">
          <p className="font-body text-base">
            Detailed information about this hackathon stage goes inside this modal dialog window.
          </p>
          <Button3D variant="yellow" className="w-full py-3" onClick={() => setModalOpen(false)}>
            GOT IT!
          </Button3D>
        </div>
      </Modal>

      <Toast
        message="Registrations opening soon!"
        isVisible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </div>
  );
}
