import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Matter from 'matter-js'
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronUp,
  Clock,
  Copy,
  Gift,
  Hand,
  HeartHandshake,
  MailOpen,
  MapPin,
  Music2,
  Navigation,
  Palette,
  Quote,
  Send,
  Share2,
  Sparkles,
  UsersRound,
  VolumeX,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const captureMode = new URLSearchParams(window.location.search).get('capture') === '1'
const asset = (path) => `${import.meta.env.BASE_URL}${path}`

const wedding = {
  couple: 'Sarbuland & Rabiya',
  initials: 'S&R',
  dateLabel: '18-20 December 2026',
  venue: 'Khan Haveli, Khyber Pakhtunkhwa',
  targetDate: '2026-12-20T12:30:00+05:00',
  webhookUrl: import.meta.env.VITE_RSVP_WEBHOOK_URL || '/api/rsvp',
}

const media = {
  videos: {
    openerEnvelope: null,
    doorway: null,
    hourglass: null,
    mehndi: null,
    baraat: null,
    valima: null,
  },
  images: {
    openerEnvelope: asset('assets/zanjeerain/poster_hero.png'),
    doorway: asset('assets/zanjeerain/og_poster.png'),
    doorwayMobile: asset('assets/zanjeerain/poster_hero.png'),
    hourglass: asset('assets/zanjeerain/hourglass_duo.png'),
    mehndi: asset('assets/zanjeerain/event_mehndi.png'),
    baraat: asset('assets/zanjeerain/event_nikkah.png'),
    valima: asset('assets/zanjeerain/event_walima.png'),
    salami: asset('assets/zanjeerain/test_couple.png'),
    tasbeeh: asset('assets/zanjeerain/tasbeeh_hands.png'),
    story: [
      asset('assets/zanjeerain/story_ch1.png'),
      asset('assets/zanjeerain/story_ch2.png'),
      asset('assets/zanjeerain/story_ch3.png'),
      asset('assets/zanjeerain/story_ch4.png'),
    ],
  },
}

const events = [
  {
    slug: 'mehndi',
    title: 'Mehndi',
    urdu: 'مہندی',
    eyebrow: 'Lanterns, dholki, mountain air',
    date: 'Friday, 18 December 2026',
    shortDate: '18 Dec',
    time: '7:00 PM',
    venue: 'Upper Courtyard, Khan Haveli',
    locationHint: 'Lantern path opens after Maghrib',
    dressCode: 'Mustard, forest green, mirror-work, shawls',
    mood: 'The haveli courtyard finally sounds like laughter: dholki under cedar trees, marigolds against white stone, and two guarded hearts allowing themselves one bright evening.',
    note: 'Bring a warm shawl. The mountain air arrives before the dholki slows down.',
    flow: ['Kehwa welcome', 'Dholki', 'Mehndi rasam', 'Courtyard dinner'],
    palette: 'from-[#f2a51f] to-[#1f6b45]',
    accent: '#f2a51f',
    image: media.images.mehndi,
    video: media.videos.mehndi,
  },
  {
    slug: 'nikkah',
    title: 'Nikkah',
    urdu: 'نکاح',
    eyebrow: 'Qubool hai, amanat, new beginnings',
    date: 'Saturday, 19 December 2026',
    shortDate: '19 Dec',
    time: '8:00 PM',
    venue: 'White Diwan Hall, Khan Haveli',
    locationHint: 'Enter through the carved northern gate',
    dressCode: 'Deep maroon, midnight black, antique gold',
    mood: 'Beneath the old arches, promises are made softly. No grand speeches, just witnesses, family duas, and a love that chose patience over noise.',
    note: 'The nikkah will begin before dinner. Please be seated when the qazi arrives.',
    flow: ['Family arrival', 'Nikkah', 'Dua and salami', 'Haveli dinner'],
    palette: 'from-[#b0202f] to-[#c99b52]',
    accent: '#b0202f',
    image: media.images.baraat,
    video: media.videos.baraat,
  },
  {
    slug: 'valima',
    title: 'Walima',
    urdu: 'ولیمہ',
    eyebrow: 'Morning light, family, homecoming',
    date: 'Sunday, 20 December 2026',
    shortDate: '20 Dec',
    time: '12:30 PM',
    venue: 'Lower Gardens, Khan Haveli',
    locationHint: 'Follow the white rose path',
    dressCode: 'Ivory, sage, silver, soft blue',
    mood: 'A gentle finale in the lower gardens: white roses, mountain light, and a family finally watching Sarbuland and Rabiya walk forward without looking over their shoulders.',
    note: 'Lunch follows the family welcome and couple portraits in the garden.',
    flow: ['Garden welcome', 'Couple portraits', 'Walima lunch', 'Dua'],
    palette: 'from-[#f4ead7] to-[#7f8f90]',
    accent: '#c99b52',
    image: media.images.valima,
    video: media.videos.valima,
  },
]

function VideoLoop({ src, poster, className = '', label }) {
  if (!src) {
    return <img className={`${className} media-drift`} src={poster} alt={label} loading="eager" />
  }

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={captureMode ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={captureMode ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-90px' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedWords({ text, as: Tag = 'h2', className = '', delay = 0, immediate = false }) {
  const words = text.split(' ')
  const animateImmediately = immediate || captureMode

  return (
    <Tag className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span className="mr-[0.22em] inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '112%', opacity: 0, rotate: 2 }}
                animate={animateImmediately ? { y: '0%', opacity: 1, rotate: 0 } : undefined}
                whileInView={animateImmediately ? undefined : { y: '0%', opacity: 1, rotate: 0 }}
                transition={{ duration: 0.68, delay: delay + index * 0.075, ease: [0.22, 1, 0.36, 1] }}
                viewport={animateImmediately ? undefined : { once: true, margin: '-70px' }}
              >
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 && <wbr />}
          </span>
        ))}
      </span>
    </Tag>
  )
}

function useReducedMotionPreference() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return prefersReduced
}

function useMobileViewport() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return mobile
}

function useGuestName() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('guest')?.trim() || 'Family'
  }, [])
}

function DawatEnvelopeGate({ onOpened, reducedMotion, guestName }) {
  const overlayRef = useRef(null)
  const stageRef = useRef(null)
  const flapRef = useRef(null)
  const pocketRef = useRef(null)
  const cardRef = useRef(null)
  const sealRef = useRef(null)
  const glowRef = useRef(null)
  const crackRef = useRef(null)
  const promptRef = useRef(null)
  const startY = useRef(null)
  const [opening, setOpening] = useState(false)

  const openEnvelope = () => {
    if (opening) return
    setOpening(true)
    const compact = window.matchMedia('(max-width: 640px)').matches

    if (reducedMotion) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.24,
        ease: 'power2.out',
        onComplete: onOpened,
      })
      return
    }

    gsap
      .timeline({ defaults: { ease: 'power4.inOut' }, onComplete: onOpened })
      .to(promptRef.current, { opacity: 0, y: 12, duration: 0.22 }, 0)
      .to(crackRef.current, { opacity: 1, scale: 1.1, duration: 0.2, ease: 'power2.out' }, 0.02)
      .to('.wax-bit', { opacity: 1, scale: 1, x: 'random(-44,44)', y: 'random(-38,18)', rotate: 'random(-80,80)', stagger: 0.018, duration: 0.32 }, 0.04)
      .to(sealRef.current, { scale: 0.72, rotate: 18, opacity: 0, duration: 0.34 }, 0.18)
      .to(glowRef.current, { opacity: 1, scale: 1.05, duration: 0.42 }, 0.2)
      .to(flapRef.current, { rotateX: -148, y: -18, transformOrigin: '50% 0%', duration: 0.74 }, 0.3)
      .to(pocketRef.current, { y: 18, filter: 'brightness(1.12)', duration: 0.54 }, 0.38)
      .to(cardRef.current, { y: compact ? '-23vh' : '-31vh', opacity: 1, scale: 1.035, duration: 0.86 }, 0.5)
      .to(glowRef.current, { scale: 1.8, opacity: 1, duration: 0.76 }, 0.72)
      .to(stageRef.current, { scale: compact ? 1.16 : 1.32, y: compact ? '-3vh' : '-6vh', filter: 'brightness(1.25)', duration: 0.82 }, 0.86)
      .to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.48 }, 1.26)
  }

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-[90] overflow-hidden bg-[#071423]"
      onPointerDown={(event) => {
        startY.current = event.clientY
      }}
      onPointerUp={(event) => {
        if (startY.current === null) return
        const distance = event.clientY - startY.current
        startY.current = null
        if (distance < -42) openEnvelope()
      }}
      initial={{ opacity: 1 }}
    >
      <div className="absolute inset-0 opacity-38">
        <VideoLoop
          src={media.videos.openerEnvelope}
          poster={media.images.openerEnvelope}
          label="Luxury wedding envelope texture"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#071423]/55" />
      </div>
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-[58%] h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,238,174,.65),rgba(242,165,31,.3)_30%,rgba(176,32,47,.16)_52%,transparent_72%)] opacity-0 blur-2xl"
      />
      <div className="relative grid min-h-screen place-items-center px-4 py-7">
        <motion.div
          ref={stageRef}
          className="dawat-gate-stage"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <div ref={cardRef} className="dawat-invite-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#9a1630]">Private dawat</p>
            <p className="mt-4 text-sm font-semibold text-[#5b3430]">Dear {guestName},</p>
            <h1 className="mt-3 text-balance font-display text-[clamp(2.15rem,9vw,4.5rem)] font-semibold leading-[0.94] text-[#2c0b12]">
              {wedding.couple}
            </h1>
            <p className="mx-auto mt-4 hidden max-w-sm text-sm font-semibold leading-7 text-[#68413a] sm:block">
              With duas and the blessings of both families, your presence is requested for the wedding celebrations.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#9a1630]">{wedding.dateLabel}</p>
          </div>

          <div className="dawat-envelope" aria-hidden="true">
            <div className="dawat-envelope-back">
              <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffe5a1]">A private dawat awaits</p>
              <p className="mt-3 max-w-full text-balance font-display text-[clamp(1.55rem,6.4vw,3rem)] font-semibold leading-[0.94] text-parchment">{wedding.couple}</p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f7e4bf]/78">{wedding.dateLabel}</p>
            </div>
            <div ref={flapRef} className="dawat-envelope-flap" />
            <div className="dawat-envelope-side dawat-envelope-side-left" />
            <div className="dawat-envelope-side dawat-envelope-side-right" />
            <div ref={pocketRef} className="dawat-envelope-pocket" />
          </div>

          <motion.button
            ref={sealRef}
            type="button"
            drag="y"
            dragConstraints={{ top: -84, bottom: 20 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.y < -32 || info.velocity.y < -260) openEnvelope()
            }}
            onClick={openEnvelope}
            className="seal-shine dawat-wax-seal"
            aria-label="Open Sarbuland and Rabiya invitation"
            whileTap={{ scale: 0.96 }}
          >
            <span className="font-display text-3xl font-semibold">{wedding.initials}</span>
            <span ref={crackRef} className="wax-crack" />
            {[0, 1, 2, 3, 4, 5].map((bit) => (
              <span key={bit} className="wax-bit" />
            ))}
          </motion.button>
        </motion.div>

        <div ref={promptRef} className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#f6d88b]/28 bg-[#071423]/78 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f7e4bf] shadow-glow backdrop-blur-md sm:bottom-9">
          <ChevronUp className="h-4 w-4" />
          Tap {wedding.initials} or swipe up
        </div>
      </div>
    </motion.div>
  )
}

function InfoPill({ icon: Icon, label }) {
  return (
    <div className="glass-panel flex min-h-14 min-w-0 items-center gap-2 overflow-hidden rounded-[8px] px-3 py-2.5 sm:min-h-16 sm:gap-3 sm:px-4 sm:py-3">
      <Icon className="h-4 w-4 shrink-0 text-marigold sm:h-5 sm:w-5" strokeWidth={1.7} />
      <span className="min-w-0 break-words text-balance text-xs font-medium leading-5 sm:text-sm">{label}</span>
    </div>
  )
}

function HeroPortal() {
  const sectionRef = useRef(null)
  const videoShellRef = useRef(null)
  const copyRef = useRef(null)
  const glowRef = useRef(null)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('section')) return undefined
    const mediaQuery = gsap.matchMedia()

    mediaQuery.add('(min-width: 768px)', () => {
      const context = gsap.context(() => {
        gsap.to(videoShellRef.current, {
          scale: 2.08,
          borderRadius: 0,
          boxShadow: '0 0 160px rgba(242,165,31,.42)',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=1050', scrub: true, pin: true },
        })
        gsap.to(copyRef.current, {
          y: -60,
          opacity: 0.18,
          filter: 'blur(8px)',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=740', scrub: true },
        })
        gsap.to(glowRef.current, {
          opacity: 1,
          scale: 1.5,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=840', scrub: true },
        })
      }, sectionRef)
      return () => context.revert()
    })

    mediaQuery.add('(max-width: 767px)', () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          videoShellRef.current,
          { scale: 0.96, borderRadius: 8 },
          {
            scale: 1.12,
            borderRadius: 0,
            ease: 'none',
            scrollTrigger: { trigger: videoShellRef.current, start: 'top 82%', end: 'bottom 18%', scrub: 0.45 },
          },
        )
        gsap.to(copyRef.current, {
          y: -18,
          opacity: 0.72,
          ease: 'none',
          scrollTrigger: { trigger: videoShellRef.current, start: 'top 88%', end: 'top 28%', scrub: 0.4 },
        })
      }, sectionRef)
      return () => context.revert()
    })

    return () => mediaQuery.revert()
  }, [])
  return (
    <section ref={sectionRef} data-particle="glitter" className="relative flex min-h-0 items-center overflow-hidden bg-[#071423] px-4 py-14 md:min-h-screen md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(242,165,31,.22),transparent_34rem)]" />
      <div ref={glowRef} className="pointer-events-none absolute left-1/2 top-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,232,166,.42),rgba(242,165,31,.2)_38%,transparent_70%)] opacity-0 blur-3xl" />
      <div className="hero-portal-inner relative mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <Reveal className="hero-portal-copy z-10 mx-auto w-full min-w-0 max-w-xl overflow-hidden text-center lg:mx-0 lg:text-left">
          <div ref={copyRef}>
          <p className="mb-4 hidden text-xs font-bold uppercase tracking-[0.42em] text-marigold sm:block">Bismillah-ir-Rahman-ir-Rahim</p>
          <div className="sm:hidden">
            <AnimatedWords text="Sarbuland" immediate className="font-display text-5xl font-semibold leading-[0.92] text-parchment" />
            <AnimatedWords text="& Rabiya" immediate className="mt-1 font-display text-5xl font-semibold leading-[0.92] text-parchment" />
          </div>
          <AnimatedWords text={wedding.couple} immediate className="hidden max-w-full font-display text-7xl font-semibold leading-[0.9] text-parchment sm:block lg:text-8xl" />
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[#f7e4bf]/86 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
            Sarbuland and Rabiya request your presence as their families gather for three celebrations at Khan Haveli.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-3 text-left text-sm text-[#fff8ea]/86 sm:mt-8 sm:grid-cols-2">
            <InfoPill icon={CalendarDays} label={wedding.dateLabel} />
            <InfoPill icon={MapPin} label={wedding.venue} />
          </div>
          </div>
        </Reveal>
        <div ref={videoShellRef} className="relative aspect-[4/3] w-full min-w-0 max-w-full overflow-hidden rounded-[8px] border border-[#f6d88b]/24 bg-black shadow-gold-soft sm:aspect-[16/9]">
          <picture>
            <source media="(max-width: 639px)" srcSet={media.images.doorwayMobile} />
            <img src={media.images.doorway} alt="Sarbuland and Rabiya beneath the haveli lights" className="media-drift h-full w-full object-cover" />
          </picture>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(19,5,8,.52)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071423] to-transparent" />
        </div>
      </div>
    </section>
  )
}

function RasamTimeline() {
  const links = useMemo(
    () => [
      { label: 'Story', target: 'story-chapters' },
      ...events.map((event) => ({ label: event.title, target: `event-${event.slug}` })),
      { label: 'Confirm', target: 'confirm' },
    ],
    [],
  )
  const [active, setActive] = useState(links[0].target)

  useEffect(() => {
    const updateActive = () => {
      const current = links
        .map((link) => ({ link, element: document.getElementById(link.target) }))
        .filter((item) => item.element)
        .map((item) => ({ target: item.link.target, top: Math.abs(item.element.getBoundingClientRect().top - 88) }))
        .sort((a, b) => a.top - b.top)[0]
      if (current?.target) setActive(current.target)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [links])

  return (
    <nav className="sticky top-0 z-50 border-y border-[#f6d88b]/18 bg-[#071423]/90 px-3 py-3 backdrop-blur-xl" aria-label="Wedding event timeline">
      <div className="rasam-timeline mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
        <div className="hidden h-px min-w-12 bg-gradient-to-r from-transparent via-[#f6d88b]/46 to-[#f6d88b]/16 sm:block" />
        {links.map((link) => (
          <button
            key={link.target}
            type="button"
            aria-current={active === link.target ? 'step' : undefined}
            onClick={() => document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' })}
            className={`group relative shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-[#f6d88b]/50 ${
              active === link.target
                ? 'border-[#f6d88b]/70 bg-[#f6d88b] text-[#2c0b12] shadow-[0_0_28px_rgba(242,165,31,.32)]'
                : 'border-[#f6d88b]/24 bg-[#fff8ea]/8 text-[#fff8ea]/86 hover:border-[#f6d88b]/60 hover:bg-[#fff8ea]/14'
            }`}
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current opacity-70" />
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

const storyChapters = [
  {
    eyebrow: 'Chapter one',
    title: 'Two lives beneath the same sky',
    text: 'Before the haveli knew their names together, there were only passing glances, stubborn silences, and two people carrying more than they ever said aloud.',
    image: media.images.story[0],
  },
  {
    eyebrow: 'Chapter two',
    title: 'The gate between them',
    text: 'Duty stood like carved iron between them. Still, kindness kept finding a way through: a protected truth, a shared grief, a door held open at the right moment.',
    image: media.images.story[1],
  },
  {
    eyebrow: 'Chapter three',
    title: 'A dua in the quiet',
    text: 'Rabiya asked for strength, not rescue. Sarbuland learned that standing beside someone can be braver than deciding their path for them.',
    image: media.images.story[2],
  },
  {
    eyebrow: 'Chapter four',
    title: 'A road chosen together',
    text: 'Not an ending written by the haveli. A beginning chosen in daylight, with room for memory, dignity, laughter, and a home of their own.',
    image: media.images.story[3],
  },
]

function StoryChapters() {
  const [active, setActive] = useState(0)
  const chapter = storyChapters[active]

  return (
    <section id="story-chapters" data-particle="glitter" className="relative scroll-mt-16 overflow-hidden bg-[#071423] px-4 py-16 text-parchment sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(45,78,112,.42),transparent_30rem),radial-gradient(circle_at_78%_70%,rgba(201,155,82,.16),transparent_24rem)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#d8b56b]">Their story, reimagined</p>
          <AnimatedWords text="Every zanjeer led them here." className="mt-4 font-display text-4xl font-semibold leading-none sm:text-7xl" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#dce6ef]/78 sm:mt-5 sm:text-lg sm:leading-8">Four quiet chapters before the wedding celebrations.</p>
        </Reveal>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            key={chapter.image}
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="story-image-shell"
          >
            <img src={chapter.image} alt={`${chapter.title} illustrated scene`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071423]/76 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#f0c66d]">{chapter.eyebrow}</p>
              <AnimatedWords key={chapter.title} text={chapter.title} as="h3" className="mt-2 max-w-xl font-display text-4xl font-semibold leading-none sm:text-6xl" />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {storyChapters.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                className={`story-chapter-button ${active === index ? 'is-active' : ''}`}
                aria-pressed={active === index}
              >
                <span className="story-chapter-number">0{index + 1}</span>
                <span>
                  <span className="block font-display text-2xl font-semibold leading-tight">{item.title}</span>
                  <span className="story-chapter-copy mt-2 block text-sm leading-6 text-[#dce6ef]/72">{item.text}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line no-unused-vars -- Optional extended-invite section.
function RasamPlayground() {
  const [mehndiReveal, setMehndiReveal] = useState(0)
  const [beats, setBeats] = useState(0)
  const [arrival, setArrival] = useState(38)
  const [bloomed, setBloomed] = useState(false)

  return (
    <section data-particle="mehndi" className="relative overflow-hidden bg-[#f8efd9] px-4 py-20 text-ink sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(31,107,69,.12),transparent_24rem),radial-gradient(circle_at_82%_30%,rgba(242,165,31,.18),transparent_24rem)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-rouge">Haveli rasmein</p>
          <AnimatedWords text="Four little moments before qubool hai." className="mt-4 font-display text-5xl font-semibold leading-none sm:text-7xl" />
          <p className="mt-5 text-lg leading-8 text-[#5b3430]">Find their initials in the mehndi, wake the dholki, guide Sarbuland through the haveli gate, and let the Walima garden bloom.</p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          <motion.div
            className="interactive-tile bg-[#fffaf1]"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const next = Math.round(((event.clientX - rect.left) / rect.width) * 100)
              setMehndiReveal(Math.max(0, Math.min(100, next)))
            }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <p className="tile-label">Hidden initials</p>
              <Hand className="h-5 w-5 text-[#1f6b45]" strokeWidth={1.7} />
            </div>
            <div className="mehndi-hand">
              <div className="mehndi-pattern" style={{ clipPath: `inset(0 ${100 - mehndiReveal}% 0 0)` }}>
                <span>{wedding.initials}</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#5b3430]">Move across the hand to find the initials.</p>
          </motion.div>

          <motion.button
            type="button"
            className="interactive-tile bg-[#fffaf1] text-left"
            onClick={() => setBeats((value) => value + 1)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <p className="tile-label">Dholki tap</p>
              <Music2 className="h-5 w-5 text-[#b46918]" strokeWidth={1.7} />
            </div>
            <div className={`dholki-face ${beats % 2 ? 'is-hit' : ''}`}>
              <span>{beats || 'Tap'}</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#5b3430]">Each tap warms the Mehndi lights.</p>
          </motion.button>

          <motion.div className="interactive-tile bg-[#fffaf1]" whileHover={{ y: -4 }}>
            <div className="flex items-center justify-between">
              <p className="tile-label">Haveli arrival</p>
              <Sparkles className="h-5 w-5 text-[#8c1323]" strokeWidth={1.7} />
            </div>
            <div className="baraat-stage">
              <div className="baraat-spotlight" style={{ left: `${arrival}%` }} />
              <span className="baraat-groom" style={{ left: `${arrival}%` }}>S</span>
            </div>
            <input
              aria-label="Move the baraat entrance spotlight"
              className="mt-5 w-full accent-[#8c1323]"
              type="range"
              min="10"
              max="90"
              value={arrival}
              onChange={(event) => setArrival(Number(event.target.value))}
            />
            <p className="mt-3 text-sm font-semibold text-[#5b3430]">Drag the spotlight to bring the groom in.</p>
          </motion.div>

          <motion.button
            type="button"
            className={`interactive-tile bg-[#fffaf1] text-left ${bloomed ? 'is-bloomed' : ''}`}
            onClick={() => setBloomed((value) => !value)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <p className="tile-label">Walima bloom</p>
              <Palette className="h-5 w-5 text-[#7f8f90]" strokeWidth={1.7} />
            </div>
            <div className="valima-bloom" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((petal) => <span key={petal} />)}
            </div>
            <p className="mt-4 text-sm font-semibold text-[#5b3430]">Tap to open the floral stage.</p>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

function EventDetails() {
  return <section className="bg-[#071423] text-parchment">{events.map((event, index) => <EventStory key={event.title} event={event} index={index} />)}</section>
}

function EventStory({ event, index }) {
  const reverse = index % 2 === 1
  return (
    <article id={`event-${event.slug}`} data-particle={event.slug} className="relative scroll-mt-6 overflow-hidden px-4 py-14 sm:py-24">
      <div className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at ${reverse ? '72%' : '28%'} 35%, ${event.accent}33, transparent 28rem)` }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <Reveal className={reverse ? 'lg:order-2' : ''}>
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-marigold">{event.eyebrow}</p>
          <motion.p
            className="mt-3 text-left font-urdu text-4xl leading-none text-[#d8b56b]/72 sm:text-5xl"
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            lang="ur"
            dir="rtl"
          >
            {event.urdu}
          </motion.p>
          <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
            <AnimatedWords text={event.title} className="font-display text-5xl font-semibold leading-none sm:text-8xl" />
            <span className="mb-2 rounded-full border border-[#f6d88b]/24 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f6d88b]">{event.shortDate}</span>
          </div>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#f7e4bf]/84 sm:mt-6 sm:text-lg sm:leading-8">{event.mood}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
            <InfoPill icon={CalendarDays} label={event.date} />
            <InfoPill icon={Clock} label={event.time} />
            <InfoPill icon={MapPin} label={event.venue} />
            <InfoPill icon={Navigation} label={event.locationHint} />
          </div>
          <div className="mt-8 hidden gap-5 sm:grid md:grid-cols-[0.9fr_1.1fr]">
            <DetailBox icon={Palette} title="Dress mood" text={event.dressCode} />
            <div className="glass-panel rounded-[8px] p-5">
              <div className="mb-3 flex items-center gap-3 text-[#f6d88b]">
                <Music2 className="h-5 w-5" strokeWidth={1.7} />
                <h3 className="text-sm font-bold uppercase tracking-[0.22em]">Evening flow</h3>
              </div>
              <div className="grid gap-2">{event.flow.map((item, flowIndex) => <div key={item} className="flex items-center gap-3 text-sm text-[#fff8ea]/82"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f2a51f]/15 text-xs font-bold text-[#f6d88b]">{flowIndex + 1}</span>{item}</div>)}</div>
            </div>
          </div>
          <div className="mt-6 hidden gap-4 rounded-[8px] border border-[#f6d88b]/18 bg-[#fff8ea]/7 p-5 sm:flex">
            <Quote className="mt-1 h-5 w-5 shrink-0 text-marigold" strokeWidth={1.7} />
            <p className="text-sm leading-7 text-[#fff8ea]/78">{event.note}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08} className={`relative mx-auto w-full max-w-[560px] ${reverse ? 'lg:order-1' : ''}`}>
          <div className="absolute -inset-4 rounded-[10px] bg-gradient-to-br from-[#f2a51f]/24 via-transparent to-[#8c1323]/24 blur-xl" />
          <div className="relative aspect-square overflow-hidden rounded-[8px] border border-[#f6d88b]/24 bg-[#071423] shadow-gold-soft sm:aspect-[3/4]">
            <VideoLoop src={event.video} poster={event.image} label={`${event.title} animation`} className="event-artwork h-full w-full object-contain" />
            <div className={`absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t ${event.palette} opacity-30`} />
          </div>
        </Reveal>
      </div>
    </article>
  )
}

function DetailBox({ icon: Icon, title, text }) {
  return (
    <div className="glass-panel rounded-[8px] p-5">
      <div className="mb-3 flex items-center gap-3 text-[#f6d88b]"><Icon className="h-5 w-5" strokeWidth={1.7} /><h3 className="text-sm font-bold uppercase tracking-[0.22em]">{title}</h3></div>
      <p className="text-sm leading-7 text-[#fff8ea]/82">{text}</p>
    </div>
  )
}

function CountdownHourglass() {
  const remaining = useCountdown(wedding.targetDate)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  return (
    <section
      data-particle="countdown"
      className="relative overflow-hidden bg-[#071423] px-4 py-16 sm:py-24"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setTilt({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 8,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * -8,
        })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,165,31,.18),transparent_34rem)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-7 text-center sm:mb-10"><p className="text-xs font-bold uppercase tracking-[0.42em] text-marigold">Countdown</p><AnimatedWords text="Until Khan Haveli opens its doors" className="mt-4 font-display text-4xl font-semibold leading-none text-parchment sm:text-7xl" /></Reveal>
        <div
          className="hourglass-tilt relative mx-auto aspect-[5/4] max-w-3xl overflow-hidden rounded-[8px] border border-[#f6d88b]/24 bg-[#071423] shadow-gold-soft sm:aspect-[4/5]"
          style={{ transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
        >
          <VideoLoop src={media.videos.hourglass} poster={media.images.hourglass} label="Animated hourglass countdown" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(27,7,16,.04),rgba(27,7,16,.72)_78%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6d88b]/20 blur-2xl" />
          <div className="absolute inset-x-4 bottom-4 grid grid-cols-4 gap-2 sm:inset-x-10 sm:bottom-10 sm:gap-4">{remaining.map((unit) => <div key={unit.label} className="glass-panel rounded-[8px] px-2 py-3 text-center sm:px-4 sm:py-5"><div className="font-display text-3xl font-semibold leading-none text-[#f6d88b] sm:text-6xl">{unit.value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fff8ea]/78 sm:text-xs">{unit.label}</div></div>)}</div>
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line no-unused-vars -- Optional extended-invite section.
function ScratchReveal() {
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const isDrawing = useRef(false)
  const points = useRef(0)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const paintFoil = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      gradient.addColorStop(0, '#7a4d25'); gradient.addColorStop(0.32, '#f7d889'); gradient.addColorStop(0.62, '#c99b52'); gradient.addColorStop(1, '#8c1323')
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = gradient; ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = 'rgba(7,20,35,.82)'; ctx.font = '700 12px Manrope, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SCRATCH WITH YOUR FINGER', rect.width / 2, rect.height / 2)
    }
    paintFoil(); window.addEventListener('resize', paintFoil); return () => window.removeEventListener('resize', paintFoil)
  }, [])
  const scratch = (event) => {
    if (!isDrawing.current && event.type !== 'pointerdown') return
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect()
    ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 26, 0, Math.PI * 2); ctx.fill()
    points.current += 1; if (points.current > 24) setRevealed(true)
  }
  return (
    <section id="scratch-note" data-particle="glitter" className="relative scroll-mt-16 overflow-hidden bg-[#fff8ea] px-4 py-24 text-ink sm:py-32">
      <img src={media.images.tasbeeh} alt="" className="pointer-events-none absolute -right-20 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full object-cover opacity-[0.08]" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal><p className="text-xs font-bold uppercase tracking-[0.42em] text-rouge">A hidden dua</p><AnimatedWords text="Scratch the antique foil for their note." className="mt-4 font-display text-5xl font-semibold leading-none sm:text-7xl" /><p className="mt-6 max-w-xl text-lg leading-8 text-[#5b3430]">Some words belong behind a veil until the right hands uncover them.</p></Reveal>
        <div className="relative min-h-[320px] overflow-hidden rounded-[8px] border border-[#d8b56b] bg-[#071423] p-5 shadow-[0_30px_90px_rgba(5,11,20,.28)]">
          <div className="relative grid min-h-[280px] place-items-center rounded-[6px] border border-[#f6d88b]/28 px-6 text-center text-parchment">
            <div><p className="text-xs font-bold uppercase tracking-[0.36em] text-marigold">Revealed</p><p className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">Some chains are broken. Some promises set you free.</p><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#fff8ea]/76">Bring one dua for the road behind them, and one smile for the home they are about to build.</p></div>
            <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full touch-none rounded-[6px] transition-opacity duration-700 ${revealed ? 'opacity-0' : 'opacity-100'}`} onPointerDown={(event) => { isDrawing.current = true; scratch(event) }} onPointerMove={scratch} onPointerUp={() => { isDrawing.current = false }} onPointerLeave={() => { isDrawing.current = false }} aria-label="Scratch to reveal a note" />
          </div>
        </div>
      </div>
    </section>
  )
}

function FamilyPhotoFlash() {
  const [flash, setFlash] = useState(false)

  const triggerFlash = () => {
    setFlash(true)
    window.setTimeout(() => setFlash(false), 520)
  }

  return (
    <div className="relative mt-6 overflow-hidden rounded-[8px] border border-[#f6d88b]/18 bg-[#fff8ea]/7 p-4">
      <button
        type="button"
        onClick={triggerFlash}
        className="inline-flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#f6d88b]/26 bg-[#071423]/48 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f6d88b] transition hover:bg-[#fff8ea]/12 focus:outline-none focus:ring-2 focus:ring-[#f6d88b]/50"
      >
        <Camera className="h-5 w-5" />
        Family photo flash
      </button>
      <div className={`camera-flash ${flash ? 'is-flashing' : ''}`} aria-hidden="true" />
      {flash && <p className="mt-3 text-center text-sm font-semibold text-[#fff8ea]/78">One proper family photo, please.</p>}
    </div>
  )
}

// eslint-disable-next-line no-unused-vars -- Optional extended-invite section.
function SalamiSection() {
  const [opened, setOpened] = useState(false)

  return (
    <section id="salami" data-particle="salami" className="relative scroll-mt-16 overflow-hidden bg-[#071423] px-4 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(242,165,31,.22),transparent_32rem),radial-gradient(circle_at_20%_70%,rgba(176,32,47,.26),transparent_30rem)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[8px] border border-[#f6d88b]/24 bg-black shadow-gold-soft">
            <img src={media.images.salami} alt="Bride and groom shyly holding a salami envelope" className="aspect-[16/10] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071423]/82 via-transparent to-transparent" />
            <motion.button
              type="button"
              drag
              dragElastic={0.22}
              dragConstraints={{ left: -70, right: 70, top: -34, bottom: 34 }}
              onClick={() => setOpened((value) => !value)}
              className={`salami-envelope-button ${opened ? 'is-envelope-open' : ''}`}
              whileTap={{ scale: 0.96 }}
            >
              <MailOpen className="h-5 w-5" />
              Open the amanat
            </motion.button>
            <div className={`salami-note ${opened ? 'is-open' : ''}`}>
              <p className="font-display text-3xl font-semibold text-parchment">Dua received. Envelope noticed.</p>
              <p className="mt-2 text-sm font-semibold text-[#f7e4bf]/78">May every gift return as barakah.</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-marigold">Dua & salami</p>
          <AnimatedWords text="A little barakah for their next chapter." className="mt-4 font-display text-5xl font-semibold leading-none text-parchment sm:text-7xl" />
          <p className="mt-6 text-lg leading-8 text-[#f7e4bf]/82">Rabiya will insist your dua is enough. Sarbuland has still kept the envelope table close to the stage.</p>
          <div className="mt-8 grid gap-3"><InfoPill icon={Gift} label="Envelope table beside the stage" /><InfoPill icon={HeartHandshake} label="Duas first, salami second" /><InfoPill icon={Sparkles} label="Photo moment after family portraits" /></div>
          <FamilyPhotoFlash />
        </Reveal>
      </div>
    </section>
  )
}

function useCountdown(targetDate) {
  const calculate = useCallback(() => {
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
    return [{ label: 'Days', value: String(Math.floor(diff / 86_400_000)).padStart(2, '0') }, { label: 'Hours', value: String(Math.floor((diff / 3_600_000) % 24)).padStart(2, '0') }, { label: 'Mins', value: String(Math.floor((diff / 60_000) % 60)).padStart(2, '0') }, { label: 'Secs', value: String(Math.floor((diff / 1_000) % 60)).padStart(2, '0') }]
  }, [targetDate])
  const [remaining, setRemaining] = useState(calculate)
  useEffect(() => { const interval = window.setInterval(() => setRemaining(calculate()), 1000); return () => window.clearInterval(interval) }, [calculate])
  return remaining
}

function ShareInviteButton() {
  const [copied, setCopied] = useState(false)

  const shareInvite = async () => {
    const shareData = {
      title: `${wedding.couple} Wedding Invitation`,
      text: `You are invited to ${wedding.couple}'s wedding celebrations.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={shareInvite}
      className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#8c1323]/18 bg-[#fffaf1] px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8c1323] transition hover:border-[#8c1323]/42 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8c1323]/10"
    >
      {copied ? <Copy className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      {copied ? 'Link copied' : 'Share invite'}
    </button>
  )
}

function ConfirmInvitation() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [familyCount, setFamilyCount] = useState({ adults: 2, children: 0 })

  const updateFamilyCount = (event) => {
    const form = new FormData(event.currentTarget)
    setFamilyCount({
      adults: Number(form.get('adults') || 0),
      children: Number(form.get('children') || 0),
    })
  }

  const submit = async (event) => {
    event.preventDefault(); setStatus('submitting')
    const form = new FormData(event.currentTarget)
    const payload = { headOfFamily: form.get('headOfFamily'), adults: Number(form.get('adults')), children: Number(form.get('children')), attending: form.getAll('attending'), submittedAt: new Date().toISOString(), couple: wedding.couple }
    try {
      const response = await fetch(wedding.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Confirmation failed')
      setStatus('success'); setMessage('Shukriya. Your invitation confirmation has been received.'); event.currentTarget.reset()
    } catch {
      setStatus('error'); setMessage(wedding.webhookUrl === '/api/rsvp' ? 'Confirmation is not connected yet. Please share your response with the host family.' : 'We could not send the confirmation right now. Please try again in a moment.')
    }
  }
  return (
    <section id="confirm" data-particle="ivory" className="relative overflow-hidden bg-[#fff8ea] px-4 py-16 text-ink sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-rouge">Confirm invitation</p>
          <AnimatedWords text="Tell the hosts your family count." className="mt-4 font-display text-4xl font-semibold leading-none sm:text-7xl" />
          <p className="mt-5 max-w-xl text-base leading-7 text-[#5b3430] sm:mt-6 sm:text-lg sm:leading-8">A quick reply helps the family arrange seating, dinner, and a proper welcome at each rasam.</p>
          <div className="mt-8 hidden gap-3 text-sm font-semibold text-[#4a2825] sm:grid">
            <InfoLine icon={UsersRound} text="One response for the whole household." />
            <InfoLine icon={MapPin} text="Mark only the functions your family can attend." />
            <InfoLine icon={CheckCircle2} text="The hosts receive a clean confirmation." />
          </div>
          <ShareInviteButton />
        </Reveal>
        <form onSubmit={submit} onInput={updateFamilyCount} className="rounded-[8px] border border-[#8c1323]/14 bg-white p-4 shadow-[0_26px_80px_rgba(43,21,20,.14)] sm:p-8">
          <div className="mb-5 rounded-[8px] border border-[#d9b98a] bg-[#fffaf1] p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c1323]">Current count</p>
            <p className="mt-2 font-display text-4xl font-semibold text-ink">{familyCount.adults + familyCount.children} guests</p>
          </div>
          <div className="grid gap-5">
            <Field label="Head of Family" name="headOfFamily" type="text" placeholder="e.g. Mr. Faisal Ahmed" />
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Adults" name="adults" type="number" defaultValue="2" /><Field label="Children" name="children" type="number" defaultValue="0" /></div>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-bold uppercase tracking-[0.18em] text-[#8c1323]">Functions attending</legend>
              <div className="grid gap-3 sm:grid-cols-3">{events.map((event) => <label key={event.title} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[6px] border border-[#d9b98a] bg-[#fffaf1] px-3 text-sm font-semibold text-ink transition hover:border-[#8c1323]"><input name="attending" type="checkbox" value={event.title} defaultChecked className="h-4 w-4 accent-[#8c1323]" /><span>{event.title}</span></label>)}</div>
            </fieldset>
          </div>
          <button type="submit" disabled={status === 'submitting'} className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[6px] bg-[#8c1323] px-5 text-sm font-bold uppercase tracking-[0.2em] text-parchment shadow-[0_18px_40px_rgba(140,19,35,.28)] transition hover:bg-[#6f0d19] focus:outline-none focus:ring-4 focus:ring-[#8c1323]/20 disabled:cursor-wait disabled:opacity-70"><Send className="h-5 w-5" />{status === 'submitting' ? 'Confirming' : 'Confirm Invitation'}</button>
          {message && <p className={`mt-4 rounded-[6px] px-4 py-3 text-sm font-semibold ${status === 'success' ? 'bg-[#1f6b45]/10 text-[#1f6b45]' : 'bg-[#8c1323]/10 text-[#8c1323]'}`}>{message}</p>}
        </form>
      </div>
    </section>
  )
}

function Field({ label, name, type, placeholder, defaultValue }) {
  return <label className="grid gap-2"><span className="text-sm font-bold uppercase tracking-[0.18em] text-[#8c1323]">{label}</span><input required name={name} type={type} min={type === 'number' ? '0' : undefined} max={type === 'number' ? '20' : undefined} defaultValue={defaultValue} placeholder={placeholder} className="h-14 rounded-[6px] border border-[#d9b98a] bg-[#fffaf1] px-4 text-base text-ink outline-none transition focus:border-[#8c1323] focus:ring-4 focus:ring-[#8c1323]/10" /></label>
}

function InfoLine({ icon: Icon, text }) {
  return <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#8c1323]/10 text-[#8c1323]"><Icon className="h-5 w-5" strokeWidth={1.7} /></span><span>{text}</span></div>
}

function MotionToggle({ disabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={disabled ? 'Turn motion on' : 'Reduce motion'}
      aria-label={disabled ? 'Turn motion on' : 'Reduce motion'}
      className="fixed bottom-4 right-4 z-[70] hidden h-12 w-12 place-items-center rounded-full border border-[#f6d88b]/24 bg-[#071423]/78 text-[#f6d88b] shadow-glow backdrop-blur-md transition hover:bg-[#fff8ea]/12 focus:outline-none focus:ring-2 focus:ring-[#f6d88b]/50 sm:grid"
    >
      {disabled ? <VolumeX className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
    </button>
  )
}

function MarigoldPhysics({ disabled }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const lastSpawnRef = useRef(0)
  const activeThemeRef = useRef('marigold')
  useEffect(() => {
    if (disabled) return undefined
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const engine = Matter.Engine.create()
    engine.gravity.y = 0.55
    const themes = {
      marigold: { colors: ['#f2a51f', '#f7c948', '#e97818', '#ffb22e'], shape: 'petal', alpha: 0.82 },
      mehndi: { colors: ['#f2a51f', '#f7c948', '#1f6b45', '#69a56b'], shape: 'petal', alpha: 0.82 },
      baraat: { colors: ['#b0202f', '#8c1323', '#c99b52', '#f6d88b'], shape: 'petal', alpha: 0.78 },
      valima: { colors: ['#fff8ea', '#d9e2df', '#c7bfb2', '#f5d6dd'], shape: 'confetti', alpha: 0.72 },
      glitter: { colors: ['#fff0b8', '#f6d88b', '#c99b52', '#ffffff'], shape: 'spark', alpha: 0.86 },
      countdown: { colors: ['#f6d88b', '#f2a51f', '#fff8ea', '#c99b52'], shape: 'spark', alpha: 0.82 },
      salami: { colors: ['#8c1323', '#b0202f', '#c99b52', '#f6d88b'], shape: 'envelope', alpha: 0.78 },
      ivory: { colors: ['#fff8ea', '#f6d88b', '#d8b56b', '#f4ead7'], shape: 'confetti', alpha: 0.72 },
    }
    const resize = () => { const ratio = window.devicePixelRatio || 1; canvas.width = window.innerWidth * ratio; canvas.height = window.innerHeight * ratio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const spawn = (x, y, burst = false) => { const theme = themes[activeThemeRef.current] || themes.marigold; const radius = 4 + Math.random() * 5; const body = Matter.Bodies.circle(x, y, radius, { frictionAir: 0.036, restitution: 0.2, label: 'petal', render: { fillStyle: theme.colors[Math.floor(Math.random() * theme.colors.length)] } }); body.plugin = { radius, stretch: 1.55 + Math.random() * 1.3, alpha: theme.alpha, shape: theme.shape }; Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * (burst ? 5 : 2.2), y: -Math.random() * (burst ? 4 : 1.2) }); Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1); Matter.World.add(engine.world, body) }
    const drawParticle = (body) => { const { x, y } = body.position; const { radius, stretch, alpha, shape } = body.plugin; context.save(); context.translate(x, y); context.rotate(body.angle); context.globalAlpha = alpha; context.fillStyle = body.render.fillStyle; if (shape === 'spark') { context.shadowColor = body.render.fillStyle; context.shadowBlur = 12; context.beginPath(); context.moveTo(0, -radius * 1.8); context.lineTo(radius * 0.55, -radius * 0.35); context.lineTo(radius * 1.8, 0); context.lineTo(radius * 0.55, radius * 0.35); context.lineTo(0, radius * 1.8); context.lineTo(-radius * 0.55, radius * 0.35); context.lineTo(-radius * 1.8, 0); context.lineTo(-radius * 0.55, -radius * 0.35); context.closePath(); context.fill() } else if (shape === 'confetti') { context.fillRect(-radius * 1.2, -radius * 0.55, radius * 2.4, radius * 1.1) } else if (shape === 'envelope') { context.fillRect(-radius * 1.6, -radius, radius * 3.2, radius * 2); context.strokeStyle = 'rgba(255,248,234,.42)'; context.lineWidth = 1; context.beginPath(); context.moveTo(-radius * 1.6, -radius); context.lineTo(0, radius * 0.25); context.lineTo(radius * 1.6, -radius); context.stroke() } else { context.beginPath(); context.ellipse(0, 0, radius * stretch, radius, 0, 0, Math.PI * 2); context.fill() } context.restore() }
    const draw = () => { Matter.Engine.update(engine, 1000 / 60); context.clearRect(0, 0, window.innerWidth, window.innerHeight); engine.world.bodies.forEach((body) => { if (body.label === 'petal') drawParticle(body) }); const remaining = engine.world.bodies.filter((body) => body.label !== 'petal' || body.position.y < window.innerHeight + 80); if (remaining.length !== engine.world.bodies.length) { Matter.Composite.clear(engine.world, false); Matter.World.add(engine.world, remaining) } rafRef.current = requestAnimationFrame(draw) }
    const onPointerMove = (event) => { const now = performance.now(); if (now - lastSpawnRef.current < 70) return; lastSpawnRef.current = now; spawn(event.clientX, event.clientY, true) }
    const onScroll = () => { const now = performance.now(); if (now - lastSpawnRef.current < 110) return; lastSpawnRef.current = now; spawn(Math.random() * window.innerWidth, -20); spawn(Math.random() * window.innerWidth, -24) }
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible?.target?.dataset?.particle) activeThemeRef.current = visible.target.dataset.particle }, { threshold: [0.18, 0.32, 0.5, 0.68] })
    resize(); document.querySelectorAll('[data-particle]').forEach((section) => observer.observe(section)); rafRef.current = requestAnimationFrame(draw); window.addEventListener('resize', resize); window.addEventListener('pointermove', onPointerMove); window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(rafRef.current); observer.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('scroll', onScroll); Matter.World.clear(engine.world); Matter.Engine.clear(engine) }
  }, [disabled])
  if (disabled) return null
  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden="true" />
}

function App() {
  const [opened, setOpened] = useState(() => new URLSearchParams(window.location.search).get('open') === '1')
  const prefersReducedMotion = useReducedMotionPreference()
  const mobileViewport = useMobileViewport()
  const [motionPaused, setMotionPaused] = useState(false)
  const reducedMotion = prefersReducedMotion || motionPaused
  const guestName = useGuestName()
  const year = useMemo(() => new Date().getFullYear(), [])
  const inviteShellProps = opened ? {} : { inert: true, 'aria-hidden': true }

  useEffect(() => {
    if (!opened) return undefined
    const target = new URLSearchParams(window.location.search).get('section')
    if (!target) return undefined
    const timeout = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }, 700)
    return () => window.clearTimeout(timeout)
  }, [opened])

  return (
    <main className="min-h-screen overflow-hidden bg-velvet text-parchment">
      {!opened && <DawatEnvelopeGate onOpened={() => setOpened(true)} reducedMotion={reducedMotion} guestName={guestName} />}
      <MarigoldPhysics disabled={reducedMotion || mobileViewport} />
      <MotionToggle disabled={reducedMotion} onToggle={() => setMotionPaused((value) => !value)} />
      <div {...inviteShellProps} className={opened ? '' : 'pointer-events-none select-none'}>
        <HeroPortal />
        <RasamTimeline />
        <StoryChapters />
        <EventDetails />
        <CountdownHourglass />
        <ConfirmInvitation />
        <footer className="bg-[#071423] px-4 py-10 text-center text-sm text-[#fff8ea]/64"><p className="font-display text-3xl text-[#f6d88b]">{wedding.couple}</p><p className="mt-2">A fan-concept dawat inspired by Zanjeerain. {year}</p></footer>
      </div>
    </main>
  )
}

export default App
