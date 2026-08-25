import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Pill } from "@/components/rasta-ui";
import { buildTimeline, daysUntil, formatDate, useRasta } from "@/lib/rasta-store";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline & Deadlines — Rasta" },
      {
        name: "description",
        content:
          "A single vertical timeline of every scholarship deadline and document due date, colour-coded by type.",
      },
      { property: "og:title", content: "Timeline & Deadlines — Rasta" },
      {
        property: "og:description",
        content: "Program deadlines in brass, document tasks in blue — all on one path.",
      },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const data = useRasta();
  const entries = buildTimeline({
    programs: data.programs,
    documents: data.documents,
    sops: data.sops,
  });

  const grouped = entries.reduce<Record<string, typeof entries>>((acc, e) => {
    const key = new Date(e.date + "T00:00:00").toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        eyebrow="Timeline"
        title="The road ahead"
        description="Program deadlines in brass, document tasks in blue."
      />

      <div className="mb-6 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" /> Program deadline
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-info" /> Document task
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="ledger-card text-sm text-muted-foreground">
          Nothing scheduled yet. Add application windows to programs or due dates to documents.
        </div>
      ) : null}

      <div className="space-y-8">
        {Object.entries(grouped).map(([month, items]) => (
          <section key={month}>
            <h2 className="mb-3 font-display text-lg text-muted-foreground">{month}</h2>
            <div className="relative border-l border-border pl-6">
              {items.map((e) => {
                const d = daysUntil(e.date);
                const past = d !== null && d < 0;
                return (
                  <div key={e.id} className="relative pb-5">
                    <span
                      className={
                        "absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background " +
                        (e.kind === "program" ? "bg-primary" : "bg-info")
                      }
                    />
                    <div className={"ledger-card " + (past ? "opacity-55" : "")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-lg leading-snug">{e.label}</p>
                        <Pill tone={e.kind === "program" ? "brass" : "info"}>
                          {e.kind === "program" ? "Deadline" : "Document"}
                        </Pill>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{e.sub}</p>
                      <p className="mt-2 text-xs">
                        <span className="text-muted-foreground">{formatDate(e.date)}</span>
                        {d !== null ? (
                          <span className={past ? " text-muted-foreground" : " text-primary"}>
                            {" "}
                            · {past ? `${Math.abs(d)}d ago` : `in ${d}d`}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
