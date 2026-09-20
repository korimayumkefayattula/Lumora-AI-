export interface ScholarQuote {
  id: string;
  quote: string;
  author: string;
  title: string;
  era: string;
  category: 'Resilience & Grit' | 'Curiosity & Wonder' | 'Deep Focus & Habit' | 'Mathematical & Scientific Rigor' | 'Overcoming Failure' | 'Vision & Destiny';
  reflectionPrompt: string;
  accentColor: string;
}

export const SCHOLAR_QUOTES: ScholarQuote[] = [
  {
    id: 'einstein-1',
    quote: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    title: "Theoretical Physicist & Nobel Laureate",
    era: "1879 – 1955",
    category: "Resilience & Grit",
    reflectionPrompt: "When you feel stuck on a difficult calculation or proof, don't walk away immediately. Give yourself 10 more minutes of calm, focused contemplation.",
    accentColor: "from-amber-500 to-rose-600"
  },
  {
    id: 'feynman-1',
    quote: "I'd rather have questions that can't be answered than answers that can't be questioned.",
    author: "Richard Feynman",
    title: "Nobel Prize in Physics & Educator",
    era: "1918 – 1988",
    category: "Curiosity & Wonder",
    reflectionPrompt: "Never just accept a textbook formula without asking 'Why does this hold true?' Test it at the extremes: What if mass were zero? What if velocity reached infinity?",
    accentColor: "from-blue-600 to-indigo-700"
  },
  {
    id: 'curie-1',
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    title: "First Two-Time Nobel Laureate in Physics & Chemistry",
    era: "1867 – 1934",
    category: "Overcoming Failure",
    reflectionPrompt: "Exam anxiety dissolves when you replace uncertainty with methodical comprehension. Write down your single greatest study fear and break it down into 3 manageable steps.",
    accentColor: "from-emerald-500 to-teal-700"
  },
  {
    id: 'kalam-1',
    quote: "Excellence happens not by accident. It is a process. A continuous struggle towards greatness.",
    author: "Dr. A.P.J. Abdul Kalam",
    title: "Aerospace Scientist & 11th President of India",
    era: "1931 – 2015",
    category: "Deep Focus & Habit",
    reflectionPrompt: "Consistency beats sporadic cramming every single time. 2 hours of daily uninterrupted deep work creates compound academic mastery.",
    accentColor: "from-orange-500 to-rose-600"
  },
  {
    id: 'ramanujan-1',
    quote: "An equation means nothing to me unless it expresses a thought of God.",
    author: "Srinivasa Ramanujan",
    title: "Mathematician of the Infinite",
    era: "1887 – 1920",
    category: "Mathematical & Scientific Rigor",
    reflectionPrompt: "Look at math not as a mechanical chore, but as an aesthetic artform where symmetry and numerical balance tell a profound story.",
    accentColor: "from-purple-600 to-pink-700"
  },
  {
    id: 'aristotle-1',
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    title: "Philosopher & Polymath of Ancient Greece",
    era: "384 – 322 BCE",
    category: "Deep Focus & Habit",
    reflectionPrompt: "Your exam score will simply reflect the habits you practiced for the last 60 days. Protect your study schedule like a sacred commitment.",
    accentColor: "from-cyan-600 to-blue-800"
  },
  {
    id: 'sagan-1',
    quote: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
    title: "Astronomer, Planetary Scientist & Author",
    era: "1934 – 1996",
    category: "Curiosity & Wonder",
    reflectionPrompt: "The atom in your hand and the stars in the cosmos obey identical physical laws. Approach your science textbook with cosmic awe.",
    accentColor: "from-violet-600 to-indigo-900"
  },
  {
    id: 'newton-1',
    quote: "If I have seen further, it is by standing on the shoulders of giants.",
    author: "Sir Isaac Newton",
    title: "Formulator of Classical Gravitation & Calculus",
    era: "1643 – 1727",
    category: "Mathematical & Scientific Rigor",
    reflectionPrompt: "Every theorem you study today was unlocked through years of sweat by history's greatest minds. Honor their legacy by learning their logic deeply.",
    accentColor: "from-slate-700 to-zinc-900"
  },
  {
    id: 'tesla-1',
    quote: "The present is theirs; the future, for which I really worked, is mine.",
    author: "Nikola Tesla",
    title: "Inventor of Alternating Current & Electrical Visionary",
    era: "1856 – 1943",
    category: "Vision & Destiny",
    reflectionPrompt: "Short-term test setbacks do not define your potential. Keep building fundamental problem-solving mastery for the long game.",
    accentColor: "from-blue-500 to-cyan-700"
  },
  {
    id: 'hypatia-1',
    quote: "Reserve your right to think, for even to think wrongly is better than not to think at all.",
    author: "Hypatia of Alexandria",
    title: "Hellenistic Mathematician, Astronomer & Philosopher",
    era: "c. 360 – 415 CE",
    category: "Overcoming Failure",
    reflectionPrompt: "Never be afraid to get a question wrong during practice tests. An error identified and analyzed is a permanent mark gained in the real exam.",
    accentColor: "from-rose-500 to-purple-800"
  },
  {
    id: 'confucius-1',
    quote: "I hear and I forget. I see and I remember. I do and I understand.",
    author: "Confucius",
    title: "Philosopher & Teacher",
    era: "551 – 479 BCE",
    category: "Deep Focus & Habit",
    reflectionPrompt: "Reading notes passively gives an illusion of competence. Close the book and write the derivation from memory on a blank sheet.",
    accentColor: "from-amber-600 to-orange-800"
  },
  {
    id: 'lovelace-1',
    quote: "That brain of mine is something more than merely mortal; as time will show.",
    author: "Ada Lovelace",
    title: "Mathematician & Pioneer of Computer Science",
    era: "1815 – 1852",
    category: "Vision & Destiny",
    reflectionPrompt: "Cultivate audacious confidence in your cognitive growth. With deliberate practice, your neural pathways reorganize to conquer any subject.",
    accentColor: "from-pink-600 to-purple-900"
  }
];

export const QUOTE_CATEGORIES = [
  'All Quotes',
  'Resilience & Grit',
  'Curiosity & Wonder',
  'Deep Focus & Habit',
  'Mathematical & Scientific Rigor',
  'Overcoming Failure',
  'Vision & Destiny'
];
