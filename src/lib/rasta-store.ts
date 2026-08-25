import { useCallback, useSyncExternalStore } from "react";
import { SEED_DATA } from "./rasta-seed";
import type { DocItem, Program, RastaData, SopDraft } from "./rasta-types";

const KEY = "rasta:data:v1";

let state: RastaData = SEED_DATA;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load(): RastaData {
  if (typeof window === "undefined") return SEED_DATA;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED_DATA;
    const parsed = JSON.parse(raw) as Partial<RastaData>;
    return {
      programs: parsed.programs ?? SEED_DATA.programs,
      documents: parsed.documents ?? SEED_DATA.documents,
      sops: parsed.sops ?? [],
    };
  } catch {
    return SEED_DATA;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = load();
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SEED_DATA;
}

function set(updater: (prev: RastaData) => RastaData) {
  state = updater(state);
  persist();
  emit();
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function useRasta() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addProgram = useCallback((p: Omit<Program, "id">) => {
    set((s) => ({ ...s, programs: [...s.programs, { ...p, id: uid() }] }));
  }, []);

  const updateProgram = useCallback((id: string, patch: Partial<Program>) => {
    set((s) => ({
      ...s,
      programs: s.programs.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removeProgram = useCallback((id: string) => {
    set((s) => ({
      ...s,
      programs: s.programs.filter((p) => p.id !== id),
      sops: s.sops.map((d) => (d.programId === id ? { ...d, programId: null } : d)),
    }));
  }, []);

  const addDocument = useCallback((d: Omit<DocItem, "id">) => {
    set((s) => ({ ...s, documents: [...s.documents, { ...d, id: uid() }] }));
  }, []);

  const updateDocument = useCallback((id: string, patch: Partial<DocItem>) => {
    set((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const removeDocument = useCallback((id: string) => {
    set((s) => ({
      ...s,
      documents: s.documents.filter((d) => d.id !== id && d.parentId !== id),
      programs: s.programs.map((p) => ({ ...p, docIds: p.docIds.filter((x) => x !== id) })),
    }));
  }, []);

  const upsertSop = useCallback((draft: SopDraft) => {
    set((s) => ({
      ...s,
      sops: s.sops.some((d) => d.id === draft.id)
        ? s.sops.map((d) => (d.id === draft.id ? draft : d))
        : [...s.sops, draft],
    }));
  }, []);

  const removeSop = useCallback((id: string) => {
    set((s) => ({ ...s, sops: s.sops.filter((d) => d.id !== id) }));
  }, []);

  const resetAll = useCallback(() => set(() => SEED_DATA), []);

  return {
    ...data,
    addProgram,
    updateProgram,
    removeProgram,
    addDocument,
    updateDocument,
    removeDocument,
    upsertSop,
    removeSop,
    resetAll,
  };
}

/* ---------- derived helpers ---------- */

export function isDocDone(d: DocItem) {
  return d.status === "Completed" || d.status === "Attested";
}

export function readiness(documents: DocItem[]) {
  if (documents.length === 0) return 0;
  return Math.round((documents.filter(isDocDone).length / documents.length) * 100);
}

export function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export interface TimelineEntry {
  id: string;
  label: string;
  sub: string;
  date: string;
  kind: "program" | "document";
}

export function buildTimeline(data: RastaData): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  data.programs.forEach((p) => {
    if (p.closesAt)
      entries.push({
        id: `p-${p.id}`,
        label: `${p.name} — deadline`,
        sub: [p.country, p.status].filter(Boolean).join(" · "),
        date: p.closesAt,
        kind: "program",
      });
    if (p.opensAt)
      entries.push({
        id: `po-${p.id}`,
        label: `${p.name} — window opens`,
        sub: p.country,
        date: p.opensAt,
        kind: "program",
      });
  });
  data.documents.forEach((d) => {
    if (d.dueDate && !isDocDone(d))
      entries.push({
        id: `d-${d.id}`,
        label: d.name,
        sub: `${d.group} · ${d.status}`,
        date: d.dueDate,
        kind: "document",
      });
  });
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function nextAction(data: RastaData) {
  const chainReady = (d: DocItem) => {
    if (!d.chainStep || d.chainStep === 1) return true;
    const prior = data.documents.filter(
      (x) => x.group === d.group && x.parentId === d.parentId && (x.chainStep ?? 0) < d.chainStep!,
    );
    return prior.every(isDocDone);
  };

  const candidates = data.documents.filter((d) => !isDocDone(d) && chainReady(d));
  const withDue = candidates
    .filter((d) => d.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const pick = withDue[0] ?? candidates[0];
  if (!pick) return null;
  return pick;
}
