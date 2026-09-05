import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Mail, Facebook, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoAsset from "@/assets/khens-logo.png.asset.json";
import { programs, getProgramBySlug } from "@/lib/programs";

export const Route = createFileRoute("/program/$slug")({
  head: ({ params }) => {
    const p = getProgramBySlug(params.slug);
    const title = p
      ? `${p.title} — Kolehiyo ng Heneral Santos`
      : "Program — Kolehiyo ng Heneral Santos";
    const desc =
      p?.desc ??
      "Explore academic programs at Kolehiyo ng Heneral Santos.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: ProgramPage,
  notFoundComponent: ProgramNotFound,
});

function ProgramNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Program not found
      </h1>
      <p className="text-muted-foreground">
        The program you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" /> Back to homepage
      </Link>
    </div>
  );
}

function ProgramPage() {
  const { slug } = Route.useParams();
  const program = getProgramBySlug(slug);

  if (!program) {
    return <ProgramNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Kolehiyo ng Heneral Santos seal"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-display text-lg font-bold text-foreground">
              Kolehiyo ng Heneral Santos
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-flame transition-colors hover:text-flame/80"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={program.image}
            alt={program.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-background/95" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <span className="inline-flex items-center rounded-full bg-flame px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {program.tag}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            {program.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{program.desc}</p>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: quick facts */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-foreground">
                Program at a glance
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-bold text-foreground">Duration</dt>
                  <dd className="text-muted-foreground">{program.duration}</dd>
                </div>
                <div>
                  <dt className="font-bold text-foreground">Category</dt>
                  <dd className="text-muted-foreground">{program.tag}</dd>
                </div>
                <div>
                  <dt className="font-bold text-foreground">Campus</dt>
                  <dd className="text-muted-foreground">
                    Purok Maliwanag, Barangay Calumpang, General Santos City
                  </dd>
                </div>
              </dl>
              <a
                href="/#admissions"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply for this program
              </a>
            </div>
          </aside>

          {/* Right: full details */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Program overview
              </h2>
              <p className="mt-3 text-muted-foreground">{program.desc}</p>
              <div className="mt-4 rounded-xl border-l-4 border-flame bg-secondary p-4 text-sm text-foreground">
                <span className="font-bold">Highlight: </span>
                {program.highlight}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Majors & tracks
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {program.majors.map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-flame" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Career paths
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Graduates of this program are prepared for roles such as:
              </p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {program.careers.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Year-by-year curriculum
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                What students take and experience each year of the program.
              </p>
              <div className="mt-6 space-y-6">
                {program.years.map((y, i) => (
                  <article
                    key={y.year}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:flex"
                  >
                    <div className="relative sm:w-2/5">
                      <img
                        src={y.image}
                        alt={y.alt}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="h-48 w-full object-cover sm:h-full"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-flame px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                        Year {i + 1}
                      </span>
                    </div>
                    <div className="p-5 sm:w-3/5">
                      <p className="text-xs font-bold uppercase tracking-wide text-flame">
                        {y.year}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                        {y.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {y.focus}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {y.subjects.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Program events &amp; activities
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Key activities scheduled for this program this academic year.
              </p>
              <ol className="mt-6 space-y-4">
                {program.events.map((e) => (
                  <li
                    key={e.title}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <span className="text-xs font-bold uppercase">
                        {new Date(`${e.date}T00:00:00`).toLocaleDateString("en-PH", { month: "short" })}
                      </span>
                      <span className="font-display text-xl font-bold leading-none">
                        {new Date(`${e.date}T00:00:00`).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {e.title}
                      </h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-flame">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatEventDate(e.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.location}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{e.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>



            <div className="rounded-2xl border border-border bg-secondary p-6">
              <h2 className="font-display text-lg font-bold text-foreground">
                Ready to enroll?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Visit the Admissions section to learn about requirements, fees,
                and the enrollment schedule.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-flame px-5 py-2.5 font-bold text-white transition-colors hover:bg-flame/90"
              >
                Go to Admissions <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* Other programs */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Explore other programs
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs
              .filter((p) => p.slug !== program.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  to="/program/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {p.desc}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-flame">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <img
                src={logoAsset.url}
                alt="Kolehiyo ng Heneral Santos seal"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-display font-bold text-foreground">
                  Kolehiyo ng Heneral Santos
                </p>
                <p className="text-sm text-muted-foreground">
                  Learning Without Limits, Growing Without Bounds.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-flame" /> Purok Maliwanag,
                Barangay Calumpang, General Santos City, 9500
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-flame" />{" "}
                <a
                  href="mailto:kolehiyodeheneral@gmail.com"
                  className="hover:text-flame"
                >
                  kolehiyodeheneral@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-flame" /> Mon–Fri, 8:00 AM – 5:00
                PM
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <a
                href="https://www.facebook.com/KolehiyoNgHeneralSantos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-flame"
              >
                <Facebook className="h-4 w-4 text-flame" /> Kolehiyo ng Heneral
                Santos
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kolehiyo ng Heneral Santos. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
