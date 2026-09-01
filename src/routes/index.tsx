import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MapPin, Mail, Facebook, Clock } from "lucide-react";
import logoAsset from "@/assets/khens-logo.jpg.asset.json";
import campusAsset from "@/assets/campus.jpg.asset.json";
import progBsed from "@/assets/prog-bsed.jpg";
import progBeed from "@/assets/prog-beed.jpg";
import progIt from "@/assets/prog-it.jpg";
import progBusiness from "@/assets/prog-business.jpg";
import progHospitality from "@/assets/prog-hospitality.jpg";
import progAct from "@/assets/prog-act.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kolehiyo ng Heneral Santos — Learning Without Limits" },
      {
        name: "description",
        content:
          "Official website of Kolehiyo ng Heneral Santos, General Santos City. Quality, accessible higher education. Learning Without Limits, Growing Without Bounds.",
      },
      { property: "og:title", content: "Kolehiyo ng Heneral Santos" },
      {
        property: "og:description",
        content:
          "Quality, accessible higher education in General Santos City. Learning Without Limits, Growing Without Bounds.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `https://id-preview--5c3dac73-30d0-4982-a131-eacc591d227b.lovable.app${logoAsset.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kolehiyo ng Heneral Santos" },
      {
        name: "twitter:description",
        content: "Quality, accessible higher education in General Santos City.",
      },
      { name: "twitter:image", content: `https://id-preview--5c3dac73-30d0-4982-a131-eacc591d227b.lovable.app${logoAsset.url}` },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

const programs = [
  {
    title: "Bachelor of Secondary Education",
    desc: "Major in English, Filipino, Mathematics, and Science. Shape the next generation of educators.",
    tag: "Education",
    image: progBsed,
    alt: "Education students in a classroom discussion at Kolehiyo ng Heneral Santos",
    duration: "4 years (8 semesters)",
    majors: ["English", "Filipino", "Mathematics", "Science"],
    careers: ["Junior/Senior High School Teacher", "Curriculum Writer", "Academic Coordinator"],
    highlight: "Includes 1 semester of supervised student teaching in partner public schools and LET review.",
  },
  {
    title: "Bachelor of Elementary Education",
    desc: "Foundational teacher training for early-grade instruction across the core learning areas.",
    tag: "Education",
    image: progBeed,
    alt: "Elementary education students practicing classroom teaching",
    duration: "4 years (8 semesters)",
    majors: ["Generalist", "Early Childhood Education", "Special Needs Education"],
    careers: ["Elementary Teacher", "Daycare/Preschool Head", "Learning Support Specialist"],
    highlight: "Field study starts as early as second year, with hands-on practice in Calumpang schools.",
  },
  {
    title: "BS in Information Technology",
    desc: "Programming, networking, and systems management for the digital economy of SOCCSKSARGEN.",
    tag: "Technology",
    image: progIt,
    alt: "Information technology students working on computers in the campus laboratory",
    duration: "4 years (8 semesters)",
    majors: ["Web & Mobile Development", "Network Administration", "Database Systems"],
    careers: ["Software Developer", "Network Engineer", "IT Support Specialist", "Systems Analyst"],
    highlight: "486 hours of industry internship plus preparation for global IT certifications.",
  },
  {
    title: "BS in Business Administration",
    desc: "Management, marketing, and finance tracks that build tomorrow's local entrepreneurs.",
    tag: "Business",
    image: progBusiness,
    alt: "Business administration students in a group presentation",
    duration: "4 years (8 semesters)",
    majors: ["Marketing Management", "Financial Management", "Human Resource Management"],
    careers: ["Business Owner", "Marketing Officer", "HR Associate", "Bank Operations Staff"],
    highlight: "Capstone business plan competition judged by GenSan entrepreneurs and industry leaders.",
  },
  {
    title: "BS in Hospitality Management",
    desc: "Hotel, restaurant, and tourism operations training anchored on GenSan's thriving industry.",
    tag: "Hospitality",
    image: progHospitality,
    alt: "Hospitality management students in uniform during hotel and restaurant training",
    duration: "4 years (8 semesters)",
    majors: ["Hotel Operations", "Food & Beverage Services", "Tourism & Events"],
    careers: ["Hotel Supervisor", "Restaurant Manager", "Cruise Ship Crew", "Events Organizer"],
    highlight: "On-campus training kitchen and mock hotel rooms, plus local and overseas practicum options.",
  },
  {
    title: "Associate in Computer Technology",
    desc: "A two-year ladderized pathway into IT careers and further degree studies.",
    tag: "Technology",
    image: progAct,
    alt: "Computer technology students assembling and troubleshooting hardware",
    duration: "2 years (4 semesters), ladderized",
    majors: ["Computer Hardware Servicing", "Office Productivity", "Basic Programming"],
    careers: ["Computer Technician", "Encoder/Data Staff", "Junior IT Support"],
    highlight: "Credits fully transfer into the BS Information Technology program after graduation.",
  },
];

const stats = [
  { value: "20+", label: "Degree & associate programs" },
  { value: "5,000+", label: "Students served" },
  { value: "150+", label: "Faculty & staff" },
  { value: "98%", label: "Licensure pass rate" },
];

const admissionsSteps = [
  {
    step: "01",
    title: "Submit Application",
    desc: "Complete the online application form and upload your report cards and ID.",
  },
  {
    step: "02",
    title: "Take Entrance Exam",
    desc: "Sit for the KOLEHIYO ng Heneral Santos admission test on your scheduled date.",
  },
  {
    step: "03",
    title: "Interview & Counseling",
    desc: "Meet with our admissions team to align your goals with the right program.",
  },
  {
    step: "04",
    title: "Enroll & Pay",
    desc: "Confirm your slot, settle fees, and claim your student ID to begin.",
  },
];

type NewsItem = { id: string; date: string; tag: string; title: string; desc: string; image: string | null };

const fallbackNews: NewsItem[] = [
  {
    id: "fallback-1",
    date: "Aug 18, 2026",
    tag: "Announcement",
    title: "First Semester Enrollment Now Open",
    desc: "Slots for SY 2026–2027 are filling fast. Secure your place before the August 30 deadline.",
    image: null,
  },
  {
    id: "fallback-2",
    date: "Aug 9, 2026",
    tag: "Achievement",
    title: "Education Graduates Top Licensure Exam",
    desc: "Our BEED and BSED graduates posted a 98% passing rate in the latest LET.",
    image: null,
  },
  {
    id: "fallback-3",
    date: "Jul 28, 2026",
    tag: "Event",
    title: "Intramurals 2026: Blue vs. Gold",
    desc: "Three days of athletics, arts, and school spirit. Catch the opening ceremony livestream.",
    image: null,
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNews);
  const [openProgram, setOpenProgram] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("announcements")
      .select("id,title,body,category,created_at,image_url")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(async ({ data }) => {
        if (!active || !data || data.length === 0) return;
        const items = await Promise.all(
          data.map(async (a) => {
            let image: string | null = null;
            if (a.image_url) {
              const { data: signed } = await supabase.storage
                .from("announcements")
                .createSignedUrl(a.image_url, 60 * 60);
              image = signed?.signedUrl ?? null;
            }
            return {
              id: a.id,
              title: a.title,
              desc: a.body,
              tag: a.category,
              image,
              date: new Date(a.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            };
          }),
        );
        if (active) setNewsItems(items);
      });
    return () => {
      active = false;
    };
  }, []);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2">
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-gold" />
            Enrollment for SY 2026–2027 is now open.
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="https://www.facebook.com/KolehiyoNgHeneralSantos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Facebook className="h-3.5 w-3.5" />
              Facebook
            </a>
            <a
              href="mailto:kolehiyodeheneral@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              kolehiyodeheneral@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Kolehiyo ng Heneral Santos logo"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="leading-tight">
              <p className="font-display text-base font-extrabold text-primary sm:text-lg">
                Kolehiyo ng Heneral Santos
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                General Santos City
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#admissions"
              className="ml-2 inline-flex items-center rounded-full bg-flame px-5 py-2.5 text-sm font-bold text-flame-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Apply Now
            </a>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-primary transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-primary transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-primary transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-foreground/80 hover:bg-secondary hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#admissions"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-flame px-5 py-3 text-sm font-bold text-flame-foreground"
              >
                Apply Now
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <img
          src={campusAsset.url}
          alt="Kolehiyo ng Heneral Santos campus building"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0" />
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-gold), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-flame), transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
          <div className="text-primary-foreground">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="inline-block h-2 w-2 rounded-full bg-gold" />
              General Santos City · Est. 2025
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Kolehiyo ng
              <span className="block text-gold">Heneral Santos</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">
              Quality, accessible higher education for the people of SOCCSKSARGEN — where every
              learner is empowered to lead, serve, and innovate.
            </p>
            <p className="mt-4 font-display text-sm font-bold uppercase tracking-[0.22em] text-gold">
              Learning Without Limits · Growing Without Bounds
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#admissions"
                className="inline-flex items-center rounded-full bg-flame px-7 py-3.5 text-sm font-bold text-flame-foreground shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Apply for Admission
              </a>
              <a
                href="#academics"
                className="inline-flex items-center rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-7 py-3.5 text-sm font-bold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
              >
                Explore Programs
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gold/20 blur-2xl" />
              <img
                src={logoAsset.url}
                alt="Kolehiyo ng Heneral Santos official seal"
                className="relative h-64 w-64 rounded-full object-cover ring-4 ring-primary-foreground/20 sm:h-80 sm:w-80"
              />
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="relative">
          <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
            <path fill="var(--color-background)" d="M0,40 C240,80 480,0 720,32 C960,64 1200,16 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-2 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-4 sm:p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-primary sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-flame">
              About the College
            </p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              A public college built for the people of GenSan
            </h2>
            <p className="mt-5 text-muted-foreground">
              Kolehiyo ng Heneral Santos was established to widen access to affordable, quality
              higher education for the youth of General Santos City and the surrounding
              SOCCSKSARGEN region. We blend strong academic foundations with technical, values-driven
              learning that prepares graduates for meaningful work and lifelong service.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Tuition-friendly, government-supported public college",
                "Ladderized programs from associate to bachelor degrees",
                "Industry-aligned curricula with the tuna and tech sectors",
                "Active student life, athletics, and community extension",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold/20 text-gold-foreground">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Mission", v: "To produce competent, values-driven, and globally competitive graduates responsive to local development." },
              { k: "Vision", v: "A leading public college empowering learners toward inclusive growth and innovation." },
              { k: "Core Value", v: "Integrity, Excellence, Service, and Resilience in all we do." },
              { k: "Goal", v: "Expand access to quality tertiary education across SOCCSKSARGEN." },
            ].map((c) => (
              <div
                key={c.k}
                className="rounded-2xl border border-border bg-secondary/60 p-5 transition-colors hover:border-primary/40"
              >
                <p className="font-display text-sm font-bold uppercase tracking-wide text-flame">{c.k}</p>
                <p className="mt-2 text-sm text-foreground/80">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academics */}
      <section id="academics" className="section-tint">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-flame">Academics</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Programs that open doors
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose from a range of CHED-recognized degree and associate programs designed to
              launch careers and build communities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => {
              const open = openProgram === p.title;
              return (
                <article
                  key={p.title}
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
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>

                    {open && (
                      <div className="mt-4 space-y-3 rounded-xl bg-secondary p-4 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-bold text-foreground">Duration: </span>
                          {p.duration}
                        </p>
                        <div>
                          <p className="font-bold text-foreground">Majors / tracks</p>
                          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                            {p.majors.map((m) => (
                              <li key={m}>{m}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">Career paths</p>
                          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                            {p.careers.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-muted-foreground">{p.highlight}</p>
                        <a
                          href="#admissions"
                          className="inline-flex items-center gap-1 font-bold text-flame"
                        >
                          Apply for this program <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setOpenProgram(open ? null : p.title)}
                      aria-expanded={open}
                      className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-flame transition-all hover:gap-2"
                    >
                      {open ? "Show less" : "Learn more"}
                      <span aria-hidden="true">{open ? "↑" : "→"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* Admissions */}
      <section id="admissions" className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-flame">Admissions</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Your path to becoming a KOLEHIYO student
            </h2>
            <p className="mt-4 text-muted-foreground">
              Admission is open to all qualified high school graduates and transferees. Follow
              four simple steps to claim your slot for the coming school year.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
              <p className="font-display text-lg font-bold">SY 2026–2027</p>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Application period: June 1 – August 30, 2026
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center rounded-full bg-flame px-6 py-3 text-sm font-bold text-flame-foreground transition-transform hover:-translate-y-0.5"
              >
                Start your application
              </a>
            </div>
          </div>

          <ol className="relative space-y-6 border-l-2 border-border pl-8">
            {admissionsSteps.map((s) => (
              <li key={s.step} className="relative">
                <span className="absolute -left-[2.4rem] flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground ring-4 ring-background">
                  {s.step}
                </span>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* News */}
      <section id="news" className="section-tint">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-flame">News & Events</p>
              <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                What's happening on campus
              </h2>
            </div>
            <Link to="/auth" className="text-sm font-bold text-primary hover:underline">
              Staff login →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {newsItems.map((n) => (
              <article
                key={n.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {n.image ? (
                  <img src={n.image} alt={n.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flame-underline h-1.5 w-full" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-bold uppercase tracking-wide text-primary">
                      {n.tag}
                    </span>
                    <span className="text-muted-foreground">{n.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">{n.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.desc}</p>
                  <a href="#news" className="mt-4 text-sm font-bold text-flame hover:underline">
                    Read more →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-flame">Contact Us</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Visit, call, or write to us
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our admissions office is ready to help you through every step. Reach us through any
              of the channels below.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  k: "Address",
                  v: "Purok Maliwanag, Barangay Calumpang, General Santos City, Philippines, 9500",
                  icon: MapPin,
                },
                { k: "Email", v: "kolehiyodeheneral@gmail.com", icon: Mail, href: "mailto:kolehiyodeheneral@gmail.com" },
                {
                  k: "Facebook",
                  v: "www.facebook.com/KolehiyoNgHeneralSantos",
                  href: "https://www.facebook.com/KolehiyoNgHeneralSantos",
                  icon: Facebook,
                },
                { k: "Office Hours", v: "Monday–Friday, 8:00 AM – 5:00 PM", icon: Clock },
              ].map((row) => (
                <div key={row.k} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex-none">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <row.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{row.k}</p>
                    {row.href ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-sm font-semibold text-flame hover:underline"
                      >
                        {row.v}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">{row.v}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <h3 className="font-display text-xl font-bold text-foreground">Send a message</h3>
            <p className="mt-1 text-sm text-muted-foreground">We'll reply within two working days.</p>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full name</span>
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Subject</span>
                <input
                  type="text"
                  placeholder="Admission inquiry"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Message</span>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-flame px-6 py-3 text-sm font-bold text-flame-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={logoAsset.url}
                alt="Kolehiyo ng Heneral Santos logo"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-foreground/20"
              />
              <p className="font-display text-lg font-extrabold leading-tight">
                Kolehiyo ng Heneral Santos
              </p>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/75">
              Learning Without Limits, Growing Without Bounds — quality public higher education
              for General Santos City and the SOCCSKSARGEN region.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {navItems.map((i) => (
                <li key={i.href}>
                  <a href={i.href} className="text-primary-foreground/75 transition-colors hover:text-gold">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Programs</p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Education", "Information Technology", "Business", "Hospitality"].map((i) => (
                <li key={i}>
                  <a href="#academics" className="text-primary-foreground/75 transition-colors hover:text-gold">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Connect</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/KolehiyoNgHeneralSantos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/75 transition-colors hover:text-gold"
                >
                  facebook.com/KolehiyoNgHeneralSantos
                </a>
              </li>
              <li>
                <a href="mailto:kolehiyodeheneral@gmail.com" className="text-primary-foreground/75 transition-colors hover:text-gold">
                  kolehiyodeheneral@gmail.com
                </a>
              </li>
              <li>
                <Link to="/auth" className="text-primary-foreground/75 transition-colors hover:text-gold">
                  Staff / Admin login
                </Link>
              </li>
              <li className="text-primary-foreground/75">
                Purok Maliwanag, Barangay Calumpang, General Santos City, 9500
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.facebook.com/KolehiyoNgHeneralSantos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/85 transition-colors hover:border-gold hover:text-gold"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="mailto:kolehiyodeheneral@gmail.com"
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/85 transition-colors hover:border-gold hover:text-gold"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row">
            <p>© {new Date().getFullYear()} Kolehiyo ng Heneral Santos. All rights reserved.</p>
            <p>Learning Without Limits · Growing Without Bounds</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
