import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Lock, Plus, Trash2 } from "lucide-react";
import { Field, PageHeader, Pill, ProgressBar, inputClass } from "@/components/rasta-ui";
import { DOC_GROUP_ORDER } from "@/lib/rasta-seed";
import { formatDate, isDocDone, readiness, useRasta } from "@/lib/rasta-store";
import {
  DOC_CATEGORIES,
  DOC_STATUSES,
  type DocCategory,
  type DocItem,
  type DocStatus,
} from "@/lib/rasta-types";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Vault — Rasta" },
      {
        name: "description",
        content:
          "Every degree, DMC, attestation step and certificate in order: BISE → IBCC, university → HEC, then MOFA and Notary.",
      },
      { property: "og:title", content: "Document Vault — Rasta" },
      {
        property: "og:description",
        content: "Attestation chains, test scores and letters tracked step by step.",
      },
    ],
  }),
  component: DocumentsPage,
});

function statusTone(s: DocStatus) {
  if (s === "Completed") return "brass" as const;
  if (s === "Attested") return "brass" as const;
  if (s === "In Progress" || s === "Requested") return "info" as const;
  return "muted" as const;
}

function DocRow({
  d,
  locked,
  step,
}: {
  d: DocItem;
  locked?: boolean;
  step?: number;
}) {
  const { updateDocument, removeDocument } = useRasta();
  const [open, setOpen] = useState(false);
  const done = isDocDone(d);

  return (
    <div
      className={
        "rounded-lg border px-3 py-3 transition-colors " +
        (done ? "border-primary/40 bg-primary/5" : "border-border/70")
      }
    >
      <div className="flex items-start gap-3">
        {step ? (
          <span
            className={
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] " +
              (done
                ? "border-primary bg-primary text-primary-foreground"
                : locked
                  ? "border-border text-muted-foreground"
                  : "border-primary/60 text-primary")
            }
          >
            {done ? <Check className="h-3.5 w-3.5" /> : locked ? <Lock className="h-3 w-3" /> : step}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={"text-sm " + (done ? "text-primary" : "text-foreground")}>{d.name}</p>
            <Pill tone={statusTone(d.status)}>{d.status}</Pill>
            <Pill>{d.category}</Pill>
            {locked && !done ? (
              <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                waiting on previous step
              </span>
            ) : null}
          </div>
          {d.notes && !open ? (
            <p className="mt-1 text-xs text-muted-foreground">{d.notes}</p>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-3 text-[0.7rem] text-muted-foreground">
            {d.dueDate ? <span>Due {formatDate(d.dueDate)}</span> : null}
            {d.fileRef ? <span>File: {d.fileRef}</span> : null}
            {d.scoreTarget ? (
              <span>
                Target {d.scoreTarget}
                {d.scoreCurrent ? ` · best ${d.scoreCurrent}` : ""}
                {d.testDate ? ` · test ${formatDate(d.testDate)}` : ""}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <select
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary/70"
            value={d.status}
            onChange={(e) => updateDocument(d.id, { status: e.target.value as DocStatus })}
          >
            {DOC_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              value={d.name}
              onChange={(e) => updateDocument(d.id, { name: e.target.value })}
            />
          </Field>
          <Field label="Category">
            <select
              className={inputClass}
              value={d.category}
              onChange={(e) => updateDocument(d.id, { category: e.target.value as DocCategory })}
            >
              {DOC_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input
              type="date"
              className={inputClass}
              value={d.dueDate}
              onChange={(e) => updateDocument(d.id, { dueDate: e.target.value })}
            />
          </Field>
          <Field label="File reference / link">
            <input
              className={inputClass}
              placeholder="scan_ssc_dmc.pdf — Drive folder"
              value={d.fileRef}
              onChange={(e) => updateDocument(d.id, { fileRef: e.target.value })}
            />
          </Field>
          {d.category === "Test Score" || d.scoreTarget !== undefined ? (
            <>
              <Field label="Target score">
                <input
                  className={inputClass}
                  value={d.scoreTarget ?? ""}
                  onChange={(e) => updateDocument(d.id, { scoreTarget: e.target.value })}
                />
              </Field>
              <Field label="Current best score">
                <input
                  className={inputClass}
                  value={d.scoreCurrent ?? ""}
                  onChange={(e) => updateDocument(d.id, { scoreCurrent: e.target.value })}
                />
              </Field>
              <Field label="Test date">
                <input
                  type="date"
                  className={inputClass}
                  value={d.testDate ?? ""}
                  onChange={(e) => updateDocument(d.id, { testDate: e.target.value })}
                />
              </Field>
            </>
          ) : null}
          <div className="sm:col-span-2">
            <Field label="Notes">
              <textarea
                className={inputClass + " min-h-20"}
                placeholder="waiting on BISE Peshawar…"
                value={d.notes}
                onChange={(e) => updateDocument(d.id, { notes: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={() => removeDocument(d.id)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete document
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Chain({ steps }: { steps: DocItem[] }) {
  const ordered = [...steps].sort((a, b) => (a.chainStep ?? 0) - (b.chainStep ?? 0));
  const doneCount = ordered.filter(isDocDone).length;
  const pct = ordered.length ? (doneCount / ordered.length) * 100 : 0;

  return (
    <div className="relative mt-3 pl-4">
      <span className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      <span
        className="brass-bar absolute left-[7px] top-2 w-px"
        style={{ height: `calc(${pct}% - 0.5rem)` }}
      />
      <div className="space-y-2">
        {ordered.map((s, i) => (
          <DocRow
            key={s.id}
            d={s}
            step={s.chainStep ?? i + 1}
            locked={i > 0 && !isDocDone(ordered[i - 1]!)}
          />
        ))}
      </div>
    </div>
  );
}

function DocumentsPage() {
  const { documents, addDocument } = useRasta();
  const pct = readiness(documents);

  const groups = useMemo(() => {
    const names = [
      ...DOC_GROUP_ORDER.filter((g) => documents.some((d) => d.group === g)),
      ...[...new Set(documents.map((d) => d.group))].filter((g) => !DOC_GROUP_ORDER.includes(g)),
    ];
    return names.map((name) => {
      const items = documents.filter((d) => d.group === name);
      const parents = items.filter((d) => !d.parentId);
      return { name, items, parents };
    });
  }, [documents]);

  return (
    <div>
      <PageHeader
        eyebrow="Document Vault"
        title="Papers, in the right order"
        description="Attestation sequence matters: BISE before IBCC, your university before HEC, and MOFA + Notary only once those are done."
        action={
          <button
            onClick={() =>
              addDocument({
                name: "New document",
                group: "Other Certificates",
                category: "Certificate",
                status: "Not Started",
                notes: "",
                dueDate: "",
                fileRef: "",
              })
            }
            className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add document
          </button>
        }
      />

      <div className="ledger-card mb-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            {documents.filter(isDocDone).length} of {documents.length} complete
          </span>
          <span className="font-display text-xl text-primary">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-3 h-2" />
      </div>

      <div className="space-y-6">
        {groups.map((g) => {
          const isFinalLayer = g.name === "Final Attestation Layer";
          return (
            <section key={g.name} className="ledger-card">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl">{g.name}</h2>
                <span className="text-xs text-muted-foreground">
                  {g.items.filter(isDocDone).length}/{g.items.length}
                </span>
              </div>

              {isFinalLayer ? (
                <>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Applies after HEC / IBCC attestation is done.
                  </p>
                  <Chain steps={g.items} />
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  {g.parents.map((p) => {
                    const children = g.items.filter((d) => d.parentId === p.id);
                    return (
                      <div key={p.id}>
                        <DocRow d={p} />
                        {children.length ? <Chain steps={children} /> : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
