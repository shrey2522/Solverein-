"use client";

import Image from "next/image";
import { ArrowDownRight, ArrowRight, Check, Menu, ShieldCheck, X } from "lucide-react";
import {
  AnimatePresence, motion, useReducedMotion,
  useScroll, useTransform, useSpring, useMotionValue, Variants,
} from "motion/react";
import { useEffect, useState } from "react";

/* ─── data ────────────────────────────────────────────────────────────────── */
const products = [
  ["heald",        "/images/heald.png",       "Empowering the world with health understanding.",   "A people-first experience that makes health information easier to access, understand and use.",    "Coming soon"],
  ["medical ease", "/images/medicalease.png", "The platform for smarter health data operations.",  "Bring the work of health data together with an infrastructure that makes clarity possible.",        "Explore MedicalEase"],
  ["alltruism",    "/images/alltruism.png",   "Leveraging health data for the greater good.",      "A thoughtful path from more connected information to broader positive impact.",                    "Coming soon"],
];
const flow = ["Patient", "Care team", "Health record", "A clearer picture", "Meaningful action"];
const values = [
  ["Service",  "Customer-obsessed, persistent problem solving, and social impact through digital and health equity."],
  ["Trust",    "Privacy, security, traceability, transparency, and responsible, compliant AI with human experts in the loop."],
  ["Delight",  "Exceeding expectations, delivering excellence, and empowering people through simplicity."],
];
const trustItems = [
  ["Privacy",      "People should always know where their story goes."],
  ["Security",     "Protection that is deeply built in, never bolted on."],
  ["Transparency", "Clear accountability at every point of connection."],
  ["Stewardship",  "Every detail handled with uncommon care."],
];

/* ─── shared easing + variants ───────────────────────────────────────────── */
const ease      = [0.22, 1, 0.36, 1] as const;
const fade: Variants      = { hidden: { opacity: 0, y: 32              }, show: { opacity: 1, y: 0              } };
const blurUp: Variants    = { hidden: { opacity: 0, y: 24, filter: "blur(12px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } };
const fromLeft: Variants  = { hidden: { opacity: 0, x: -60             }, show: { opacity: 1, x: 0              } };

/* ─── Scroll progress bar ─────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ─── Brand ───────────────────────────────────────────────────────────────── */
function Brand({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <a className="brand" href="#top" aria-label="Solverein home">
      <Image
        src={isLight ? "/images/Solverein-white-text.svg" : "/images/Solverein-black-text.svg"}
        alt="Solverein"
        width={552}
        height={147}
        priority
      />
    </a>
  );
}

/* ─── Magnetic Button ─────────────────────────────────────────────────────── */
function Button({
  children, secondary = false, onClick,
}: { children: React.ReactNode; secondary?: boolean; onClick?: () => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width  / 2) * 0.22);
    my.set((e.clientY - r.top  - r.height / 2) * 0.22);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };
  return (
    <motion.button
      className={`button${secondary ? " button-secondary" : ""}`}
      style={{ x: mx, y: my }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
    >
      {children}
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "flex", alignItems: "center" }}
      >
        <ArrowRight size={16} />
      </motion.span>
    </motion.button>
  );
}

/* ─── Scroll-triggered reveal ─────────────────────────────────────────────── */
type RevealV = "fade" | "blur" | "left" | "right";
const vMap: Record<RevealV, Variants> = {
  fade, blur: blurUp, left: fromLeft,
  right: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
};

function Reveal({ children, delay = 0, className = "", v = "fade" as RevealV }:
  { children: React.ReactNode; delay?: number; className?: string; v?: RevealV }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={vMap[v]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduce ? 0 : 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Word-split heading ──────────────────────────────────────────────────── */
const tagMap = { h1: motion.h1, h2: motion.h2, h3: motion.h3 };
function SplitHeading({ text, as: Tag = "h2", className = "" }:
  { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const MotionTag = tagMap[Tag];
  return (
    <MotionTag
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.22em" }}
          variants={{
            hidden: { opacity: 0, y: 36, filter: "blur(6px)"  },
            show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.65, ease } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/* ─── 3-D tilt value card ─────────────────────────────────────────────────── */
function ValueCard({ title, body, index }: { title: string; body: string; index: number }) {
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const rotX = useTransform(my, [-70, 70], [7, -7]);
  const rotY = useTransform(mx, [-70, 70], [-7,  7]);
  const glow = useTransform(mx, [-70, 70], ["rgba(166,182,156,0)", "rgba(166,182,156,0.15)"]);

  const onMove  = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width  / 2);
    my.set(e.clientY - r.top  - r.height / 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 40 },
        show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } },
      }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.span className="value-glow" style={{ background: glow }} />
      <span className="value-number">0{index + 1}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </motion.article>
  );
}

/* ─── Contact Modal ───────────────────────────────────────────────────────── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => onClose(), 3600);
  };

  return (
    <motion.div
      className="modal-overlay"
      id="contact-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Contact form"
        initial={{ opacity: 0, scale: 0.88, y: 36 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.94,  y: 18 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              className="modal-success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <motion.div
                className="modal-check"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0   }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              >
                <Check size={28} />
              </motion.div>
              <h3>Thank you for reaching out.</h3>
              <p>We&apos;ve received your message and will be in touch shortly.</p>
              <motion.div
                className="modal-progress"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.5, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          ) : (
            /* ── Form state ── */
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <button className="modal-close" onClick={onClose} aria-label="Close contact form">
                <X size={18} />
              </button>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Get in touch</p>
              <h3 className="modal-title">Let&apos;s start a<br />conversation.</h3>

              <form className="modal-form" onSubmit={handleSubmit} noValidate>
                <div className="modal-row">
                  <input
                    id="contact-name"
                    className="modal-input"
                    placeholder="Your name"
                    aria-label="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    id="contact-email"
                    className="modal-input"
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <textarea
                  id="contact-message"
                  className="modal-input modal-textarea"
                  placeholder="How can we help?"
                  aria-label="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
                <motion.button
                  id="contact-submit"
                  type="submit"
                  className="modal-submit"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  Send message <ArrowRight size={16} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Home ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [open,         setOpen]         = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [navScrolled,  setNavScrolled]  = useState(false);
  const [contactOpen,  setContactOpen]  = useState(false);
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const heroImgY    = useTransform(scrollY, [0, 800], [0, 180]);

  const openContact  = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1350);
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactOpen]);

  return (
    <main>
      <ScrollProgress />

      {/* ── Contact Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {contactOpen && <ContactModal onClose={closeContact} />}
      </AnimatePresence>

      {/* ── Loader ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%", filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span>solverein</span>
              <i />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <motion.header
        className={`nav${navScrolled ? " nav-scrolled" : ""}`}
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.65 }}
      >
        <Brand />
        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">
          {(["Who we are", "Products", "Values", "Contact"] as const).map((label, i) => (
            <motion.a
              key={label}
              href={label === "Contact" ? undefined : `#${(["approach", "products", "values"] as const)[i]}`}
              onClick={label === "Contact"
                ? (e) => { e.preventDefault(); openContact(); }
                : undefined}
              style={{ cursor: "pointer" }}
              whileHover={{ y: -2, color: "var(--green)" }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>

        <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
          <AnimatePresence mode="wait">
            <motion.span
              key={open ? "x" : "m"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              exit={   { rotate:  90, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex" }}
            >
              {open ? <X /> : <Menu />}
            </motion.span>
          </AnimatePresence>
        </button>

        <motion.button
          className="nav-cta"
          onClick={openContact}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
        >
          Talk to us <ArrowRight size={14} />
        </motion.button>
      </motion.header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="top" className="hero">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.62 } } }}
        >
          <motion.p variants={blurUp} className="eyebrow">Health data solutions</motion.p>
          <SplitHeading text="Care works better when the whole story is here." as="h1" />
          <motion.p variants={blurUp} className="lede">
            Solverein helps people own and understand their health information, so every decision can begin with clarity and every moment of care can feel more human.
          </motion.p>
          <motion.div variants={fade} className="actions">
            <Button>Explore our approach</Button>
            <Button secondary onClick={openContact}>Meet Solverein</Button>
          </motion.div>
          <motion.div variants={fade} className="proof">
            {["Built for people", "Privacy by design", "Human experts in the loop"].map((item, i) => (
              <motion.span key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.05 + i * 0.1, duration: 0.5 }}>
                <Check size={14} /> {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.38, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="hero-image-wrap"
            style={{ y: reduce ? 0 : heroImgY }}
            animate={reduce ? {} : { scale: [1, 1.04, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/hero-care.png"
              alt="A patient and two healthcare professionals in a calm consultation"
              fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          </motion.div>
          <motion.div className="float-card card-one"
            animate={reduce ? {} : { y: [0, -8, 0], rotate: [0, 0.5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.07, y: -14 }}>
            <small>CONNECTED RECORDS</small>
            <strong>Every chapter, in one place.</strong>
          </motion.div>
          <motion.div className="float-card card-two"
            animate={reduce ? {} : { y: [0, 8, 0], rotate: [0, -0.4, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.07, y: 12 }}>
            <motion.span
              animate={{ rotate: [0, 14, 0, -14, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
              style={{ display: "flex", alignItems: "center" }}>
              <ShieldCheck size={18} />
            </motion.span>
            <span>Protected at every step</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section id="approach" className="mission section">

        {/* Left: full-height image panel */}
        <Reveal v="left" className="mission-visual">
          <div className="mission-img-frame">
            <Image src="/images/ourBelief.png" alt="A considered moment of care" fill
              sizes="(max-width: 800px) 100vw, 50vw" />
            <div className="mission-img-overlay" />
          </div>
          <motion.div
            className="mission-float-tag"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, ease }}
          >
            <span className="mission-tag-eyebrow">Our belief</span>
            <span className="mission-tag-line">Health for everyone.</span>
          </motion.div>
        </Reveal>

        {/* Right: content + pillars */}
        <Reveal delay={0.18} v="fade" className="mission-content">
          <p className="eyebrow">Our belief</p>
          <SplitHeading text="Health literacy should belong to everyone." />
          <p className="mission-body">
            The ability to obtain, understand and use health information is still out of reach for too many people. We are here to find a better way — making the exchange of health records more connected, secure and deeply understandable.
          </p>

          <motion.div
            className="mission-pillars"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } } }}
          >
            {([
              ["Connected",     "Every record, every touchpoint — unified in one place."],
              ["Secure",        "Privacy and protection built into every layer."],
              ["Understandable","Clarity that empowers people to act with confidence."],
            ] as const).map(([title, desc]) => (
              <motion.div
                key={title}
                className="mission-pillar"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <strong>{title}</strong>
                <span>{desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      </section>

      {/* ── Partners & Integrations ─────────────────────────────────────── */}
      <section className="partners section">
        <Reveal v="blur" className="partners-header">
          <p className="eyebrow">Integrated Infrastructure</p>
          <SplitHeading text="Built on industry-leading health standards and trusted verification." />
        </Reveal>

        <motion.div
          className="partners-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14 } },
          }}
        >
          {/* Flexpa */}
          <motion.div
            className="partner-card"
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.65, ease } },
            }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <div className="partner-logo-wrap">
              <svg viewBox="0 0 190 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-svg flexpa-svg">
                <g fill="currentColor">
                  <rect x="2" y="6" width="9" height="9" rx="1.5" />
                  <rect x="14" y="6" width="9" height="9" rx="1.5" />
                  <rect x="2" y="18" width="9" height="9" rx="1.5" />
                  <rect x="2" y="30" width="9" height="9" rx="1.5" />
                  <rect x="14" y="18" width="9" height="9" rx="1.5" />
                  <text x="34" y="32" fontFamily="Inter, var(--font-inter), sans-serif" fontSize="28" fontWeight="600" letterSpacing="-0.03em">Flexpa</text>
                </g>
              </svg>
            </div>
            <div className="partner-info">
              <span className="partner-label">Health Data Access</span>
              <p>Direct patient data access and standardized FHIR infrastructure.</p>
            </div>
          </motion.div>

          {/* CLEAR */}
          <motion.div
            className="partner-card"
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.65, ease } },
            }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <div className="partner-logo-wrap">
              <svg viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-svg clear-svg">
                <g fill="currentColor">
                  <circle cx="18" cy="22" r="2.2" />
                  <circle cx="18" cy="12" r="1.6" /><circle cx="18" cy="32" r="1.6" />
                  <circle cx="8"  cy="22" r="1.6" /><circle cx="28" cy="22" r="1.6" />
                  <circle cx="11" cy="15" r="1.6" /><circle cx="25" cy="29" r="1.6" />
                  <circle cx="11" cy="29" r="1.6" /><circle cx="25" cy="15" r="1.6" />
                  <circle cx="18" cy="6"  r="1.2" /><circle cx="18" cy="38" r="1.2" />
                  <circle cx="2"  cy="22" r="1.2" /><circle cx="34" cy="22" r="1.2" />
                  <circle cx="7"  cy="11" r="1.2" /><circle cx="29" cy="33" r="1.2" />
                  <circle cx="7"  cy="33" r="1.2" /><circle cx="29" cy="11" r="1.2" />
                  <text x="48" y="29" fontFamily="Inter, var(--font-inter), sans-serif" fontSize="21" fontWeight="700" letterSpacing="0.22em">CLEAR</text>
                </g>
              </svg>
            </div>
            <div className="partner-info">
              <span className="partner-label">Identity Verification</span>
              <p>Secure identity proofing for seamless healthcare access.</p>
            </div>
          </motion.div>

          {/* SBA Veteran-Owned Certified */}
          <motion.div
            className="partner-card"
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
              show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.65, ease } },
            }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <div className="partner-logo-wrap">
              <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-svg sba-svg">
                <rect x="2" y="2" width="156" height="76" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="6" y="6" width="148" height="68" rx="3" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 2" fill="none"/>
                <text x="80" y="27" textAnchor="middle" fontFamily="Inter, var(--font-inter), sans-serif" fontSize="16" fontWeight="800" fill="currentColor" letterSpacing="0.1em">SBA</text>
                <text x="80" y="37" textAnchor="middle" fontFamily="Inter, var(--font-inter), sans-serif" fontSize="5.5" fontWeight="600" fill="currentColor" letterSpacing="0.05em">U.S. Small Business Administration</text>
                <rect x="12" y="43" width="136" height="23" rx="2.5" fill="currentColor"/>
                <text x="80" y="58" textAnchor="middle" fontFamily="Inter, var(--font-inter), sans-serif" fontSize="7.5" fontWeight="700" fill="var(--ivory)" letterSpacing="0.07em">VETERAN-OWNED CERTIFIED</text>
              </svg>
            </div>
            <div className="partner-info">
              <span className="partner-label">Federal Accreditation</span>
              <p>Official Veteran-Owned Small Business certification by U.S. SBA.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Flow ──────────────────────────────────────────────────────────── */}
      <section className="flow section">
        <Reveal v="blur">
          <p className="eyebrow">A considered flow</p>
          <SplitHeading text="From a moment of care to a more complete understanding." />
        </Reveal>
        <motion.div className="flow-list"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } } }}>
          {flow.map((item, i) => (
            <motion.div className="flow-item" key={item}
              variants={{
                hidden: { opacity: 0, scale: 0.65, y: 28 },
                show:   { opacity: 1, scale: 1,    y: 0,
                  transition: { type: "spring", stiffness: 220, damping: 18 } },
              }}>
              <motion.span
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.16 }}>
                0{i + 1}
              </motion.span>
              <b>{item}</b>
              {i < flow.length - 1 && (
                <motion.i
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.45 + i * 0.16, ease }}
                  style={{ transformOrigin: "left" }} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section id="products" className="products section">
        <Reveal className="section-intro" v="blur">
          <p className="eyebrow">Our products</p>
          <SplitHeading text="Different paths. One belief in more understandable health." />
          <p>Each Solverein product is made to bring more agency, clarity and good into the healthcare experience.</p>
        </Reveal>
        {products.map(([name, image, title, body, action], i) => (
          <Reveal key={name} delay={0.06} className="product" v="blur">
            <motion.div className={`product-art art-${i + 1}`}
              whileHover={{ y: -10, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <Image src={image} alt={`${name} product`} fill sizes="(max-width: 800px) 100vw, 55vw" />
              <span className="product-image-shade" />
            </motion.div>
            <div>
              <p className="eyebrow">
                {i === 0 ? "Health understanding" : i === 1 ? "Health data operations" : "Health data for good"}
              </p>
              <h3>{title}</h3>
              <p>{body}</p>
              <motion.button
                className="product-link"
                onClick={openContact}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                {action} <ArrowDownRight size={18} />
              </motion.button>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section id="values" className="values section">
        <Reveal className="section-intro" v="blur">
          <p className="eyebrow">The Solverein values</p>
          <SplitHeading text="How we show up in the work that matters." />
        </Reveal>
        <motion.div className="values-grid"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}>
          {values.map(([title, body], i) => (
            <ValueCard key={title} title={title} body={body} index={i} />
          ))}
        </motion.div>
      </section>

      {/* ── Quote ─────────────────────────────────────────────────────────── */}
      <Reveal>
        <section className="quote">
          <motion.p
            initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}>
            {`"The future of health is not more information. It is the ability to see what matters, when it matters."`.split(" ").map((word, i) => (
              <motion.span key={i}
                style={{ display: "inline-block", marginRight: "0.25em" }}
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(8px)"  },
                  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55, ease } },
                }}>
                {word}
              </motion.span>
            ))}
          </motion.p>
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.35em" }}
            whileInView={{ opacity: 0.7, letterSpacing: "0.1em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.9, ease }}>
            The Solverein perspective
          </motion.span>
        </section>
      </Reveal>

      {/* ── Trust ─────────────────────────────────────────────────────────── */}
      <section id="trust" className="trust section">
        <Reveal v="blur">
          <p className="eyebrow">Designed with responsibility</p>
          <SplitHeading text="Trust is not a feature. It is the foundation." />
        </Reveal>
        <motion.div className="trust-grid"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}>
          {trustItems.map(([title, text]) => (
            <motion.article key={title}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } },
              }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <motion.span className="line"
                variants={{
                  hidden: { scaleX: 0 },
                  show:   { scaleX: 1, transition: { duration: 0.9, ease } },
                }}
                style={{ transformOrigin: "left" }} />
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Closing / Contact ─────────────────────────────────────────────── */}
      <section id="contact" className="closing section">
        <Reveal v="blur">
          <p className="eyebrow">A clearer path begins here</p>
          <SplitHeading text="Let's make health information work more humanly." />
          <Button onClick={openContact}>Start a conversation</Button>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}>
        <div className="footer-main">
          <div>
            <Brand variant="light" />
            <p className="footer-tag">Health data solutions</p>
            <div className="socials">
              {(["Facebook", "Instagram", "LinkedIn"] as const).map((label, i) => (
                <motion.a key={label} aria-label={label} href="#"
                  whileHover={{ y: -3, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  {["f", "ig", "in"][i]}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="footer-links">
            <p>Explore</p>
            {(["Products", "Who we are", "Values", "Contact"] as const).map((label, i) => (
              label === "Contact"
                ? <motion.button key={label} className="footer-contact-btn"
                    onClick={openContact}
                    whileHover={{ x: 5, color: "#fff" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    {label}
                  </motion.button>
                : <motion.a key={label}
                    href={`#${(["products","approach","values"] as const)[i]}`}
                    whileHover={{ x: 5, color: "#fff" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    {label}
                  </motion.a>
            ))}
          </div>
          <form className="subscribe">
            <p>Join our growing community</p>
            <div>
              <input aria-label="First name" placeholder="First name" />
              <input aria-label="Last name"  placeholder="Last name"  />
            </div>
            <input aria-label="Email" type="email" placeholder="Email address" />
            <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Subscribe <ArrowRight size={16} />
            </motion.button>
          </form>
        </div>
        <div className="footer-bottom">
          <span>Copyright 2026 Solverein</span>
          <a href="#">Privacy policy</a>
          <a href="#">Revocation of consent</a>
        </div>
      </motion.footer>
    </main>
  );
}
