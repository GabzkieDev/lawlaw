import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import bgAsset from "@/assets/ares-bg.jpg.asset.json";
import idAsset from "@/assets/yunos-id.jpg.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Yunos Asumah — Portfolio" },
      {
        name: "description",
        content:
          "Portfolio profile of Yunos Asumah — student, developer and designer. Skills, projects and contact details.",
      },
      { property: "og:title", content: "Yunos Asumah — Portfolio" },
      {
        property: "og:description",
        content: "Portfolio profile of Yunos Asumah — skills, projects and contact details.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function SmokeCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Puff = { x: number; y: number; r: number; vx: number; vy: number; a: number; da: number };
    const puffs: Puff[] = [];
    const spawn = (): Puff => ({
      x: Math.random() * w,
      y: h + 80 + Math.random() * 120,
      r: 90 + Math.random() * 180,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.18 + Math.random() * 0.45),
      a: 0,
      da: 0.0015 + Math.random() * 0.0025,
    });
    for (let i = 0; i < 34; i++) {
      const p = spawn();
      p.y = Math.random() * h;
      p.a = Math.random() * 0.18;
      puffs.push(p);
    }

    let t = 0;
    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i]!;
        p.x += p.vx + Math.sin(t + i) * 0.25;
        p.y += p.vy;
        p.a += p.da;
        if (p.a > 0.2) p.da = -Math.abs(p.da);
        if (p.a <= 0 || p.y < -p.r) puffs[i] = spawn();

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(235, 225, 215, ${Math.max(p.a, 0)})`);
        g.addColorStop(0.5, `rgba(190, 150, 140, ${Math.max(p.a, 0) * 0.35})`);
        g.addColorStop(1, "rgba(120, 90, 90, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="yp-smoke" aria-hidden="true" />;
}

const skills = [
  { name: "HTML5", level: 92 },
  { name: "CSS3", level: 88 },
  { name: "JavaScript", level: 84 },
  { name: "UI / UX Design", level: 76 },
  { name: "Computer Systems Servicing", level: 80 },
];

const projects = [
  {
    title: "School Portal Concept",
    text: "A responsive web portal design for campus announcements, schedules and enrollment.",
    tags: ["HTML", "CSS", "JS"],
  },
  {
    title: "Smoke FX Landing Page",
    text: "Canvas-driven particle smoke background with layered gradients and parallax motion.",
    tags: ["Canvas", "Animation"],
  },
  {
    title: "Personal Brand Kit",
    text: "Logo, typography scale and color system built around a deep crimson and gold palette.",
    tags: ["Branding", "Design"],
  },
];

function PortfolioPage() {
  return (
    <div className="yp-root">
      <style>{css}</style>
      <div className="yp-bg" style={{ backgroundImage: `url(${bgAsset.url})` }} />
      <div className="yp-veil" />
      <SmokeCanvas />

      <header className="yp-nav">
        <span className="yp-brand">YUNOS ASUMAH</span>
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="yp-main">
        <section className="yp-hero">
          <div className="yp-photo-wrap">
            <img className="yp-photo" src={idAsset.url} alt="Portrait of Yunos Asumah" />
          </div>
          <div className="yp-hero-text">
            <p className="yp-kicker">Portfolio Profile</p>
            <h1>
              Yunos <span>Asumah</span>
            </h1>
            <p className="yp-role">Web Developer &middot; Designer &middot; Student</p>
            <p className="yp-lead">
              I build clean, responsive websites with HTML, CSS and JavaScript — mixing solid
              structure with motion and atmosphere.
            </p>
            <div className="yp-cta">
              <a className="yp-btn yp-btn-primary" href="#work">
                View Work
              </a>
              <a className="yp-btn" href="#contact">
                Hire Me
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="yp-section">
          <h2>About Me</h2>
          <div className="yp-card">
            <p>
              I&apos;m Yunos Asumah, based in General Santos City, Philippines. I enjoy turning
              ideas into working web pages — from the first wireframe to the last line of
              JavaScript. My focus is on readable code, responsive layouts and details that make an
              interface feel alive.
            </p>
            <ul className="yp-facts">
              <li>
                <strong>Location</strong>General Santos City, PH
              </li>
              <li>
                <strong>Focus</strong>Front-end Development
              </li>
              <li>
                <strong>Stack</strong>HTML, CSS, JavaScript
              </li>
              <li>
                <strong>Status</strong>Open for projects
              </li>
            </ul>
          </div>
        </section>

        <section id="skills" className="yp-section">
          <h2>Skills</h2>
          <div className="yp-card">
            {skills.map((s) => (
              <div key={s.name} className="yp-skill">
                <div className="yp-skill-top">
                  <span>{s.name}</span>
                  <span>{s.level}%</span>
                </div>
                <div className="yp-bar">
                  <i style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="yp-section">
          <h2>Selected Work</h2>
          <div className="yp-grid">
            {projects.map((p) => (
              <article key={p.title} className="yp-card yp-project">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="yp-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="yp-section">
          <h2>Get in Touch</h2>
          <div className="yp-card yp-contact">
            <p>Have a project in mind or want to collaborate? Send a message.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).reset();
                alert("Thanks! Your message has been noted.");
              }}
            >
              <input required placeholder="Your name" aria-label="Your name" />
              <input required type="email" placeholder="Email address" aria-label="Email address" />
              <textarea required rows={4} placeholder="Message" aria-label="Message" />
              <button className="yp-btn yp-btn-primary" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="yp-footer">
        &copy; {new Date().getFullYear()} Yunos Asumah — Built with HTML, CSS &amp; JavaScript.
      </footer>
    </div>
  );
}

const css = `
.yp-root{position:relative;min-height:100vh;overflow-x:hidden;color:#f6efe6;font-family:"Inter",system-ui,sans-serif;background:#150608;}
.yp-bg{position:fixed;inset:0;background-size:cover;background-position:center;filter:saturate(1.05) brightness(.55);z-index:0;}
.yp-veil{position:fixed;inset:0;z-index:1;background:radial-gradient(90% 70% at 50% 25%, rgba(90,10,20,.35), rgba(12,4,6,.92) 75%);}
.yp-smoke{position:fixed;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;opacity:.75;mix-blend-mode:screen;}
.yp-nav,.yp-main,.yp-footer{position:relative;z-index:3;}
.yp-nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
 padding:1rem clamp(1rem,5vw,4rem);backdrop-filter:blur(6px);background:rgba(15,5,7,.45);
 border-bottom:1px solid rgba(212,175,110,.28);position:sticky;top:0;}
.yp-brand{font-weight:800;letter-spacing:.22em;font-size:.8rem;color:#e8c97e;}
.yp-nav nav{display:flex;gap:1.1rem;}
.yp-nav a{color:#efe3d3;text-decoration:none;font-size:.85rem;opacity:.85;transition:.2s;}
.yp-nav a:hover{color:#e8c97e;opacity:1;}
.yp-main{max-width:1080px;margin:0 auto;padding:clamp(2rem,6vw,4.5rem) clamp(1rem,5vw,2rem);}
.yp-hero{display:flex;gap:clamp(1.5rem,5vw,3.5rem);align-items:center;flex-wrap:wrap;
 animation:yp-fade .9s ease-out both;}
.yp-photo-wrap{position:relative;padding:6px;border-radius:50%;
 background:conic-gradient(from 0deg,#e8c97e,#8c1f2c,#e8c97e);box-shadow:0 20px 60px rgba(0,0,0,.6);}
.yp-photo{display:block;width:clamp(170px,34vw,240px);height:clamp(170px,34vw,240px);border-radius:50%;
 object-fit:cover;object-position:50% 30%;border:3px solid rgba(20,7,10,.9);}
.yp-hero-text{flex:1 1 320px;}
.yp-kicker{letter-spacing:.35em;font-size:.7rem;color:#e8c97e;text-transform:uppercase;margin:0 0 .6rem;}
.yp-hero h1{font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(2.4rem,7vw,4rem);line-height:1.02;margin:0;font-weight:800;}
.yp-hero h1 span{background:linear-gradient(90deg,#e8c97e,#b8202f);-webkit-background-clip:text;background-clip:text;color:transparent;}
.yp-role{margin:.7rem 0 .4rem;color:#e8c97e;font-weight:600;letter-spacing:.05em;}
.yp-lead{margin:0;color:rgba(246,239,230,.78);max-width:46ch;line-height:1.65;}
.yp-cta{display:flex;gap:.75rem;margin-top:1.4rem;flex-wrap:wrap;}
.yp-btn{display:inline-block;padding:.72rem 1.4rem;border-radius:999px;text-decoration:none;font-weight:600;
 font-size:.9rem;color:#f6efe6;border:1px solid rgba(232,201,126,.5);background:rgba(255,255,255,.05);
 cursor:pointer;transition:transform .2s, box-shadow .2s, background .2s;}
.yp-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(184,32,47,.35);}
.yp-btn-primary{background:linear-gradient(90deg,#8c1f2c,#b8202f);border-color:transparent;}
.yp-section{margin-top:clamp(3rem,9vw,5.5rem);}
.yp-section h2{font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(1.5rem,4vw,2.1rem);margin:0 0 1.2rem;}
.yp-section h2:after{content:"";display:block;width:64px;height:3px;margin-top:.6rem;border-radius:3px;
 background:linear-gradient(90deg,#e8c97e,#b8202f);}
.yp-card{background:rgba(24,9,12,.6);border:1px solid rgba(232,201,126,.22);border-radius:18px;
 padding:clamp(1.1rem,3.5vw,1.8rem);backdrop-filter:blur(8px);box-shadow:0 18px 50px rgba(0,0,0,.45);line-height:1.7;}
.yp-facts{list-style:none;padding:0;margin:1.2rem 0 0;display:grid;gap:.6rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));}
.yp-facts li{font-size:.9rem;color:rgba(246,239,230,.8);}
.yp-facts strong{display:block;color:#e8c97e;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:.15rem;}
.yp-skill+.yp-skill{margin-top:1rem;}
.yp-skill-top{display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:.4rem;}
.yp-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;}
.yp-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#e8c97e,#b8202f);
 animation:yp-grow 1.2s ease-out both;}
.yp-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));}
.yp-project{transition:transform .25s, border-color .25s;}
.yp-project:hover{transform:translateY(-6px);border-color:rgba(232,201,126,.55);}
.yp-project h3{margin:0 0 .5rem;font-family:"Plus Jakarta Sans",sans-serif;font-size:1.1rem;}
.yp-project p{margin:0;color:rgba(246,239,230,.75);font-size:.92rem;}
.yp-tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.9rem;}
.yp-tags span{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;padding:.25rem .6rem;border-radius:99px;
 border:1px solid rgba(232,201,126,.35);color:#e8c97e;}
.yp-contact form{display:grid;gap:.7rem;margin-top:1rem;}
.yp-contact input,.yp-contact textarea{width:100%;padding:.75rem .9rem;border-radius:12px;color:#f6efe6;
 background:rgba(255,255,255,.06);border:1px solid rgba(232,201,126,.25);font:inherit;font-size:.9rem;}
.yp-contact input::placeholder,.yp-contact textarea::placeholder{color:rgba(246,239,230,.45);}
.yp-contact input:focus,.yp-contact textarea:focus{outline:none;border-color:#e8c97e;}
.yp-footer{text-align:center;padding:2.5rem 1rem;font-size:.8rem;color:rgba(246,239,230,.6);
 border-top:1px solid rgba(232,201,126,.18);margin-top:3rem;}
@keyframes yp-fade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes yp-grow{from{width:0}}
@media (prefers-reduced-motion: reduce){.yp-smoke{display:none}}
`;
