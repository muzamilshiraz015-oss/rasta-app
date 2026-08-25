export type ProgramStatus =
  | "Not Started"
  | "Researching"
  | "In Progress"
  | "Submitted"
  | "Interview"
  | "Result";

export const PROGRAM_STATUSES: ProgramStatus[] = [
  "Not Started",
  "Researching",
  "In Progress",
  "Submitted",
  "Interview",
  "Result",
];

export type Priority = "High" | "Medium" | "Low";
export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export type Funding = "Fully Funded" | "Partial" | "Unknown";
export const FUNDINGS: Funding[] = ["Fully Funded", "Partial", "Unknown"];

export interface Program {
  id: string;
  name: string;
  country: string;
  degree: string;
  funding: Funding;
  opensAt: string;
  closesAt: string;
  status: ProgramStatus;
  priority: Priority;
  notes: string;
  docIds: string[];
}

export type DocStatus =
  | "Not Started"
  | "Requested"
  | "In Progress"
  | "Attested"
  | "Completed";

export const DOC_STATUSES: DocStatus[] = [
  "Not Started",
  "Requested",
  "In Progress",
  "Attested",
  "Completed",
];

export type DocCategory =
  | "Academic"
  | "Attestation"
  | "Test Score"
  | "Certificate"
  | "Letter"
  | "Legal";

export const DOC_CATEGORIES: DocCategory[] = [
  "Academic",
  "Attestation",
  "Test Score",
  "Certificate",
  "Letter",
  "Legal",
];

export interface DocItem {
  id: string;
  name: string;
  group: string;
  category: DocCategory;
  status: DocStatus;
  notes: string;
  dueDate: string;
  fileRef: string;
  /** id of the parent document this attestation step belongs to */
  parentId?: string;
  /** position within an ordered attestation chain (1-based) */
  chainStep?: number;
  /** IELTS-style score tracking */
  scoreTarget?: string;
  scoreCurrent?: string;
  testDate?: string;
}

export interface SopDraft {
  id: string;
  title: string;
  programId: string | null;
  content: string;
  updatedAt: string;
}

export interface RastaData {
  programs: Program[];
  documents: DocItem[];
  sops: SopDraft[];
}
