import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileCheck2, Flag, Target } from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "@/components/rasta-ui";
import {
  buildTimeline,
  daysUntil,
  formatDate,
  isDocDone,
  nextAction,
  readiness,
  useRasta,
} from "@/lib/rasta-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Rasta Scholarship Tracker" },
      {
        name: "description",
        content:
          "See deadlines, document readiness and your single next action across every scholarship application.",
      },
      { property: "og:title", content: "Dashboard — Rasta Scholarship Tracker" },
      {
        property: "og:description",
        content: "Deadlines, document readiness and your next action, all in one calm view.",
      },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="ledger-card">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-[0.68rem] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 font-display text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Dashboard() {
  const data = useRasta();
  const { programs, documents } = data;

  const done = documents.filter(isDocDone).length;
  const pct = readiness(documents);
  const timeline = buildTimeline({ programs, documents, sops: data.sops });
  const upcoming = timeline.filter((e) => (daysUntil(e.date) ?? -1) >= 0);
  const nearest = upcoming.find((e) => e.kind === "program");
  const action = nextAction({ programs, documents, sops: data.sops });

  return (
    <div>
      <PageHeader
        eyebrow="Your path"
        title="Every step, in order."
        description="A quiet place to hold your scholarship applications, attestations and drafts — so nothing slips while you build what comes next."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Flag} label="Programs tracked" value={String(programs.length)} />
        <StatCard
          icon={CalendarDays}
          label="Nearest deadline"
          value={nearest ? `${daysUntil(nearest.date)}d` : "—"}
          hint={nearest ? `${nearest.label} · ${formatDate(nearest.date)}` : "Add a program deadline"}
        />
        <StatCard
          icon={FileCheck2}
          label="Documents done"
          value={`${done}/${documents.length}`}
        />
        <StatCard icon={Target} label="Overall readiness" value={`${pct}%`} />
      </div>

      <section className="mt-6 ledger-card">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl">Readiness</h2>
          <span className="text-sm text-primary">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-4 h-2" />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="ledger-card">
          <h2 className="font-display text-xl">Upcoming deadlines</h2>
          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 6).map((e) => {
              const d = daysUntil(e.date) ?? 0;
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5"
                >
                  <span
                    className={
                      "h-8 w-1 rounded-full " + (e.kind === "program" ? "bg-primary" : "bg-info")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{e.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.sub}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                    <p className={"text-xs " + (d <= 14 ? "text-primary" : "text-muted-foreground")}>
                      in {d}d
                    </p>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No dates yet — add application windows in{" "}
                <Link to="/programs" className="text-primary underline-offset-4 hover:underline">
                  Programs
                </Link>
                .
              </p>
            ) : null}
          </div>
        </section>

        <section className="ledger-card">
          <h2 className="font-display text-xl">Next action</h2>
          {action ? (
            <div className="mt-4">
              <Pill tone="brass">{action.category}</Pill>
              <p className="mt-3 font-display text-lg leading-snug">{action.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{action.group}</p>
              {action.notes ? (
                <p className="mt-3 text-sm text-muted-foreground">{action.notes}</p>
              ) : null}
              {action.dueDate ? (
                <p className="mt-3 text-xs text-primary">Due {formatDate(action.dueDate)}</p>
              ) : null}
              <Link
                to="/documents"
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open Document Vault
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Everything on your list is done. Well done — take the win.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
