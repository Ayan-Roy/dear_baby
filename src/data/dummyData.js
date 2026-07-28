export const CURRENT_WEEK = 24;
export const DUE_DATE = new Date(2026, 10, 2); // Nov 2, 2026

export const EVENTS = [
  { id: 1, week: 6, date: "2026-02-14", title: "Two lines. We're pregnant.", cat: "Milestone", mood: "😭", note: "Took the test at 6am before work. Stared at it for ten minutes to be sure.", gold: true },
  { id: 2, week: 7, date: "2026-02-20", title: "First doctor visit", cat: "Medical", mood: "😊", note: "Dr. Rahman confirmed the pregnancy and gave us the due date." },
  { id: 3, week: 8, date: "2026-02-28", title: "We told grandma today", cat: "Family", mood: "🥹", note: "She cried before we even finished the sentence." },
  { id: 4, week: 9, date: "2026-03-09", title: "First ultrasound", cat: "Medical", mood: "😍", note: "A tiny flicker on the screen — that flicker is our baby's heart.", gold: true },
  { id: 5, week: 12, date: "2026-03-30", title: "Heard the heartbeat", cat: "Medical", mood: "🥰", note: "150 bpm. The nurse said 'strong and steady.'" },
  { id: 6, week: 16, date: "2026-04-27", title: "Started the maternity jeans era", cat: "Body", mood: "😄", note: "No shame. Comfort wins." },
  { id: 7, week: 18, date: "2026-05-11", title: "Baby responded to music", cat: "Custom", mood: "🎵", note: "Played Rabindra Sangeet and felt the tiniest flutter right after." },
  { id: 8, week: 20, date: "2026-05-25", title: "Anatomy scan — it's a girl!", cat: "Medical", mood: "💛", note: "Everything measuring right on track. We both cried in the parking lot.", gold: true },
  { id: 9, week: 22, date: "2026-06-08", title: "First real kick", cat: "Milestone", mood: "🥹", note: "Felt like a tiny bubble popping, then unmistakably a kick." },
  { id: 10, week: 24, date: "2026-06-22", title: "Painting the baby's room", cat: "Custom", mood: "🎨", note: "Sage green, of course. Dad got paint on his eyebrow." },
];

export const JOURNAL_SEED = [
  { id: 1, date: "2026-06-22", mood: "🎨", text: "Dear Baby, today we painted your room a soft sage green. Your dad got paint on his eyebrow and didn't notice for an hour. I keep imagining you in there, sleeping, and I already love that room so much." },
  { id: 2, date: "2026-06-08", mood: "🥹", text: "Dear Baby, I felt you kick today. A real one, not just a flutter. I was sitting so still I almost forgot to breathe. Welcome to the world, even if it's still a few months away." },
  { id: 3, date: "2026-05-25", mood: "💛", text: "Dear Baby, we saw your face today, sort of. The sonographer said 'it's a girl' and the room went quiet for a second before we both started crying. A girl. We can't wait to meet you." },
];

export const PROMPTS = [
  "What are you most looking forward to this week?",
  "Describe the last thing that made you laugh today.",
  "What do you hope your baby inherits from you?",
  "Write about a fear you're carrying — and set it down for a moment.",
  "What does your baby's kick feel like today?",
];

export const WEIGHT_DATA = [
  { week: 6, kg: 58 }, { week: 10, kg: 59 }, { week: 14, kg: 60.5 },
  { week: 18, kg: 62 }, { week: 22, kg: 64 }, { week: 24, kg: 65 },
];

export const VISITS = [
  { date: "2026-02-20", doctor: "Dr. Rahman", note: "Initial confirmation, prenatal vitamins prescribed", bp: "110/70" },
  { date: "2026-03-30", doctor: "Dr. Rahman", note: "Heartbeat check — 150 bpm, strong", bp: "112/72" },
  { date: "2026-05-25", doctor: "Dr. Rahman", note: "Anatomy scan, all measurements on track", bp: "115/74" },
  { date: "2026-06-22", doctor: "Dr. Rahman", note: "Routine check, glucose screening scheduled", bp: "116/75" },
];

export const CHECKLISTS = {
  "Hospital Bag": [
    { t: "Comfortable going-home outfit", done: true }, { t: "Phone charger", done: true },
    { t: "Nursing bras", done: false }, { t: "Baby's first outfit", done: false },
    { t: "Toiletries", done: false }, { t: "Important documents", done: false },
  ],
  "Baby Shopping": [
    { t: "Crib", done: true }, { t: "Car seat", done: true }, { t: "Diapers (newborn)", done: false },
    { t: "Onesies x10", done: false }, { t: "Baby monitor", done: false },
  ],
  "Mother Care": [
    { t: "Postpartum pads", done: false }, { t: "Nursing pillow", done: false }, { t: "Stretch mark oil", done: true },
  ],
  "Birth Plan": [
    { t: "Discuss pain relief options", done: true }, { t: "Choose hospital", done: true }, { t: "Write birth preferences letter", done: false },
  ],
};

export const BABY_NAMES = [
  { name: "Anwesha", meaning: "One who searches, seeker of knowledge", votes: 4 },
  { name: "Ishani", meaning: "Goddess, one who is powerful", votes: 3 },
  { name: "Meher", meaning: "Kindness, grace", votes: 5 },
  { name: "Ruhi", meaning: "Soul, spirit", votes: 2 },
];

export const GALLERY_ALBUMS = [
  { title: "Ultrasounds", cat: "Ultrasound", color: "linear-gradient(135deg,#C6767F,#E3A0A6)" },
  { title: "Bump Diary", cat: "Bump Diary", color: "linear-gradient(135deg,#B6764F,#D9A87E)" },
  { title: "Nursery & Prep", cat: "Nursery", color: "linear-gradient(135deg,#8E86A6,#B4ACC9)" },
  { title: "Milestones", cat: "Milestones", color: "linear-gradient(135deg,#C9932E,#E6C171)" },
];

export const INITIAL_PHOTOS = [
  {
    id: 1,
    url: "/images/ultrasound.jpg",
    title: "First Tiny Flicker (Ultrasound)",
    cat: "Ultrasound",
    week: 9,
    date: "2026-03-09",
    note: "A tiny flicker on the screen — 150 bpm. That flicker is our baby's heart.",
    fav: true
  },
  {
    id: 2,
    url: "/images/bump.jpg",
    title: "Week 20 Bump Progress",
    cat: "Bump Diary",
    week: 20,
    date: "2026-05-25",
    note: "Halfway there! Popping out in my cozy linen dress.",
    fav: true
  },
  {
    id: 3,
    url: "/images/nursery.jpg",
    title: "Sage Green Nursery Room",
    cat: "Nursery",
    week: 24,
    date: "2026-06-22",
    note: "Finished painting the crib wall! Soft sage green and natural wood details.",
    fav: false
  },
  {
    id: 4,
    url: "/images/booties.jpg",
    title: "First Knitted Booties",
    cat: "Milestones",
    week: 16,
    date: "2026-04-27",
    note: "Grandma knitted these tiny wool booties. Cannot wait to put them on those little feet.",
    fav: true
  }
];

export const MOODS = ["Happy", "Excited", "Emotional", "Tired", "Hopeful", "Loved", "Calm", "Anxious"];
