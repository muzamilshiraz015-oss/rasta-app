import { createFileRoute } from "@tanstack/react-router";
import { Copy, Plus, Trash2 } from "lucide-react";
import { Field, PageHeader, inputClass } from "@/components/rasta-ui";
import { uid, useRasta } from "@/lib/rasta-store";
import type { SopDraft } from "@/lib/rasta-types";

export const Route = createFileRoute("/sop")({
  head: () => ({
    meta: [
      { title: "SOP & Essays Workspace — Rasta" },
      {
        name: "description",
        content:
          "Draft one Statement of Purpose per scholarship, with live word count, timestamps and one-click duplication.",
      },
      { property: "og:title", content: "SOP & Essays Workspace — Rasta" },
      {
        property: "og:description",
        content: "Write, version and reuse your statement of purpose across programs.",
      },
    ],
  }),
  component: SopPage,
});

const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

function SopPage() {
  const { sops, programs, upsertSop, removeSop } = useRasta();

  const create = (base?: SopDraft) =>
    upsertSop({
      id: uid(),
      title: base ? `${base.title} (copy)` : "New draft",
      programId: base?.programId ?? null,
      content: base?.content ?? "",
      updatedAt: new Date().toISOString(),
    });

  const edit = (draft: SopDraft, patch: Partial<SopDraft>) =>
    upsertSop({ ...draft, ...patch, updatedAt: new Date().toISOString() });

  return (
    <div>
      <PageHeader
        eyebrow="SOP & Essays"
        title="Say why it matters"
        description="One draft per program. Duplicate a strong version and adapt it rather than starting from a blank page."
        action={
          <button
            onClick={() => create()}
            className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New draft
          </button>
        }
      />

      {sops.length === 0 ? (
        <div className="ledger-card text-sm text-muted-foreground">
          No drafts yet. Start with the Fulbright statement — one honest paragraph is enough to begin.
        </div>
      ) : null}

      <div className="space-y-5">
        {sops.map((s) => (
          <article key={s.id} className="ledger-card">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={s.title}
                  onChange={(e) => edit(s, { title: e.target.value })}
                />
              </Field>
              <Field label="Program">
                <select
                  className={inputClass}
                  value={s.programId ?? ""}
                  onChange={(e) => edit(s, { programId: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <textarea
              className={inputClass + " mt-4 min-h-64 leading-relaxed"}
              placeholder="Write your statement of purpose…"
              value={s.content}
              onChange={(e) => edit(s, { content: e.target.value })}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                <span className="text-primary">{words(s.content)}</span> words ·{" "}
                {s.content.length} characters
              </span>
              <span>Last edited {new Date(s.updatedAt).toLocaleString()}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => create(s)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <button
                onClick={() => removeSop(s.id)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
