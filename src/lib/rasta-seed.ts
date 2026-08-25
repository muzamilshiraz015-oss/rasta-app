import type { DocItem, Program, RastaData } from "./rasta-types";

const doc = (d: Partial<DocItem> & { id: string; name: string; group: string }): DocItem => ({
  category: "Academic",
  status: "Not Started",
  notes: "",
  dueDate: "",
  fileRef: "",
  ...d,
});

export const SEED_DOCUMENTS: DocItem[] = [
  // SSC
  doc({ id: "ssc-dmc", name: "SSC (Matric) DMC — Detailed Marks Certificate", group: "SSC (Matric) Documents" }),
  doc({ id: "ssc-cert", name: "SSC (Matric) Certificate", group: "SSC (Matric) Documents" }),
  doc({
    id: "ssc-att-1",
    name: "Attestation Step 1: BISE Peshawar",
    group: "SSC (Matric) Documents",
    category: "Attestation",
    parentId: "ssc-cert",
    chainStep: 1,
  }),
  doc({
    id: "ssc-att-2",
    name: "Attestation Step 2: IBCC Federal",
    group: "SSC (Matric) Documents",
    category: "Attestation",
    parentId: "ssc-cert",
    chainStep: 2,
  }),
  // HSSC
  doc({ id: "hssc-dmc", name: "HSSC (Intermediate) DMC — Detailed Marks Certificate", group: "HSSC (Intermediate) Documents" }),
  doc({ id: "hssc-cert", name: "HSSC (Intermediate) Certificate", group: "HSSC (Intermediate) Documents" }),
  doc({
    id: "hssc-att-1",
    name: "Attestation Step 1: BISE Peshawar",
    group: "HSSC (Intermediate) Documents",
    category: "Attestation",
    parentId: "hssc-cert",
    chainStep: 1,
  }),
  doc({
    id: "hssc-att-2",
    name: "Attestation Step 2: IBCC Federal",
    group: "HSSC (Intermediate) Documents",
    category: "Attestation",
    parentId: "hssc-cert",
    chainStep: 2,
  }),
  // BS
  doc({ id: "bs-transcript", name: "BS Transcript", group: "BS Documents" }),
  doc({ id: "bs-degree", name: "BS Degree", group: "BS Documents" }),
  doc({
    id: "bs-att-1",
    name: "Attestation Step 1: Same University (IM Sciences)",
    group: "BS Documents",
    category: "Attestation",
    parentId: "bs-degree",
    chainStep: 1,
  }),
  doc({
    id: "bs-att-2",
    name: "Attestation Step 2: HEC (Higher Education Commission)",
    group: "BS Documents",
    category: "Attestation",
    parentId: "bs-degree",
    chainStep: 2,
  }),
  // Final layer
  doc({
    id: "final-mofa",
    name: "Verification from MOFA (Ministry of Foreign Affairs)",
    group: "Final Attestation Layer",
    category: "Legal",
    chainStep: 1,
    notes: "Only after IBCC + HEC attestation are complete.",
  }),
  doc({
    id: "final-notary",
    name: "Notary Public",
    group: "Final Attestation Layer",
    category: "Legal",
    chainStep: 2,
  }),
  // English
  doc({
    id: "eng-cert",
    name: "English Proficiency Certificate (from university)",
    group: "English Proficiency",
    category: "Certificate",
  }),
  doc({
    id: "ielts",
    name: "IELTS",
    group: "English Proficiency",
    category: "Test Score",
    scoreTarget: "7.0",
    scoreCurrent: "",
    testDate: "",
    notes: "Target band 7 (Fulbright). Verify DAAD / Erasmus requirements per program.",
  }),
  // LORs
  doc({ id: "lor-1", name: "LOR 1 — from Chairman", group: "Recommendation Letters", category: "Letter" }),
  doc({ id: "lor-2", name: "LOR 2 — from Supervisor", group: "Recommendation Letters", category: "Letter" }),
  // Other
  doc({ id: "cert-character", name: "Character Certificate", group: "Other Certificates", category: "Certificate" }),
  doc({ id: "cert-course", name: "Course Completion Certificate", group: "Other Certificates", category: "Certificate" }),
  doc({ id: "cert-police", name: "Police Clearance Certificate", group: "Other Certificates", category: "Legal" }),
  doc({ id: "cert-medical", name: "Medical Certificate", group: "Other Certificates", category: "Certificate" }),
];

const program = (id: string, name: string, country: string): Program => ({
  id,
  name,
  country,
  degree: "",
  funding: "Fully Funded",
  opensAt: "",
  closesAt: "",
  status: "Not Started",
  priority: "Medium",
  notes: "",
  docIds: [],
});

export const SEED_PROGRAMS: Program[] = [
  program("fulbright", "Fulbright", "United States"),
  program("daad-epos", "DAAD EPOS", "Germany"),
  program("erasmus-mundus", "Erasmus Mundus", "European Union"),
  program("csc-china", "CSC China", "China"),
];

export const SEED_DATA: RastaData = {
  programs: SEED_PROGRAMS,
  documents: SEED_DOCUMENTS,
  sops: [],
};

export const DOC_GROUP_ORDER = [
  "SSC (Matric) Documents",
  "HSSC (Intermediate) Documents",
  "BS Documents",
  "Final Attestation Layer",
  "English Proficiency",
  "Recommendation Letters",
  "Other Certificates",
];
