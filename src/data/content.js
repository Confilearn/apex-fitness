/*
  ── About: credential marquee strip ──
  Declared in the original but never rendered — carried over unused
  rather than dropped, since no marquee exists to feed it yet.
*/
export const creds = [
  'NASM Certified · ',
  'ACE Personal Trainer · ',
  'Strength & Conditioning Specialist · ',
  'Sports Nutrition · ',
  'FMS Level 2 · ',
  'NASM Certified · ',
  'ACE Personal Trainer · ',
  'Strength & Conditioning Specialist · ',
  'Sports Nutrition · ',
  'FMS Level 2 · ',
];

/* ── Services: 4 cards, unequal grid ── */
export const svcData = [
  { img: 'dumbbell-rack.jpg', n: '01', title: 'Build Real\nStrength', desc: 'Progressive overload built around your mechanics, not a template.' },
  { img: 'tire-flip.jpg', n: '02', title: 'Elite\nConditioning', desc: 'Metabolic work that raises your ceiling without burning muscle.' },
  { img: 'trainer-session.jpg', n: '03', title: 'Injury\nPrevention', desc: 'Movement screening and corrective protocols to keep you in the game.' },
  { img: 'treadmill.jpg', n: '04', title: 'Expert\nNutrition', desc: 'Practical nutrition built around your life — no dogma, no apps.', icon: true },
];

/* ── Process: steps 01–05 ── */
export const steps = [
  { n: '01', title: 'Discovery Call', desc: 'We dive into your goals, current challenges, and lifestyle to create a clear, strategic direction forward.' },
  { n: '02', title: 'Personalised Plan', desc: 'A tailored training and nutrition strategy built around your lifestyle and targets.' },
  { n: '03', title: 'Guided Training', desc: 'Structured training sessions with expert feedback, consistent support, and real accountability.' },
  { n: '04', title: 'Progress Tracking', desc: 'We closely monitor performance, body metrics, and make smart, data-driven adjustments.' },
  { n: '05', title: 'Level Up', desc: 'Once you hit your goal, we raise the standard and push you to the next level forward together.' },
];

/* ── Client Results: before/after pairs ── */
export const clientData = [
  {
    bSrc: '/assets/HPD31Is9b6bBtfNMYkDF_3AEQgQMc.png',
    aSrc: '/assets/y9rnykbUqH-Sn6mpG-onP_mMs4sRPz.png',
    result: '−24 lbs',
    name: 'Sarah M.',
    type: 'In-Person Training',
    dur: '12 Weeks',
    quote: 'I came in thinking I just needed motivation. What I got was a real plan — structured training, better habits, actual accountability. Down 24 lbs in 12 weeks and I feel like a different person.',
  },
  {
    bSrc: '/assets/XXEvMfEzElSH7J8D7M05W_twzYkTdz.png',
    aSrc: '/assets/e342ocVjsSlKmInsh81MB_tsW4MAsj.png',
    result: '+18 lbs muscle',
    name: 'Ryan T.',
    type: 'In-Person Training',
    dur: '16 Weeks',
    quote: 'I put on more muscle in 16 weeks than in the previous two years combined. The programming is precise — every set has a purpose. I finally understand what structured training actually means.',
  },
  {
    bSrc: '/assets/YkQEvrlowjSW_bLeiEWvv_MZkklzr9.png',
    aSrc: '/assets/gYD0puYAbMYAje6LkvWJs_KKTsOmPD.png',
    result: '−31 lbs',
    name: 'Daniel M.',
    type: 'In-Person Training',
    dur: '20 Weeks',
    quote: "I'd tried losing weight before but always stalled out after a few weeks. Having a real coach who adjusts the plan as you go changes everything. Down 31 lbs and I actually enjoy training now.",
  },
];

/* ── Reviews: editorial carousel ── */
export const reviewData = [
  {
    quote: "The conditioning work is no joke. I'm fitter than I was in my twenties. The nutrition guidance alongside training made everything click together.",
    name: 'Laurie M.',
    type: 'In-Person Training',
    dur: '8 months',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&q=80',
  },
  {
    quote: "I came in thinking I just needed a workout plan. What I got was a complete reset — how I train, eat, recover. Down 28 lbs in 14 weeks and I've kept every pound off.",
    name: 'Marcus R.',
    type: 'In-Person Training',
    dur: '14 weeks',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
  },
  {
    quote: 'Came back from a lower back injury not knowing what I could safely do. Now I\'m back to full training and stronger than I ever was before the injury. The rehab work was everything.',
    name: 'Marcus L.',
    type: 'Online Training',
    dur: '5 months',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80',
  },
  {
    quote: "Jordan tailors every session and takes recovery seriously. I'm in my forties and honestly in the best shape of my life. Age really is just a number when the programming is right.",
    name: 'Isabella N.',
    type: 'In-Person Training',
    dur: '1 year',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
  },
];

/* ── Pricing: two plans ── */
export const plans = [
  {
    name: 'Online',
    price: '$149',
    mo: '/mo',
    badge: false,
    desc: 'Full coaching, fully remote. Built for people who need flexibility without sacrificing results.',
    features: ['Custom training program', 'Weekly video check-ins', 'Nutrition guidance', 'Technique video review', '24/7 messaging access'],
  },
  {
    name: 'In-Person',
    price: '$249',
    mo: '/mo',
    badge: true,
    desc: 'Four sessions per week, side by side. The highest accountability and the fastest results.',
    features: ['4 sessions per week', 'Real-time form coaching', 'Custom training program', 'Nutrition & recovery plan', 'Body composition tracking'],
  },
];

/* ── FAQ: shared by both pages ── */
export const faqs = [
  { q: 'How does getting started work?', a: "Book a free 20-minute discovery call. We cover your goals, current fitness level, schedule, and any limitations. If we're a fit, your plan is ready within 48 hours." },
  { q: 'Do I need a gym membership?', a: "For in-person training, yes — we train at two gyms in San Francisco. For online coaching, I'll build your program around whatever equipment you have access to, including home setups." },
  { q: "I'm just starting out, is that okay?", a: "Beginners make some of the fastest progress. There's no base level required. We start where you are and build from there — no assumptions, no ego." },
  { q: "What's the difference between online and in-person?", a: 'In-person means we train together 4 days a week with real-time coaching. Online is fully remote with weekly check-ins, form reviews, and daily messaging access. Both get the same level of programming.' },
  { q: 'Do you offer flexible scheduling?', a: 'For in-person sessions, we lock in a recurring time slot that works for your calendar. Online clients train on their own schedule — the program is designed to work around your life.' },
  { q: 'Can I pause or cancel at any time?', a: "Yes. Month-to-month, no contracts. Give 7 days notice to pause or cancel. I'd rather you come back when you're ready than feel locked in." },
];

/* ── Location: in-person gyms ── */
export const gyms = [
  { name: 'Trainer Gym, SoMa', addr: '420 Bryant St, San Francisco, CA 94107', hrs: 'Mon–Fri  6am–9pm  ·  Sat–Sun  8am–6pm' },
  { name: 'Iron House, Mission', addr: '2961 Mission St, San Francisco, CA 94110', hrs: 'Mon–Fri  5:30am–10pm  ·  Sat–Sun  7am–8pm' },
];

/* ── Nav + footer section links ── */
export const navSections = ['About', 'Services', 'Process', 'Results', 'Pricing'];
export const footerSections = ['about', 'services', 'process', 'results', 'pricing', 'faq'];
