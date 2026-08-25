import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, PageHeader, Pill, ProgressBar, inputClass } from "@/components/rasta-ui";
import { daysUntil, formatDate, isDocDone, useRasta } from "@/lib/rasta-store";
import {
  FUNDINGS,
  PRIORITIES,
  PROGRAM_STATUSES,
  type Funding,
  type Priority,
  type Program,
  type ProgramStatus,
} from "@/lib/rasta-types";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs Tracker — Rasta" },
      {
        name: "description",
        content:
          "Track Fulbright, DAAD EPOS, Erasmus Mundus, CSC China and more: windows, status, priority and linked requirements.",
      },
      { property: "og:title", content: "Programs Tracker — Rasta" },
      {
        property: "og:description",
        content: "Scholarship programs with application windows, status and linked document checklists.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { programs, documents, addProgram, updateProgram, removeProgram } = useRasta();
  const [open, setOpen] = useState<string | null>(null);

  const priorityTone = (p: Priority) => (p === "High" ? "brass" : p === "Medium" ? "info" : "muted");

  return (
    <div>
      <PageHeader
        eyebrow="Programs"
        title="Scholarship programs"
        description="Application windows, status and the documents each one needs."
        action={
          <button
            onClick={() =>
              addProgram({
                name: "New program",
                country: "",
                degree: "",
                funding: "Fully Funded",
                opensAt: "",
                closesAt: "",
                status: "Not Started",
                priority: "Medium",
                notes: "",
                docIds: [],
              })
            }
            className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add program
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {programs.map((p) => {
          const linked = documents.filter((d) => p.docIds.includes(d.id));
          const pct = linked.length
            ? Math.round((linked.filter(isDocDone).length / linked.length) * 100)
            : 0;
          const dLeft = daysUntil(p.closesAt);
          const editing = open === p.id;

          return (
            <article key={p.id} className="ledger-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl leading-tight">{p.name || "Untitled"}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[p.country, p.degree].filter(Boolean).join(" · ") || "Country · degree level"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Pill tone={priorityTone(p.priority)}>{p.priority}</Pill>
                  <Pill>{p.funding}</Pill>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pill tone="brass">{p.status}</Pill>
                <span className="text-xs text-muted-foreground">
                  {formatDate(p.opensAt)} → {formatDate(p.closesAt)}
                </span>
                {dLeft !== null && dLeft >= 0 ? (
                  <span className="text-xs text-primary">{dLeft} days left</span>
                ) : null}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Requirements {linked.filter(isDocDone).length}/{linked.length}
                  </span>
                  <span>{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mt-2" />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setOpen(editing ? null : p.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {editing ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => removeProgram(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>

              {editing ? (
                <div className="mt-5 space-y-4 border-t border-border/70 pt-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name">
                      <input
                        className={inputClass}
                        value={p.name}
                        onChange={(e) => updateProgram(p.id, { name: e.target.value })}
                      />
                    </Field>
                    <Field label="Country">
                      <input
                        className={inputClass}
                        value={p.country}
                        onChange={(e) => updateProgram(p.id, { country: e.target.value })}
                      />
                    </Field>
                    <Field label="Degree level">
                      <input
                        className={inputClass}
                        placeholder="MS / PhD"
                        value={p.degree}
                        onChange={(e) => updateProgram(p.id, { degree: e.target.value })}
                      />
                    </Field>
                    <Field label="Funding">
                      <select
                        className={inputClass}
                        value={p.funding}
                        onChange={(e) => updateProgram(p.id, { funding: e.target.value as Funding })}
                      >
                        {FUNDINGS.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Window opens">
                      <input
                        type="date"
                        className={inputClass}
                        value={p.opensAt}
                        onChange={(e) => updateProgram(p.id, { opensAt: e.target.value })}
                      />
                    </Field>
                    <Field label="Window closes">
                      <input
                        type="date"
                        className={inputClass}
                        value={p.closesAt}
                        onChange={(e) => updateProgram(p.id, { closesAt: e.target.value })}
                      />
                    </Field>
                    <Field label="Status">
                      <select
                        className={inputClass}
                        value={p.status}
                        onChange={(e) =>
                          updateProgram(p.id, { status: e.target.value as ProgramStatus })
                        }
                      >
                        {PROGRAM_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Priority">
                      <select
                        className={inputClass}
                        value={p.priority}
                        onChange={(e) =>
                          updateProgram(p.id, { priority: e.target.value as Priority })
                        }
                      >
                        {PRIORITIES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Notes">
                    <textarea
                      className={inputClass + " min-h-24"}
                      value={p.notes}
                      onChange={(e) => updateProgram(p.id, { notes: e.target.value })}
                    />
                  </Field>

                  <RequirementPicker program={p} />
                </div>
              ) : p.notes ? (
                <p className="mt-4 border-t border-border/70 pt-4 text-sm text-muted-foreground">
                  {p.notes}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function RequirementPicker({ program }: { program: Program }) {
  const { documents, updateProgram } = useRasta();
  const toggle = (id: string) => {
    const next = program.docIds.includes(id)
      ? program.docIds.filter((x) => x !== id)
      : [...program.docIds, id];
    updateProgram(program.id, { docIds: next });
  };

  return (
    <div>
      <p className="mb-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        Linked requirements
      </p>
      <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-border/70 p-2">
        {documents.map((d) => (
          <label
            key={d.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <input
              type="checkbox"
              className="accent-primary"
              checked={program.docIds.includes(d.id)}
              onChange={() => toggle(d.id)}
            />
            <span className={isDocDone(d) ? "text-primary" : "text-foreground"}>{d.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
