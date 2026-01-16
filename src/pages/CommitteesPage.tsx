// CommitteesPage.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { CommitteesService } from '@/services/CommitteesService';
import type {
  Committee,
  CommitteeRole,
  Person,
  CommitteeColor,
} from '@/services/CommitteesService';

import Navbar from '@/components/Navbar';

type TabKey = 'tab1' | 'tab2';

function colorTextClass(color: CommitteeColor) {
  return {
    indigo: 'text-indigo-700',
    teal: 'text-teal-700',
    sky: 'text-sky-700',
    rose: 'text-rose-700',
  }[color];
}

function colorBorderClass(color: CommitteeColor) {
  return {
    indigo: 'border-indigo-100',
    teal: 'border-teal-100',
    sky: 'border-sky-100',
    rose: 'border-rose-100',
  }[color];
}

function ringFocusClass(color: CommitteeColor) {
  return {
    indigo: 'focus-visible:ring-2 focus-visible:ring-indigo-400',
    teal: 'focus-visible:ring-2 focus-visible:ring-teal-400',
    sky: 'focus-visible:ring-2 focus-visible:ring-sky-400',
    rose: 'focus-visible:ring-2 focus-visible:ring-rose-400',
  }[color];
}

function rolePillClasses(color: CommitteeColor) {
  const base = 'px-3 py-1.5 rounded-full border cursor-pointer transition focus-within:ring-2';
  const byColor: Record<CommitteeColor, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 focus-within:ring-indigo-400',
    teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 focus-within:ring-teal-400',
    sky: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 focus-within:ring-sky-400',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 focus-within:ring-rose-400',
  };
  return `${base} ${byColor[color]}`;
}

function tabUnderlineClasses(tab: TabKey, color: CommitteeColor) {
  if (tab !== 'tab1') return '';
  return {
    indigo: 'border-b-2 text-indigo-600 border-indigo-500',
    teal: 'border-b-2 text-teal-600 border-teal-500',
    sky: 'border-b-2 text-sky-600 border-sky-500',
    rose: 'border-b-2 text-rose-600 border-rose-500',
  }[color];
}

function tabUnderlineClasses2(tab: TabKey, color: CommitteeColor) {
  if (tab !== 'tab2') return '';
  return {
    indigo: 'border-b-2 text-indigo-600 border-indigo-500',
    teal: 'border-b-2 text-teal-600 border-teal-500',
    sky: 'border-b-2 text-sky-600 border-sky-500',
    rose: 'border-b-2 text-rose-600 border-rose-500',
  }[color];
}

export default function CommitteesPage() {
  // Committees page state
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal state
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('tab1');
  const [selectedRole, setSelectedRole] = useState<CommitteeRole | null>(null);
  const [selectedCommitteeColor, setSelectedCommitteeColor] = useState<CommitteeColor | null>(null);

  // Members state for selected role
  const [members, setMembers] = useState<Person[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setErrorMsg(null);
    CommitteesService.getCommittees()
      .then((data) => setCommittees(data))
      .catch((err) => {
        console.error('Error loading committees', err);
        setErrorMsg('Failed to load committees. Please try again later.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loadMembers = useCallback((roleId: number) => {
    setIsMembersLoading(true);
    setMembersError(null);
    CommitteesService.getMembers(roleId)
      .then((data) => {
        setMembers(data);
        // console.log(data);
      })
      .catch((err) => {
        console.error('Failed to load members', err);
        setMembersError('Could not load members. Please try again later.');
      })
      .finally(() => setIsMembersLoading(false));
  }, []);

  const openRolesModal = useCallback((role: CommitteeRole, color: CommitteeColor) => {
    setSelectedRole(role);
    setSelectedCommitteeColor(color);
    setActiveTab('tab1');
    setShowRolesModal(true);
    loadMembers(role.id);
  }, [loadMembers]);

  const closeRolesModal = useCallback(() => {
    setSelectedRole(null);
    setSelectedCommitteeColor(null);
    setShowRolesModal(false);
    setMembers([]);
    setMembersError(null);
    setIsMembersLoading(false);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    if (!showRolesModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRolesModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showRolesModal, closeRolesModal]);

  const headerColorClass = useMemo(
    () =>
      selectedCommitteeColor
        ? {
            indigo: 'text-indigo-800',
            teal: 'text-teal-800',
            sky: 'text-sky-800',
            rose: 'text-rose-800',
          }[selectedCommitteeColor]
        : '',
    [selectedCommitteeColor]
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-10">
      <header className="mx-auto max-w-5xl text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-indigo-700">Tribunal Committees</h1>
        <p className="text-gray-600 mt-3 md:text-lg">
          Browse each committee and the roles under it. Tap a role to learn more!
        </p>
      </header>

      {/* Top nav quick-jumps */}
      <nav className="mx-auto max-w-5xl flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
        {committees.map((c) => (
          <a
            key={c.id}
            href={`/committees#${c.id}`}
            className={`px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-800 hover:shadow-md hover:-translate-y-px transition focus:outline-none ${ringFocusClass(c.color)}`}
          >
            {c.title}
          </a>
        ))}
      </nav>

      {/* Loading + error for committees */}
      {isLoading && (
        <div className="mx-auto max-w-5xl text-center text-gray-600 mb-6">Loading committees…</div>
      )}
      {errorMsg && (
        <div className="mx-auto max-w-5xl text-center text-red-600 mb-6">{errorMsg}</div>
      )}

      {/* Committees grid */}
      <section className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
        {committees.map((committee) => (
          <article
            id={committee.id}
            key={committee.id}
            className={`rounded-2xl bg-white border shadow-sm hover:shadow-md transition p-6 ${colorBorderClass(committee.color)}`}
          >
            <header>
              <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${colorTextClass(committee.color)}`}>
                {committee.title}
              </h2>
              {committee.subtitle && <p className="text-gray-600 mt-1">{committee.subtitle}</p>}
            </header>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {committee.roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={rolePillClasses(committee.color)}
                    onClick={() => openRolesModal(role, committee.color)}
                  >
                    {role.role}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Modal */}
      {showRolesModal && (
        <div
          className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(5px)' }}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // close when clicking backdrop only (ignore clicks inside panel)
            if (e.target === e.currentTarget) closeRolesModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close"
              onClick={closeRolesModal}
            >
              &times;
            </button>

            <h3 className={`text-lg font-semibold mb-4 ${headerColorClass}`}>
              {selectedRole?.role}
            </h3>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-semibold outline-none ${tabUnderlineClasses(activeTab, selectedCommitteeColor || 'indigo')}`}
                onClick={() => setActiveTab('tab1')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 font-semibold outline-none ${tabUnderlineClasses2(activeTab, selectedCommitteeColor || 'indigo')}`}
                onClick={() => setActiveTab('tab2')}
              >
                Details
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'tab1' && (
              <p className="text-gray-700">{selectedRole?.description}</p>
            )}

            {activeTab === 'tab2' && (
              <>
                {isMembersLoading && (
                  <div className="text-center text-gray-600">Loading members…</div>
                )}
                {membersError && (
                  <div className="text-center text-red-600">{membersError}</div>
                )}
                {!isMembersLoading && !membersError && (
                  <>
                    {members.length === 0 ? (
                      <div className="text-center text-gray-600">
                        No members found for this role.
                      </div>
                    ) : (
                      members.map((person, i) => (
                        <div
                          key={`${person.email}-${i}`}
                          className={`flex items-center gap-x-4 gap-y-8 mb-4 justify-center ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
                        >
                          {person.imgURL && (
                            <img
                              src={person.imgURL}
                              alt={person.name}
                              className="w-32 h-32 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h2 className="font-semibold text-gray-800">{person.name}</h2>
                            <p className="text-gray-600">{person.email}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </>
  );
}