# Rasta App

Lovable Prompt — Scholarship & Study Abroad Application Tracker

Copy-paste the block below directly into Lovable.

PROMPT START

Build a personal web app called "Rasta" (Urdu for "path/way") — a scholarship and study-abroad application tracker for a single user. Dark, premium, minimal aesthetic (think ink/parchment editorial style — deep charcoal background, warm off-white text, a single brass/gold accent color for highlights and progress). No sign-up/auth needed — single-user local app, all data stored in the browser (use localStorage), no backend.

Core Sections

1. Dashboard (Home)

Overview cards: total programs tracked, days until nearest deadline, documents completed vs total, overall readiness %

A visual timeline/calendar strip showing all upcoming deadlines across programs

A "Next Action" widget that surfaces the single most urgent incomplete task

2. Programs Tracker A list/kanban view of scholarship programs (e.g. Fulbright, DAAD EPOS, Erasmus Mundus, CSC China). Each program is a card with:

Name, country, degree level, funding type (fully funded / partial)

Application window (opens/closes date)

Status: Not Started / Researching / In Progress / Submitted / Interview / Result

A linked checklist of program-specific requirements (see Document Vault below — link documents to programs)

Notes field (free text)

Priority flag (High/Medium/Low)

Allow adding/editing/deleting programs freely. Pre-seed with these four: Fulbright, DAAD EPOS, Erasmus Mundus, CSC China — with empty fields ready to fill.

3. Document Vault This is the most important section. Track every required document as an individual item with:

Document name

Category tag (Academic / Attestation / Test Score / Certificate / Letter / Legal)

Status: Not Started / Requested / In Progress / Attested / Completed

Notes (e.g. "waiting on BISE Peshawar", "need to email Chairman for signature")

A due date if relevant

File attachment placeholder (name + description of the file — no actual file upload needed, just a text reference/link field for now, since this is a local-only app)

Pre-seed the Document Vault with this exact list, structured as a dependency chain where relevant (show attestation steps as sequential sub-items under the parent document, so the user sees Step 1 must complete before Step 2):

SSC (Matric) Documents

DMC (Detailed Marks Certificate)

Certificate

→ Attestation Step 1: BISE Peshawar

→ Attestation Step 2: IBCC Federal

HSSC (Intermediate) Documents

DMC (Detailed Marks Certificate)

Certificate

→ Attestation Step 1: BISE Peshawar

→ Attestation Step 2: IBCC Federal

BS Documents

Transcript

Degree

→ Attestation Step 1: Same University (IM Sciences)

→ Attestation Step 2: HEC (Higher Education Commission)

Final Attestation Layer (applies after HEC/IBCC attestation is done)

→ Verification from MOFA (Ministry of Foreign Affairs)

→ Notary Public

English Proficiency

English Proficiency Certificate (from university)

IELTS — target band 7 (add a field for current best score and test date)

Recommendation Letters

LOR 1 — from Chairman

LOR 2 — from Supervisor

Other Certificates

Character Certificate

Course Completion Certificate

Police Clearance Certificate

Medical Certificate

Add a visual "chain" indicator for the attestation sequences (SSC, HSSC, BS) — e.g. connected steps with a progress line, so it's visually obvious that Step 2 can't start before Step 1 is done, and that MOFA + Notary come after HEC/IBCC.

4. SOP / Essays Workspace A simple section to draft and version Statement of Purpose / essays per program:

One draft slot per program, with a textarea, word count, and last-edited timestamp

Ability to duplicate a draft as a starting point for a new program's version

5. Timeline / Deadlines View A calendar or vertical timeline showing every program deadline and every document due-date together, color-coded by type (program deadline = brass/gold, document task = muted blue).

Design Requirements

Font pairing: a serif display font for headings (e.g. Playfair Display or similar via Google Fonts), clean sans-serif for body text (e.g. Inter)

Dark charcoal/ink background (#1a1a1a range), warm parchment-white text (#f2ede3 range), brass/gold accent (#c9a44c range) for progress bars, active states, and key CTAs

Cards with subtle borders, generous padding, no harsh shadows — editorial/ledger feel, not generic SaaS

Progress bars and percentage completion should feel satisfying — smooth animations on update

Fully responsive — must work well on mobile since it'll be checked on the go

Data Persistence

Use localStorage to persist all programs, documents, and SOP drafts across sessions. No backend, no auth required.

Tone

This app is being built by a Computer Science student applying for fully-funded scholarships (Fulbright, DAAD, Erasmus Mundus) to build a better future for himself and his family. The tool should feel calm, organized, and motivating — not corporate or sterile.

PROMPT END

Notes for you (Muzamil) — not part of the Lovable prompt

I structured SSC/HSSC/BS as dependency chains because attestation order genuinely matters — BISE before IBCC, university before HEC, and MOFA/Notary come last after IBCC+HEC are both done. Getting this sequence wrong is one of the most common time-wasters in Pakistani scholarship applications.

IELTS 7 is pre-seeded as the Fulbright target since that's what Shehreyar shared — you'll want to double check DAAD/Erasmus specific score requirements once you shortlist actual programs, as they can differ.

Once this is built, we should sit down and actually fill in real deadlines for Fulbright, DAAD EPOS, and Erasmus Mundus — I can pull current cycle dates for you.

Next natural step after this app exists: draft your Fulbright SOP using the workspace section.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a3f223b-aa04-4b8d-a483-9d9bc73fb904).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
