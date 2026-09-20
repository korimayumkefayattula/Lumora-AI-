import { StudentWebsiteConfig, ThemeDefinition } from '../types/websiteBuilder';

export const THEME_DEFINITIONS: Record<string, ThemeDefinition> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Nebula',
    description: 'Deep starlight indigo with glowing violet celestial accents',
    emoji: '🌌',
    bgClass: 'bg-slate-950 text-slate-100',
    canvasBg: '#030712',
    accentColor: '#8b5cf6',
    cardBg: 'bg-slate-900/80 backdrop-blur-md',
    cardBorder: 'border-violet-500/30',
    textColor: 'text-slate-100',
    subtextColor: 'text-violet-300/80',
    badgeBg: 'bg-violet-500/20',
    badgeText: 'text-violet-300 border border-violet-500/30',
    gradient: 'from-violet-600 via-indigo-600 to-cyan-500'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast obsidian with hot pink & electric cyan glitch vibes',
    emoji: '⚡',
    bgClass: 'bg-black text-white',
    canvasBg: '#050505',
    accentColor: '#06b6d4',
    cardBg: 'bg-zinc-950/90 backdrop-blur-md',
    cardBorder: 'border-cyan-500/40',
    textColor: 'text-zinc-100',
    subtextColor: 'text-cyan-400/80',
    badgeBg: 'bg-fuchsia-500/20',
    badgeText: 'text-fuchsia-400 border border-fuchsia-500/40 font-mono',
    gradient: 'from-fuchsia-500 via-cyan-400 to-amber-400'
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha & Lofi Study',
    description: 'Calm sage green, warm cream paper, and cozy coffee cafe vibes',
    emoji: '🍵',
    bgClass: 'bg-stone-900 text-stone-100',
    canvasBg: '#1c1917',
    accentColor: '#10b981',
    cardBg: 'bg-stone-800/80 backdrop-blur-md',
    cardBorder: 'border-emerald-600/30',
    textColor: 'text-stone-100',
    subtextColor: 'text-emerald-300/80',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300 border border-emerald-500/30',
    gradient: 'from-emerald-600 via-teal-600 to-amber-500'
  },
  'retro-arcade': {
    id: 'retro-arcade',
    name: 'Retro 8-Bit Arcade',
    description: 'Chiptune nostalgia with neon pixel borders and arcade gold',
    emoji: '👾',
    bgClass: 'bg-neutral-950 text-neutral-100',
    canvasBg: '#0a0a0a',
    accentColor: '#eab308',
    cardBg: 'bg-neutral-900 border-2 border-yellow-500/50',
    cardBorder: 'border-yellow-400/60 shadow-[4px_4px_0px_0px_rgba(234,179,8,0.5)]',
    textColor: 'text-neutral-100 font-mono',
    subtextColor: 'text-yellow-400/80 font-mono',
    badgeBg: 'bg-yellow-400/20',
    badgeText: 'text-yellow-300 border border-yellow-400/50 font-mono',
    gradient: 'from-yellow-400 via-rose-500 to-purple-600'
  },
  bubblegum: {
    id: 'bubblegum',
    name: 'Bubblegum Sunset',
    description: 'Playful peach, candy rose, and dreamy pastel gradients',
    emoji: '🍬',
    bgClass: 'bg-slate-900 text-white',
    canvasBg: '#0f172a',
    accentColor: '#f43f5e',
    cardBg: 'bg-slate-800/80 backdrop-blur-md',
    cardBorder: 'border-rose-400/30',
    textColor: 'text-white',
    subtextColor: 'text-rose-300/80',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300 border border-rose-400/30',
    gradient: 'from-rose-500 via-amber-400 to-purple-500'
  },
  oxford: {
    id: 'oxford',
    name: 'Oxford Scholar',
    description: 'Prestigious deep navy, ivory gold trims, and classical library feel',
    emoji: '🏛️',
    bgClass: 'bg-slate-950 text-slate-100',
    canvasBg: '#020617',
    accentColor: '#38bdf8',
    cardBg: 'bg-slate-900/90 border border-amber-500/20',
    cardBorder: 'border-amber-500/30',
    textColor: 'text-slate-100 font-serif',
    subtextColor: 'text-amber-200/80 font-serif',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300 border border-amber-400/30 font-serif',
    gradient: 'from-amber-400 via-sky-400 to-indigo-500'
  }
};

export const WEBSITE_TEMPLATES: { id: string; name: string; desc: string; emoji: string; theme: any; config: StudentWebsiteConfig }[] = [
  {
    id: 'space-explorer',
    name: 'Cosmic Explorer & Science Fair',
    desc: 'Deep space telemetry, planetary physics simulator & research log',
    emoji: '🚀',
    theme: 'cosmic',
    config: {
      id: 'site-cosmic-1',
      siteTitle: "Artemis Rover & Orbital Lab",
      tagline: "Exploring Martian Ice Caps & Astrophysics with Code",
      studentHandle: "cosmo_scholar",
      theme: 'cosmic',
      font: 'sans',
      createdDate: new Date().toISOString(),
      likesCount: 142,
      blocks: [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'Hero Header',
          visible: true,
          heroData: {
            headline: 'Pushing the Frontier of Astrophysics & Rover Telemetry',
            subheadline: 'Hi! I am Alex, a 10th grade space enthusiast building orbital trajectory models and autonomous robotics.',
            badgeText: '🪐 Science Fair Gold Medalist 2026',
            avatarEmoji: '👨‍🚀',
            ctaPrimaryText: 'Launch Simulation',
            ctaSecondaryText: 'View Rover Specs',
            enableFloatingStickers: true
          }
        },
        {
          id: 'gadgets-1',
          type: 'interactive-gadgets',
          title: 'Interactive Fun Pod',
          subtitle: 'Test the booster engines and celebrate orbital insertion',
          visible: true,
          gadgetsData: {
            enableConfettiButton: true,
            confettiButtonText: '🚀 Launch Orbital Confetti!',
            enableClickerGame: true,
            clickerTargetLabel: 'Harvest Cosmic Dark Energy',
            clickerEmoji: '⚡',
            enableSoundBleeps: true
          }
        },
        {
          id: 'about-1',
          type: 'about',
          title: 'Explorer Dossier',
          visible: true,
          aboutData: {
            bio: 'Passionate about Keplerian orbits, Python telemetry, and high-vacuum experimental physics. Building miniature lunar rovers in my garage.',
            role: 'Junior Astrophysicist & Roboticist',
            gradeOrSchool: 'Galileo STEM Academy (Class 10)',
            favoriteSubject: 'Classical Mechanics & Gravitation',
            superpower: 'Can calculate escape velocity in my head during math class',
            funFact: 'I once accidentally transmitted radio packets to an amateur satellite!',
            skills: [
              { name: 'Orbital Mechanics', level: 92 },
              { name: 'Python & ROS 2', level: 85 },
              { name: 'Telemetry Telemetry', level: 78 },
              { name: '3D CAD & Printing', level: 88 }
            ]
          }
        },
        {
          id: 'projects-1',
          type: 'projects',
          title: 'Mission Log & Inventions',
          visible: true,
          projectsData: {
            cards: [
              {
                id: 'p1',
                title: 'Project Artemis Sub-Scale Rover',
                description: '6-wheel rocker-bogie chassis with autonomous ultrasonic obstacle avoidance and obstacle climb.',
                tag: 'Hardware',
                icon: '🤖',
                linkText: 'Schematics',
                likes: 89
              },
              {
                id: 'p2',
                title: 'Orbital Resonance Visualizer',
                description: 'Interactive HTML5 Canvas engine rendering the 3-body Lagrange points (L1 to L5) in real-time.',
                tag: 'Simulation',
                icon: '🌌',
                linkText: 'Live Demo',
                likes: 124
              },
              {
                id: 'p3',
                title: 'Atmospheric Spectrometer Experiment',
                description: 'Diffraction grating sensor analyzing chemical absorption bands of greenhouse gases.',
                tag: 'Chemistry',
                icon: '🔬',
                linkText: 'Data Log',
                likes: 67
              }
            ]
          }
        },
        {
          id: 'quotes-1',
          type: 'quotes-trivia',
          title: 'Cosmic Brain Teasers',
          visible: true,
          quotesTriviaData: {
            triviaList: [
              {
                id: 't1',
                question: 'If you could fold a sheet of paper 42 times, how thick would it be?',
                answer: 'It would reach all the way from Earth to the Moon (approx 384,400 km) due to exponential 2^42 growth!',
                category: 'Mind Bender'
              },
              {
                id: 't2',
                question: 'How long does a photon born in the center of the Sun take to reach its surface?',
                answer: 'Between 10,000 to 170,000 years, because it scatters randomly off dense plasma billions of times!',
                category: 'Solar Physics'
              },
              {
                id: 't3',
                question: 'Why do astronauts age slightly slower in orbit?',
                answer: 'Special relativity time dilation! Moving at 27,600 km/h slows their biological clock by ~0.007 seconds per 6 months.',
                category: 'Relativity'
              }
            ]
          }
        },
        {
          id: 'sticky-1',
          type: 'sticky-notes',
          title: 'Astronaut Visitor Guestbook',
          subtitle: 'Leave a radio transmission for the crew',
          visible: true,
          stickyNotesData: {
            allowVisitorAdd: true,
            notes: [
              { id: 's1', text: 'Good luck with the Mars rover exhibition! 🚀', author: 'Dr. Evelyn', color: 'yellow', rotation: -2 },
              { id: 's2', text: 'Loved your orbital mechanics canvas visualizer!', author: 'Devin_04', color: 'cyan', rotation: 3 },
              { id: 's3', text: 'Remember to check battery telemetry before launch!', author: 'Flight Controller', color: 'pink', rotation: -1 }
            ]
          }
        },
        {
          id: 'links-1',
          type: 'links-contact',
          title: 'Comm Channels & Transmissions',
          visible: true,
          linksData: {
            footerNotice: 'Hosted on Lumora Student Network • Zero Ads • Made with Pure Creativity',
            items: [
              { id: 'l1', label: 'GitHub Science Repos', url: 'https://github.com', icon: '💻' },
              { id: 'l2', label: 'Science Fair Project Paper', url: '#', icon: '📄' },
              { id: 'l3', label: 'Robotics Team Discord', url: '#', icon: '💬' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'retro-gamer',
    name: 'Retro 8-Bit Arcade & Game Dev',
    desc: 'Pixel aesthetic, tap clicker high-score counter, and chiptune vibes',
    emoji: '👾',
    theme: 'retro-arcade',
    config: {
      id: 'site-retro-1',
      siteTitle: "PixelQuest Arcade HQ",
      tagline: "Coding 8-Bit Games & Speedrunning Physics Homework",
      studentHandle: "byte_master_99",
      theme: 'retro-arcade',
      font: 'mono',
      createdDate: new Date().toISOString(),
      likesCount: 256,
      blocks: [
        {
          id: 'hero-retro',
          type: 'hero',
          title: 'Arcade Marquee',
          visible: true,
          heroData: {
            headline: 'PRESS START: Welcome to My 8-Bit Coding Realm',
            subheadline: 'Class 11 coder crafting indie platformers, shader magic, and algorithm speedruns.',
            badgeText: '🎮 HIGH SCORE: 999,990 PTS',
            avatarEmoji: '🕹️',
            ctaPrimaryText: 'Insert Coin',
            ctaSecondaryText: 'View High Scores',
            enableFloatingStickers: true
          }
        },
        {
          id: 'gadgets-retro',
          type: 'interactive-gadgets',
          title: 'Arcade Token Generator',
          subtitle: 'Smash the pixel button to rack up combo points!',
          visible: true,
          gadgetsData: {
            enableConfettiButton: true,
            confettiButtonText: '💥 CRITICAL HIT COMBO!',
            enableClickerGame: true,
            clickerTargetLabel: 'Smash For Retro Coins',
            clickerEmoji: '🪙',
            enableSoundBleeps: true
          }
        },
        {
          id: 'about-retro',
          type: 'about',
          title: 'Player 1 Stats',
          visible: true,
          aboutData: {
            bio: 'Level 16 Student Coder. Specializes in TypeScript, Godot engine 2D mechanics, and drinking copious amounts of hot cocoa while fixing off-by-one errors.',
            role: 'Indie Game Architect & Math Geek',
            gradeOrSchool: 'Eastwood High (Class 11)',
            favoriteSubject: 'Computer Science & Trigonometry',
            superpower: 'Can spot missing semicolons from 10 feet away',
            funFact: 'Beat Dark Souls using only a customized flight joystick.',
            skills: [
              { name: 'JavaScript / Game Dev', level: 95 },
              { name: 'Pixel Art (Aseprite)', level: 84 },
              { name: 'Calculus Vectors', level: 78 },
              { name: 'Speedrunning Tetris', level: 99 }
            ]
          }
        },
        {
          id: 'projects-retro',
          type: 'projects',
          title: 'Released Games & Demos',
          visible: true,
          projectsData: {
            cards: [
              {
                id: 'gp1',
                title: 'Quantum Leap 2D Platformer',
                description: 'A platformer where the player can superimpose into two parallel states to solve gravity puzzles.',
                tag: 'Godot Engine',
                icon: '🎮',
                linkText: 'Play Demo',
                likes: 210
              },
              {
                id: 'gp2',
                title: 'Vector Math Simulator',
                description: 'Interactive browser demo illustrating dot product, cross product, and reflection angles.',
                tag: 'Educational',
                icon: '📐',
                linkText: 'Try Vectors',
                likes: 185
              },
              {
                id: 'gp3',
                title: 'Chiptune BGM Composer',
                description: 'Web Audio tracker synthesizing authentic NES sound chip arpeggios.',
                tag: 'Music Hack',
                icon: '🎵',
                linkText: 'Listen Tracks',
                likes: 95
              }
            ]
          }
        },
        {
          id: 'sticky-retro',
          type: 'sticky-notes',
          title: 'Arcade Wall of Fame',
          subtitle: 'Drop your gamer tag or high score shoutout',
          visible: true,
          stickyNotesData: {
            allowVisitorAdd: true,
            notes: [
              { id: 'sn1', text: 'Level 4 puzzle was insane! Great physics engine.', author: 'RetroGamer99', color: 'yellow', rotation: 2 },
              { id: 'sn2', text: 'GG on the pixel art sprites!!', author: 'Maya_Art', color: 'green', rotation: -3 }
            ]
          }
        },
        {
          id: 'links-retro',
          type: 'links-contact',
          title: 'Connect & Challenge',
          visible: true,
          linksData: {
            footerNotice: 'INSERT COIN TO CONTINUE • Lumora Student Arcade System',
            items: [
              { id: 'rl1', label: 'Itch.io Game Page', url: 'https://itch.io', icon: '🕹️' },
              { id: 'rl2', label: 'Discord Game Jam Server', url: '#', icon: '👾' },
              { id: 'rl3', label: 'GitHub Repository', url: 'https://github.com', icon: '💾' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'lofi-study',
    name: 'Midnight Lofi Study Den',
    desc: 'Calm ambient rain, cozy tea aesthetic, study playlist & focus notes',
    emoji: '🍵',
    theme: 'matcha',
    config: {
      id: 'site-lofi-1',
      siteTitle: "The Matcha Study Corner",
      tagline: "Late night focus beats, organic chemistry revision, and cozy vibes",
      studentHandle: "clara_studies",
      theme: 'matcha',
      font: 'sans',
      createdDate: new Date().toISOString(),
      likesCount: 318,
      blocks: [
        {
          id: 'hero-lofi',
          type: 'hero',
          title: 'Cozy Greeting',
          visible: true,
          heroData: {
            headline: 'Breathe in. Grab some green tea. Let’s master calculus.',
            subheadline: 'Welcome to my gentle study garden where we turn intimidating exams into peaceful, step-by-step progress.',
            badgeText: '🌿 42-Day Pomodoro Streak',
            avatarEmoji: '🍵',
            ctaPrimaryText: 'Start Ambient Rain',
            ctaSecondaryText: 'Read Study Notes',
            enableFloatingStickers: true
          }
        },
        {
          id: 'ambient-lofi',
          type: 'ambient-player',
          title: 'Acoustic Study Atmosphere',
          subtitle: 'Toggle gentle procedural rain noise for deep concentration',
          visible: true,
          ambientPlayerData: {
            initialSound: 'rain',
            presetTitle: 'Rain on Library Skylight'
          }
        },
        {
          id: 'gadgets-lofi',
          type: 'interactive-gadgets',
          title: 'Mindful Energy Booster',
          subtitle: 'Collect cups of matcha tea to fuel your study sprint!',
          visible: true,
          gadgetsData: {
            enableConfettiButton: true,
            confettiButtonText: '🌸 Flower Bloom Confetti!',
            enableClickerGame: true,
            clickerTargetLabel: 'Brew Matcha Focus Tea',
            clickerEmoji: '🍵',
            enableSoundBleeps: true
          }
        },
        {
          id: 'about-lofi',
          type: 'about',
          title: 'Study Journal Bio',
          visible: true,
          aboutData: {
            bio: 'Aspiring Biochemistry major striving for medical school. I believe anyone can conquer difficult science through visual mind-mapping and gentle persistence.',
            role: 'Bio-Chem Aspirant & Visual Notetaker',
            gradeOrSchool: 'Riverside High (Class 12)',
            favoriteSubject: 'Organic Mechanisms & Cellular Biology',
            superpower: 'Can synthesize 80 pages of textbook into 3 aesthetic one-pagers',
            funFact: 'Has tested 14 different brands of matcha powder across 3 continents.',
            skills: [
              { name: 'Organic Reaction Pathways', level: 91 },
              { name: 'Anatomy & Physiology', level: 86 },
              { name: 'Spaced Repetition Mastery', level: 96 },
              { name: 'Watercolor Diagramming', level: 82 }
            ]
          }
        },
        {
          id: 'sticky-lofi',
          type: 'sticky-notes',
          title: 'Study Pep Talk Wall',
          subtitle: 'Leave an uplifting reminder for fellow exam takers',
          visible: true,
          stickyNotesData: {
            allowVisitorAdd: true,
            notes: [
              { id: 'ls1', text: 'Small steps every single day beat last-minute all-nighters!', author: 'Clara', color: 'yellow', rotation: -1 },
              { id: 'ls2', text: 'You know way more than you think you do. Trust yourself! ✨', author: 'Sarah', color: 'pink', rotation: 2 },
              { id: 'ls3', text: 'Hydrate and take a 5-minute stretch! 💧', author: 'StudyBot', color: 'green', rotation: -2 }
            ]
          }
        },
        {
          id: 'links-lofi',
          type: 'links-contact',
          title: 'Study Resources & Notion Templates',
          visible: true,
          linksData: {
            footerNotice: 'Made with love & hot matcha • Lumora Study Sanctuary',
            items: [
              { id: 'll1', label: 'My Free Notion Study Hub', url: '#', icon: '📝' },
              { id: 'll2', label: 'Organic Chemistry Flashcard Deck', url: '#', icon: '📇' },
              { id: 'll3', label: 'Lofi Study Spotify Playlist', url: '#', icon: '🎧' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'cyberpunk-robotics',
    name: 'Cyberpunk Code & Robotics Squad',
    desc: 'Electric neon, glitch accents, drone telemetry, and hackathon project board',
    emoji: '⚡',
    theme: 'cyberpunk',
    config: {
      id: 'site-cyber-1',
      siteTitle: "NeonNexus Robotics Lab",
      tagline: "Building Autonomous Drones & Neural Vision Systems",
      studentHandle: "neo_coder_x",
      theme: 'cyberpunk',
      font: 'mono',
      createdDate: new Date().toISOString(),
      likesCount: 420,
      blocks: [
        {
          id: 'hero-cyber',
          type: 'hero',
          title: 'System Terminal',
          visible: true,
          heroData: {
            headline: 'OVERCLOCK YOUR INTELLECT: Welcome to NeonNexus',
            subheadline: 'High-school hackathon team building AI computer vision, inverted pendulum robots, and IoT sensor arrays.',
            badgeText: '⚡ 1st Place Autonomous Drone Hackathon',
            avatarEmoji: '🤖',
            ctaPrimaryText: 'Initialize Systems',
            ctaSecondaryText: 'Inspect Schematics',
            enableFloatingStickers: true
          }
        },
        {
          id: 'gadgets-cyber',
          type: 'interactive-gadgets',
          title: 'Reactor Overdrive',
          subtitle: 'Overclock the quantum neural cores and trigger celebratory blasts!',
          visible: true,
          gadgetsData: {
            enableConfettiButton: true,
            confettiButtonText: '⚡ OVERDRIVE LASER BLAST!',
            enableClickerGame: true,
            clickerTargetLabel: 'Harvest Megawatt Quanta',
            clickerEmoji: '🔋',
            enableSoundBleeps: true
          }
        },
        {
          id: 'about-cyber',
          type: 'about',
          title: 'Cyber Profile',
          visible: true,
          aboutData: {
            bio: 'Hardware hacker & embedded systems fanatic. We build robots that map indoor mazes with LiDAR sensors and train neural nets on edge microcontrollers.',
            role: 'Robotics Lead & Embedded C++ Coder',
            gradeOrSchool: 'Metro Tech High (Class 11)',
            favoriteSubject: 'Linear Algebra & Electromagnetism',
            superpower: 'Can solder 0402 surface-mount resistors without coffee shaking',
            funFact: 'Accidentally made our garage door open whenever a drone detected a tennis ball.',
            skills: [
              { name: 'C++ & MicroPython', level: 94 },
              { name: 'Computer Vision (OpenCV)', level: 86 },
              { name: 'PCB Schematic Design', level: 79 },
              { name: 'Control Theory PID Loops', level: 85 }
            ]
          }
        },
        {
          id: 'projects-cyber',
          type: 'projects',
          title: 'Hackathon Prototypes',
          visible: true,
          projectsData: {
            cards: [
              {
                id: 'cp1',
                title: 'Self-Balancing Inverted Pendulum',
                description: 'Real-time Kalman filter + PID loop stabilizing a two-wheeled robot on 30-degree slopes.',
                tag: 'Robotics',
                icon: '⚙️',
                linkText: 'Watch Video',
                likes: 310
              },
              {
                id: 'cp2',
                title: 'Edge AI Object Tracker',
                description: 'YOLOv8 nano running on Raspberry Pi 5 with stereo camera depth calculation.',
                tag: 'Computer Vision',
                icon: '👁️',
                linkText: 'GitHub Repo',
                likes: 245
              }
            ]
          }
        },
        {
          id: 'sticky-cyber',
          type: 'sticky-notes',
          title: 'Terminal Hacker Wall',
          subtitle: 'Leave an encrypted ping or telemetry signal',
          visible: true,
          stickyNotesData: {
            allowVisitorAdd: true,
            notes: [
              { id: 'cs1', text: 'The PID tuning video blew my mind! Super crisp response.', author: 'Cipher_9', color: 'cyan', rotation: -2 },
              { id: 'cs2', text: 'Ready for the regional robotics tournament next month! 🦾', author: 'Team_Apex', color: 'purple', rotation: 2 }
            ]
          }
        },
        {
          id: 'links-cyber',
          type: 'links-contact',
          title: 'Data Uplinks',
          visible: true,
          linksData: {
            footerNotice: 'SYSTEM STATUS: 100% OPERATIONAL • Lumora Cyber Grid',
            items: [
              { id: 'cl1', label: 'Hardware Lab Documentation', url: '#', icon: '📡' },
              { id: 'cl2', label: 'Robotics Team GitHub', url: 'https://github.com', icon: '⚡' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'oxford-scholar',
    name: 'Oxford Scholar & Math Olympiad',
    desc: 'Classical library atmosphere, geometry proofs, mathematical puzzles, and scholarly awards',
    emoji: '🏛️',
    theme: 'oxford',
    config: {
      id: 'site-oxford-1',
      siteTitle: "The Euler & Hypatia Academy",
      tagline: "Dedicated to Pure Mathematics, Elegance in Proofs, and Philosophy",
      studentHandle: "math_philosopher",
      theme: 'oxford',
      font: 'serif',
      createdDate: new Date().toISOString(),
      likesCount: 189,
      blocks: [
        {
          id: 'hero-oxford',
          type: 'hero',
          title: 'Academy Gates',
          visible: true,
          heroData: {
            headline: 'Let No One Ignorant of Geometry Enter Here',
            subheadline: 'A collection of mathematical reflections, Olympiad number theory solutions, and aesthetic geometric proofs.',
            badgeText: '🥇 National Math Olympiad Finalist',
            avatarEmoji: '🏛️',
            ctaPrimaryText: 'Explore Theorems',
            ctaSecondaryText: 'Read Proofs',
            enableFloatingStickers: true
          }
        },
        {
          id: 'gadgets-oxford',
          type: 'interactive-gadgets',
          title: 'Intellectual Spark',
          subtitle: 'Celebrate when you conquer an impossible proof!',
          visible: true,
          gadgetsData: {
            enableConfettiButton: true,
            confettiButtonText: '✨ Q.E.D. Proof Celebration!',
            enableClickerGame: true,
            clickerTargetLabel: 'Calculate Digits of Pi',
            clickerEmoji: '🥧',
            enableSoundBleeps: true
          }
        },
        {
          id: 'about-oxford',
          type: 'about',
          title: 'Curriculum Vitae',
          visible: true,
          aboutData: {
            bio: 'Avid student of number theory, modular arithmetic, and prime distribution. Believes the highest form of poetry is an unexpected and concise mathematical theorem.',
            role: 'Olympiad Scholar & Math Writer',
            gradeOrSchool: 'Kingston Classical Academy (Class 12)',
            favoriteSubject: 'Complex Analysis & Euclidean Geometry',
            superpower: 'Can visualize 4D tesseracts unfolding into 3D cross-sections',
            funFact: 'Has memorized the first 500 digits of Euler’s number (e).',
            skills: [
              { name: 'Olympiad Number Theory', level: 96 },
              { name: 'Geometric Constructions', level: 93 },
              { name: 'Combinatorics', level: 88 },
              { name: 'LaTeX Typesetting', level: 92 }
            ]
          }
        },
        {
          id: 'quotes-oxford',
          type: 'quotes-trivia',
          title: 'Mathematical Paradoxes & Delights',
          visible: true,
          quotesTriviaData: {
            triviaList: [
              {
                id: 'ot1',
                question: 'What is the sum of all positive integers: 1 + 2 + 3 + 4 + ... in Ramanujan summation?',
                answer: 'Under analytic continuation of the Riemann zeta function at s = -1, it evaluates to -1/12 (used in Casimir effect quantum physics)!',
                category: 'Euler & Ramanujan'
              },
              {
                id: 'ot2',
                question: 'Why can’t you comb a hairy ball flat without creating a cowlick?',
                answer: 'The Hairy Ball Theorem of algebraic topology proves that any continuous tangent vector field on an even-dimensional sphere must have at least one zero (calm point)!',
                category: 'Topology'
              }
            ]
          }
        },
        {
          id: 'sticky-oxford',
          type: 'sticky-notes',
          title: 'Symposium Guest Ledger',
          subtitle: 'Add your favorite theorem or axiom to the discussion',
          visible: true,
          stickyNotesData: {
            allowVisitorAdd: true,
            notes: [
              { id: 'os1', text: 'Euler’s Identity (e^(i*pi) + 1 = 0) is the pinnacle of beauty.', author: 'Prof. Harrison', color: 'yellow', rotation: -1 },
              { id: 'os2', text: 'Loved your step-by-step visual proof on Fermat’s Little Theorem!', author: 'Julian_K', color: 'cyan', rotation: 2 }
            ]
          }
        },
        {
          id: 'links-oxford',
          type: 'links-contact',
          title: 'Academic Indices',
          visible: true,
          linksData: {
            footerNotice: ' Veritas & Curiositas • Lumora Classical Scholar Archive',
            items: [
              { id: 'ol1', label: 'Olympiad Solutions (PDF)', url: '#', icon: '📜' },
              { id: 'ol2', label: 'Math Club Problem Archives', url: '#', icon: '📐' }
            ]
          }
        }
      ]
    }
  }
];
