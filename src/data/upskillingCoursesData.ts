export interface CourseChapter {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  timestampSeconds?: number;
  summary: string;
}

export interface UpskillingCourse {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: 'ai' | 'ml' | 'programming' | 'video-editing' | 'content-creation' | 'design';
  categoryLabel: string;
  channelName: 'Simplilearn' | 'MIT OpenCourseWare' | 'Canva Design School' | 'freeCodeCamp' | 'Think Media' | 'Envato Tuts+' | 'Casey Faris';
  channelAvatar: string;
  subscribers: string;
  instructor: string;
  primaryYoutubeId: string;
  duration: string;
  totalMinutes: number;
  lecturesCount: number;
  rating: number;
  reviewsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isPro: boolean;
  featuredBadge?: string;
  tags: string[];
  skillsLearned: string[];
  prerequisites: string[];
  takeaways: string[];
  chapters: CourseChapter[];
  resourceLinks: { title: string; url: string; type: 'github' | 'cheatsheet' | 'slides' | 'tool' }[];
}

export const UPSKILLING_CATEGORIES = [
  { id: 'all', label: 'All Courses', icon: 'Layers' },
  { id: 'ai', label: 'Artificial Intelligence', icon: 'Sparkles' },
  { id: 'ml', label: 'Machine Learning', icon: 'Brain' },
  { id: 'programming', label: 'Programming & Web Dev', icon: 'Code' },
  { id: 'video-editing', label: 'Video Editing & VFX', icon: 'Film' },
  { id: 'content-creation', label: 'Content Creation & YouTube', icon: 'Video' },
  { id: 'design', label: 'Canva & Graphic Design', icon: 'Palette' },
] as const;

export const FEATURED_CHANNELS = [
  'All Channels',
  'Simplilearn',
  'MIT OpenCourseWare',
  'Canva Design School',
  'freeCodeCamp',
  'Think Media'
] as const;

export const UPSKILLING_COURSES: UpskillingCourse[] = [
  // 1. Simplilearn AI Full Course
  {
    id: 'simplilearn-ai-full-course',
    title: 'Artificial Intelligence Full Course 2026: Zero to Hero',
    shortDescription: 'Comprehensive deep dive into modern AI architectures, NLP, Neural Networks, Computer Vision, and Generative AI.',
    detailedDescription: 'Master Artificial Intelligence from fundamentals to state-of-the-art Generative AI. Produced by Simplilearn, this masterclass covers the mathematical foundations, core algorithms, prompt engineering, computer vision, and real-world enterprise deployments.',
    category: 'ai',
    categoryLabel: 'Artificial Intelligence',
    channelName: 'Simplilearn',
    channelAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    subscribers: '3.65M',
    instructor: 'Simplilearn AI & Data Engineering Faculty',
    primaryYoutubeId: 'JMUxmLgwTe8',
    duration: '10 hrs 45 mins',
    totalMinutes: 645,
    lecturesCount: 8,
    rating: 4.9,
    reviewsCount: 18420,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Most Enrolled',
    tags: ['Artificial Intelligence', 'Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision', 'Generative AI'],
    skillsLearned: [
      'Foundations of symbolic AI vs Statistical Machine Learning',
      'Artificial Neural Networks (ANN) and Backpropagation algorithms',
      'Natural Language Processing (NLP) & Transformer Architecture',
      'Computer Vision with Convolutional Neural Networks (CNN)',
      'Prompt Engineering & Large Language Model fine-tuning'
    ],
    prerequisites: ['Basic high school algebra', 'Curiosity for computing systems'],
    takeaways: [
      'Understand the complete landscape of modern AI systems',
      'Learn how weights, biases, and gradient descent train deep models',
      'Build end-to-end Python AI pipelines using TensorFlow and PyTorch',
      'Understand ethical considerations and hallucination management in LLMs'
    ],
    chapters: [
      {
        id: 'simpli-ai-1',
        title: 'Module 1: What is Artificial Intelligence? Scope & Evolution',
        duration: '45 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 0,
        summary: 'Historical milestones of AI, Turing tests, rule-based systems vs statistical learning, and modern industry applications.'
      },
      {
        id: 'simpli-ai-2',
        title: 'Module 2: Machine Learning Fundamentals & Types of Learning',
        duration: '1 hr 15 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 2700,
        summary: 'Supervised vs Unsupervised vs Reinforcement learning. Classification, regression, and clustering algorithms explained with diagrams.'
      },
      {
        id: 'simpli-ai-3',
        title: 'Module 3: Neural Networks & Deep Learning Deep Dive',
        duration: '1 hr 30 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 7200,
        summary: 'Perceptrons, activation functions (ReLU, Sigmoid, Softmax), forward propagation, loss functions, and backpropagation.'
      },
      {
        id: 'simpli-ai-4',
        title: 'Module 4: Computer Vision & Convolutional Neural Networks (CNN)',
        duration: '1 hr 20 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 12600,
        summary: 'Image filtering, kernels, pooling layers, feature maps, object detection, and transfer learning with ResNet.'
      },
      {
        id: 'simpli-ai-5',
        title: 'Module 5: Natural Language Processing & Transformers',
        duration: '1 hr 40 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 17400,
        summary: 'Tokenization, embeddings (Word2Vec), Attention mechanisms, self-attention, and GPT/BERT transformer building blocks.'
      },
      {
        id: 'simpli-ai-6',
        title: 'Module 6: Generative AI, Diffusion Models & LLMs',
        duration: '1 hr 15 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 23400,
        summary: 'Generative Adversarial Networks (GANs), Latent Diffusion models for image generation, and modern multi-modal LLMs.'
      },
      {
        id: 'simpli-ai-7',
        title: 'Module 7: Hands-On Python AI Project in Google Colab',
        duration: '1 hr 30 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 27900,
        summary: 'Step-by-step code tutorial building a real-time sentiment analyzer and predictive neural network in Python.'
      },
      {
        id: 'simpli-ai-8',
        title: 'Module 8: AI Ethics, Bias Mitigation & Career Roadmap',
        duration: '45 mins',
        youtubeId: 'JMUxmLgwTe8',
        timestampSeconds: 33300,
        summary: 'Data privacy, algorithmic bias detection, responsible AI governance, and how to land roles in AI engineering.'
      }
    ],
    resourceLinks: [
      { title: 'Simplilearn Official AI Cheatsheet (PDF)', url: 'https://www.simplilearn.com', type: 'cheatsheet' },
      { title: 'Google Colab Python Starter Notebooks', url: 'https://github.com', type: 'github' },
      { title: 'Interactive TensorFlow Playground', url: 'https://playground.tensorflow.org', type: 'tool' }
    ]
  },

  // 2. MIT OpenCourseWare - Deep Learning (6.S191)
  {
    id: 'mit-6s191-deep-learning',
    title: 'MIT 6.S191: Introduction to Deep Learning',
    shortDescription: "MIT's prestigious flagship course covering foundational deep learning, computer vision, transformers, and generative modeling.",
    detailedDescription: 'Taught directly by Alexander Amini and esteemed MIT faculty at Cambridge, MIT 6.S191 is one of the world’s most respected academic deep learning programs. Learn first-principles mathematics, neural architectures, attention mechanics, and frontier research.',
    category: 'ai',
    categoryLabel: 'Artificial Intelligence',
    channelName: 'MIT OpenCourseWare',
    channelAvatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80',
    subscribers: '5.1M',
    instructor: 'Dr. Alexander Amini & MIT Faculty',
    primaryYoutubeId: '7sB052Pz0s8',
    duration: '6 hrs 20 mins',
    totalMinutes: 380,
    lecturesCount: 6,
    rating: 4.98,
    reviewsCount: 32900,
    level: 'Intermediate',
    isPro: true,
    featuredBadge: 'Ivy League Curriculum',
    tags: ['MIT', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'Generative Modeling', 'Reinforcement Learning'],
    skillsLearned: [
      'Mathematical formulation of gradient optimization and backpropagation',
      'Recurrent Neural Networks (RNN) and LSTMs for sequential modeling',
      'Attention is All You Need: Transformer mathematics',
      'Deep Generative Modeling: VAEs, GANs, and Diffusion models',
      'Deep Reinforcement Learning algorithms (Q-learning, Policy Gradients)'
    ],
    prerequisites: ['Introductory Python', 'Basic multivariable calculus and linear algebra'],
    takeaways: [
      'World-class academic grounding from the Massachusetts Institute of Technology',
      'Intuitive geometric visualizations of high-dimensional loss landscapes',
      'MIT lab assignments with practical PyTorch implementations'
    ],
    chapters: [
      {
        id: 'mit-dl-1',
        title: 'Lecture 1: Deep Learning Foundations & Perceptrons',
        duration: '50 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 0,
        summary: 'Biological vs artificial neurons, linear boundaries, loss functions, stochastic gradient descent (SGD).'
      },
      {
        id: 'mit-dl-2',
        title: 'Lecture 2: Recurrent Neural Networks, Transformers & Attention',
        duration: '55 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 3000,
        summary: 'Sequence problems, hidden states, vanishing gradients, attention scores, and multi-head attention.'
      },
      {
        id: 'mit-dl-3',
        title: 'Lecture 3: Deep Computer Vision & Spatial Convolutions',
        duration: '52 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 6300,
        summary: 'Why fully connected layers fail on 2D images, convolutional kernels, receptive fields, and semantic segmentation.'
      },
      {
        id: 'mit-dl-4',
        title: 'Lecture 4: Deep Generative Modeling (VAEs & GANs)',
        duration: '58 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 9400,
        summary: 'Latent variables, Autoencoders, variational lower bound, Generator vs Discriminator adversarial min-max games.'
      },
      {
        id: 'mit-dl-5',
        title: 'Lecture 5: Deep Reinforcement Learning',
        duration: '54 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 12900,
        summary: 'Markov Decision Processes (MDP), rewards, discount factor, Bellman equation, and Deep Q-Networks.'
      },
      {
        id: 'mit-dl-6',
        title: 'Lecture 6: AI Safety, Robustness & Future Frontiers',
        duration: '48 mins',
        youtubeId: '7sB052Pz0s8',
        timestampSeconds: 16100,
        summary: 'Adversarial attacks, uncertainty estimation, model interpretability, and the next decade of AI development.'
      }
    ],
    resourceLinks: [
      { title: 'MIT 6.S191 Official Course Syllabus & Slides', url: 'http://introtodeeplearning.com', type: 'slides' },
      { title: 'MIT 6.S191 GitHub Lab Repositories', url: 'https://github.com/aamini/introtodeeplearning', type: 'github' }
    ]
  },

  // 3. Simplilearn Machine Learning Full Course
  {
    id: 'simplilearn-ml-10-hours',
    title: 'Machine Learning Masterclass: 10-Hour Complete Course',
    shortDescription: 'Master Supervised, Unsupervised, Ensemble methods, Decision Trees, SVM, and Scikit-Learn end-to-end.',
    detailedDescription: 'A thorough, code-first breakdown of Machine Learning. Covers linear regression, logistic regression, decision trees, random forests, support vector machines, K-Means clustering, PCA, and model evaluation metrics with real datasets.',
    category: 'ml',
    categoryLabel: 'Machine Learning',
    channelName: 'Simplilearn',
    channelAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    subscribers: '3.65M',
    instructor: 'Simplilearn Senior ML Engineers',
    primaryYoutubeId: 'ukzFI9rgwfU',
    duration: '10 hrs 02 mins',
    totalMinutes: 602,
    lecturesCount: 7,
    rating: 4.88,
    reviewsCount: 14200,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Comprehensive',
    tags: ['Machine Learning', 'Python', 'Scikit-Learn', 'Regression', 'Classification', 'Data Science'],
    skillsLearned: [
      'Statistical reasoning and feature engineering techniques',
      'Linear & Logistic Regression with regularization (Lasso/Ridge)',
      'Decision Trees, Bagging, Random Forests, and XGBoost',
      'Support Vector Machines (SVM) & Kernel trick',
      'Cross-validation, ROC-AUC curves, Confusion Matrix precision/recall'
    ],
    prerequisites: ['Basic Python syntax', 'Fundamental statistics concepts'],
    takeaways: [
      'Learn how to turn raw CSV data into accurate predictive models',
      'Master data preprocessing: handling missing values, scaling, one-hot encoding',
      'Avoid overfitting using regularization and cross-validation folds'
    ],
    chapters: [
      {
        id: 'simpli-ml-1',
        title: 'Module 1: What is Machine Learning? Supervised vs Unsupervised',
        duration: '1 hr 10 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 0,
        summary: 'Overview of predictive modeling, training/test splits, bias-variance tradeoff, and the ML lifecycle.'
      },
      {
        id: 'simpli-ml-2',
        title: 'Module 2: Linear Regression & Cost Function Optimization',
        duration: '1 hr 25 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 4200,
        summary: 'Ordinary Least Squares, Mean Squared Error (MSE), Gradient Descent step sizes, learning rate tuning.'
      },
      {
        id: 'simpli-ml-3',
        title: 'Module 3: Logistic Regression for Binary & Multi-Class Classification',
        duration: '1 hr 15 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 9300,
        summary: 'Odds ratio, Sigmoid transformation, Cross-Entropy loss, decision thresholds, and ROC curves.'
      },
      {
        id: 'simpli-ml-4',
        title: 'Module 4: Decision Trees, Entropy, and Gini Impurity',
        duration: '1 hr 30 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 13800,
        summary: 'Splitting rules, Information Gain, tree pruning, preventing overfitting in non-linear decision spaces.'
      },
      {
        id: 'simpli-ml-5',
        title: 'Module 5: Ensemble Learning: Random Forest & Gradient Boosting',
        duration: '1 hr 45 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 19200,
        summary: 'Bootstrap aggregating (Bagging), feature subsampling, out-of-bag error, and boosting algorithms (AdaBoost, XGBoost).'
      },
      {
        id: 'simpli-ml-6',
        title: 'Module 6: Unsupervised Learning: K-Means & PCA',
        duration: '1 hr 20 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 25500,
        summary: 'Centroid initialization, elbow method, silhouette analysis, Principal Component Analysis dimensionality reduction.'
      },
      {
        id: 'simpli-ml-7',
        title: 'Module 7: Capstone Real-World Machine Learning Project',
        duration: '1 hr 35 mins',
        youtubeId: 'ukzFI9rgwfU',
        timestampSeconds: 30300,
        summary: 'Complete end-to-end dataset analysis, pipeline creation, hyperparameter grid search, and deployment.'
      }
    ],
    resourceLinks: [
      { title: 'Scikit-Learn Machine Learning Cheat Sheet', url: 'https://scikit-learn.org', type: 'cheatsheet' },
      { title: 'GitHub Code Repo & Datasets', url: 'https://github.com', type: 'github' }
    ]
  },

  // 4. Canva Complete Graphic Design Masterclass
  {
    id: 'canva-design-school-masterclass',
    title: 'Canva Pro & Graphic Design: Complete Visual Masterclass',
    shortDescription: 'Learn pro-level graphic design, visual hierarchy, branding, social media assets, and presentation design in Canva.',
    detailedDescription: 'Step-by-step masterclass on visual design using Canva. Discover the core rules of graphic design: color harmony, typography pairing, layout balance, visual contrast, brand kits, and animated presentations that look like they were created by a premier design agency.',
    category: 'design',
    categoryLabel: 'Canva & Design',
    channelName: 'Canva Design School',
    channelAvatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&auto=format&fit=crop&q=80',
    subscribers: '1.24M',
    instructor: 'Canva Design Evangelists & Creative Directors',
    primaryYoutubeId: 'un50Bs4BvZ8',
    duration: '4 hrs 15 mins',
    totalMinutes: 255,
    lecturesCount: 6,
    rating: 4.94,
    reviewsCount: 22100,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Design Excellence',
    tags: ['Canva', 'Graphic Design', 'Visual Hierarchy', 'Branding', 'Social Media', 'UI Design', 'Typography'],
    skillsLearned: [
      'Visual hierarchy and focal point design principles',
      'The 60-30-10 color rule and psychological color pairing',
      'Typography pairing: matching Display fonts with clean body type',
      'Building consistent brand kits (logos, palettes, asset libraries)',
      'Designing viral YouTube thumbnails, infographics, and carousel decks'
    ],
    prerequisites: ['No prior design experience required'],
    takeaways: [
      'Create high-converting visual assets without expensive design software',
      'Master Canva shortcuts, grids, alignment guides, and layer tools',
      'Export production-ready assets for print, web, and social video'
    ],
    chapters: [
      {
        id: 'canva-1',
        title: 'Module 1: Canva Workspace, Grids & Creative Canvas Setup',
        duration: '35 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 0,
        summary: 'Touring the Canva interface, document dimensions, bleed lines, margins, rulers, and canvas navigation.'
      },
      {
        id: 'canva-2',
        title: 'Module 2: Visual Hierarchy & The Golden Rules of Graphic Design',
        duration: '45 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 2100,
        summary: 'Scale, contrast, proximity, alignment, whitespace, and directing the viewer’s eye naturally.'
      },
      {
        id: 'canva-3',
        title: 'Module 3: Typography Mastery: Pairing, Kerning & Legibility',
        duration: '40 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 4800,
        summary: 'Serif vs Sans-Serif vs Display fonts, line heights, character tracking, and typographic contrast.'
      },
      {
        id: 'canva-4',
        title: 'Module 4: Color Theory & The 60-30-10 Palette Formula',
        duration: '42 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 7200,
        summary: 'Complementary, analogous, and triadic color schemes. Contrast ratios for accessibility (WCAG AA).'
      },
      {
        id: 'canva-5',
        title: 'Module 5: Designing High-CTR YouTube Thumbnails & Posters',
        duration: '50 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 9720,
        summary: 'Facial framing, bold typography outlines, high-contrast glow effects, and thumbnail psychology.'
      },
      {
        id: 'canva-6',
        title: 'Module 6: Interactive Presentations & Brand Kit Assembly',
        duration: '43 mins',
        youtubeId: 'un50Bs4BvZ8',
        timestampSeconds: 12720,
        summary: 'Animated transitions, presenter notes, custom charts, and packaging client brand books.'
      }
    ],
    resourceLinks: [
      { title: 'Canva Design School Color Wheel & Palette Generator', url: 'https://www.canva.com/colors', type: 'tool' },
      { title: 'Printable Graphic Design Rules Cheatsheet', url: 'https://www.canva.com', type: 'cheatsheet' }
    ]
  },

  // 5. Video Editing - Premiere Pro Complete Tutorial
  {
    id: 'premiere-pro-video-editing',
    title: 'Adobe Premiere Pro: Complete Video Editing Masterclass',
    shortDescription: 'From cutting your first clip to cinematic color grading, sound design, transitions, and pacing.',
    detailedDescription: 'The definitive guide to video editing with Adobe Premiere Pro. Learn timeline organization, J-cuts, L-cuts, speed ramps, audio ducking, keyframing, motion graphics templates, Lumetri Color grading, and cinematic storytelling techniques used by top video creators.',
    category: 'video-editing',
    categoryLabel: 'Video Editing',
    channelName: 'Envato Tuts+',
    channelAvatar: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=150&auto=format&fit=crop&q=80',
    subscribers: '1.4M',
    instructor: 'Professional Post-Production Directors',
    primaryYoutubeId: 'u7_w2v_4fJk',
    duration: '3 hrs 50 mins',
    totalMinutes: 230,
    lecturesCount: 5,
    rating: 4.91,
    reviewsCount: 15300,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Studio Quality',
    tags: ['Premiere Pro', 'Video Editing', 'Color Grading', 'Sound Design', 'Storytelling', 'Post Production'],
    skillsLearned: [
      'Timeline assembly, rough cut trimming, and ripple edit shortcuts',
      'The psychology of pacing: J-cuts, L-cuts, and match cuts',
      'Audio mixing: noise reduction, compression, EQ, and auto-ducking',
      'Lumetri Color: LUTs, white balance, RGB curves, and cinematic grading',
      'Keyframing zooms, kinetic titles, and motion design'
    ],
    prerequisites: ['Computer capable of running modern video editing software'],
    takeaways: [
      'Cut video 3x faster using two-handed keyboard shortcuts',
      'Clean muddy audio so dialogue sounds like a studio podcast',
      'Apply Hollywood color grading techniques with scopes and curves'
    ],
    chapters: [
      {
        id: 'premiere-1',
        title: 'Module 1: Interface Setup, Ingest & Project Management',
        duration: '40 mins',
        youtubeId: 'u7_w2v_4fJk',
        timestampSeconds: 0,
        summary: 'Media Browser, bin structures, scratch disks, sequence presets (4K vs 1080p, 24fps vs 60fps).'
      },
      {
        id: 'premiere-2',
        title: 'Module 2: Cutting & Trimming Like a Pro (J, L, and Match Cuts)',
        duration: '48 mins',
        youtubeId: 'u7_w2v_4fJk',
        timestampSeconds: 2400,
        summary: 'Ripple edit tool, roll tool, slip and slide tools, and maintaining narrative rhythm.'
      },
      {
        id: 'premiere-3',
        title: 'Module 3: Sound Design, Dialogue Leveling & Music Sync',
        duration: '45 mins',
        youtubeId: 'u7_w2v_4fJk',
        timestampSeconds: 5280,
        summary: 'Essential Sound panel, setting dialogue to -12dB to -6dB, background music ducking, and SFX layers.'
      },
      {
        id: 'premiere-4',
        title: 'Module 4: Lumetri Color Wheels, Curves & Cinematic LUTs',
        duration: '47 mins',
        youtubeId: 'u7_w2v_4fJk',
        timestampSeconds: 7980,
        summary: 'Waveform and Vectorscope reading, color correction vs color grading, teal-orange contrast.'
      },
      {
        id: 'premiere-5',
        title: 'Module 5: Kinetic Text, Smooth Transitions & Exporting for YouTube',
        duration: '50 mins',
        youtubeId: 'u7_w2v_4fJk',
        timestampSeconds: 10800,
        summary: 'Essential Graphics, auto-captions, motion blur transitions, H.264/H.265 bitrates for crisp web playback.'
      }
    ],
    resourceLinks: [
      { title: 'Premiere Pro Keyboard Shortcut Poster', url: 'https://helpx.adobe.com', type: 'cheatsheet' },
      { title: 'Free Cinematic LUTs Pack', url: 'https://envato.com', type: 'tool' }
    ]
  },

  // 6. DaVinci Resolve 19 Complete Free Beginner Course
  {
    id: 'davinci-resolve-complete',
    title: 'DaVinci Resolve 19: Complete Beginner to Pro Course',
    shortDescription: 'Master the world’s most powerful free video editing and Hollywood color grading platform.',
    detailedDescription: 'DaVinci Resolve is the industry standard for Hollywood films and top YouTubers. This masterclass covers the Cut page, Edit page, Fusion VFX node tree, Fairlight audio workstation, and the legendary Color grading node pipeline.',
    category: 'video-editing',
    categoryLabel: 'Video Editing',
    channelName: 'Casey Faris',
    channelAvatar: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=150&auto=format&fit=crop&q=80',
    subscribers: '1.18M',
    instructor: 'Casey Faris & Blackmagic Certified Trainers',
    primaryYoutubeId: 'Mo4mE5sVn08',
    duration: '4 hrs 40 mins',
    totalMinutes: 280,
    lecturesCount: 5,
    rating: 4.96,
    reviewsCount: 19800,
    level: 'Beginner',
    isPro: true,
    featuredBadge: '100% Free Software',
    tags: ['DaVinci Resolve', 'Blackmagic', 'Color Grading', 'Node Tree', 'Fusion VFX', 'Fairlight Audio'],
    skillsLearned: [
      'Mastering the rapid Cut page for fast rough assemblies',
      'The Edit page: precision trimming, magnetic timeline workflows',
      'Color Node Architecture: serial nodes, parallel nodes, and layer nodes',
      'Power Windows, qualifying qualifiers, and skin tone correction',
      'Fusion 2D/3D compositing and Fairlight audio sweetening'
    ],
    prerequisites: ['A PC or Mac running DaVinci Resolve (free version)'],
    takeaways: [
      'Achieve film-grade color grading completely free of charge',
      'Understand node-based workflows for unlimited creative control',
      'Export high-fidelity 4K video optimized for YouTube and social media'
    ],
    chapters: [
      {
        id: 'davinci-1',
        title: 'Module 1: DaVinci Resolve Overview & The Cut Page Speed Workflow',
        duration: '50 mins',
        youtubeId: 'Mo4mE5sVn08',
        timestampSeconds: 0,
        summary: 'Installing Resolve, understanding project libraries, smart bins, and blazing-fast trimming.'
      },
      {
        id: 'davinci-2',
        title: 'Module 2: The Edit Page: Building Compelling Video Narratives',
        duration: '55 mins',
        youtubeId: 'Mo4mE5sVn08',
        timestampSeconds: 3000,
        summary: 'Timeline snapping, dynamic trimming, multi-camera editing, and title generators.'
      },
      {
        id: 'davinci-3',
        title: 'Module 3: Hollywood Color Grading & The Node Tree Explained',
        duration: '1 hr 10 mins',
        youtubeId: 'Mo4mE5sVn08',
        timestampSeconds: 6300,
        summary: 'Primary wheels (Lift, Gamma, Gain, Offset), custom curves, color wheels, and skin tone lines.'
      },
      {
        id: 'davinci-4',
        title: 'Module 4: Fusion Basics: Titles, Animations & Green Screen',
        duration: '50 mins',
        youtubeId: 'Mo4mE5sVn08',
        timestampSeconds: 10500,
        summary: 'Node connections (Merge, MediaIn, MediaOut), keyframe splines, and Delta Keyer chromakey.'
      },
      {
        id: 'davinci-5',
        title: 'Module 5: Fairlight Audio Mixing & Deliver Page Presets',
        duration: '55 mins',
        youtubeId: 'Mo4mE5sVn08',
        timestampSeconds: 13500,
        summary: 'Voice isolation, dialogue leveler, bus tracks, mastering to -14 LUFS, and YouTube export.'
      }
    ],
    resourceLinks: [
      { title: 'DaVinci Resolve Official Free Download', url: 'https://www.blackmagicdesign.com', type: 'tool' },
      { title: 'Colorist Node Tree Cheatsheet', url: 'https://groundcontrol.film', type: 'cheatsheet' }
    ]
  },

  // 7. Content Creation & YouTube Growth
  {
    id: 'think-media-youtube-masterclass',
    title: 'Content Creation & YouTube Strategy: Zero to 100K Subscribers',
    shortDescription: 'Master YouTube algorithm secrets, high-retention scripting, lighting setups, and monetization.',
    detailedDescription: 'Created by Think Media and leading digital creators, this masterclass reveals the exact frameworks behind modern video content creation. Learn how to write 60-second hooks, structure educational videos for 60%+ retention, configure budget studio lighting, and build a digital brand.',
    category: 'content-creation',
    categoryLabel: 'Content Creation',
    channelName: 'Think Media',
    channelAvatar: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=80',
    subscribers: '3.1M',
    instructor: 'Sean Cannell & Think Media Creators',
    primaryYoutubeId: 'H14bBuluwB8',
    duration: '3 hrs 30 mins',
    totalMinutes: 210,
    lecturesCount: 5,
    rating: 4.93,
    reviewsCount: 16700,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Creator Strategy',
    tags: ['YouTube Growth', 'Content Strategy', 'Scripting', 'Studio Lighting', 'Retention', 'Digital Branding'],
    skillsLearned: [
      'The 7-second hook formula to capture immediate audience attention',
      'The AVD (Average View Duration) and CTR (Click-Through-Rate) growth loop',
      'Scripting frameworks: Problem, Agitate, Solve, Call to Action (PAS-CTA)',
      '3-point lighting setup on any budget (Key, Fill, Backlight)',
      'Smart batch-recording systems to publish consistently without burnout'
    ],
    prerequisites: ['Smartphone or camera, microphone, and a desire to teach or entertain'],
    takeaways: [
      'Understand what the YouTube recommendation algorithm actually looks for',
      'Create high-retention video outlines in under 20 minutes',
      'Monetize through sponsorships, digital products, and community building'
    ],
    chapters: [
      {
        id: 'think-1',
        title: 'Module 1: The YouTube Algorithm Explained: CTR & Watch Time',
        duration: '40 mins',
        youtubeId: 'H14bBuluwB8',
        timestampSeconds: 0,
        summary: 'How YouTube matches viewers with content, audience retention graphs, and thumbnail psychology.'
      },
      {
        id: 'think-2',
        title: 'Module 2: High-Retention Video Scripting & The Hook Framework',
        duration: '45 mins',
        youtubeId: 'H14bBuluwB8',
        timestampSeconds: 2400,
        summary: 'Eliminating fluff in the first 30 seconds, visual pattern interrupts, and open loops.'
      },
      {
        id: 'think-3',
        title: 'Module 3: Studio Lighting, Audio & Smartphone Cinematography',
        duration: '42 mins',
        youtubeId: 'H14bBuluwB8',
        timestampSeconds: 5100,
        summary: 'Why audio is 50% of video quality, positioning lights to eliminate glare, and camera exposure rules.'
      },
      {
        id: 'think-4',
        title: 'Module 4: Title & Thumbnail Synergy (Packaging Masterclass)',
        duration: '43 mins',
        youtubeId: 'H14bBuluwB8',
        timestampSeconds: 7620,
        summary: 'Complimentary titles and thumbnails that don’t repeat words, creating curiosity gaps.'
      },
      {
        id: 'think-5',
        title: 'Module 5: Workflow, Content Batching & Scaling Your Channel',
        duration: '40 mins',
        youtubeId: 'H14bBuluwB8',
        timestampSeconds: 10200,
        summary: 'Content calendars, batching 4 videos in one weekend, and repurposing long-form to shorts.'
      }
    ],
    resourceLinks: [
      { title: 'High-Retention Video Script Template (Notion/Doc)', url: 'https://thinkmedia.com', type: 'cheatsheet' },
      { title: 'YouTube Thumbnail Testing Checklist', url: 'https://thinkmedia.com', type: 'slides' }
    ]
  },

  // 8. Programming - Full Stack Web Development (freeCodeCamp)
  {
    id: 'freecodecamp-fullstack-webdev',
    title: 'Full Stack Web Development: HTML, CSS, JavaScript & React',
    shortDescription: 'Build modern responsive websites and interactive web applications from scratch.',
    detailedDescription: 'The ultimate web engineering roadmap. Starting with semantic HTML5 and modern CSS Flexbox/Grid, advancing into modern JavaScript (ES6+), DOM manipulation, asynchronous fetch APIs, and building modern dynamic SPAs using React.',
    category: 'programming',
    categoryLabel: 'Programming & Web Dev',
    channelName: 'freeCodeCamp',
    channelAvatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    subscribers: '9.8M',
    instructor: 'freeCodeCamp Core Instructors',
    primaryYoutubeId: 'nu_pCVPKzTk',
    duration: '11 hrs 30 mins',
    totalMinutes: 690,
    lecturesCount: 6,
    rating: 4.97,
    reviewsCount: 48900,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Most Popular Tech Course',
    tags: ['Web Development', 'JavaScript', 'HTML5', 'CSS3', 'React', 'Frontend', 'Backend'],
    skillsLearned: [
      'Semantic HTML5 markup and web accessibility standards',
      'Modern CSS: Flexbox, Grid, CSS Variables, and responsive layouts',
      'JavaScript fundamentals: variables, loops, functions, closures, array methods',
      'Asynchronous JS: Promises, async/await, fetching REST APIs',
      'React component lifecycle, JSX, hooks (useState, useEffect, useMemo)'
    ],
    prerequisites: ['A computer with any modern web browser and VS Code installed'],
    takeaways: [
      'Build and deploy responsive real-world websites to the web',
      'Think like a software engineer when debugging issues in DevTools',
      'Prepare for entry-level frontend software developer interviews'
    ],
    chapters: [
      {
        id: 'fcc-1',
        title: 'Module 1: Semantic HTML5 & Modern Web Page Architecture',
        duration: '1 hr 30 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 0,
        summary: 'Tags, forms, tables, media elements, SEO meta tags, and accessibility best practices.'
      },
      {
        id: 'fcc-2',
        title: 'Module 2: CSS Layouts: Flexbox, CSS Grid & Responsive Design',
        duration: '2 hrs 10 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 5400,
        summary: 'Box model, margin collapse, display flex, grid template areas, media queries, and mobile-first styles.'
      },
      {
        id: 'fcc-3',
        title: 'Module 3: JavaScript Core: Variables, Data Types & Functions',
        duration: '2 hrs 20 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 13200,
        summary: 'Let/const, primitive vs reference types, arrow functions, scope, and closures.'
      },
      {
        id: 'fcc-4',
        title: 'Module 4: DOM Manipulation & Browser Events',
        duration: '1 hr 45 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 21600,
        summary: 'Selecting elements, querySelector, event listeners, bubbling, and building interactive calculators.'
      },
      {
        id: 'fcc-5',
        title: 'Module 5: Asynchronous JavaScript & REST API Integration',
        duration: '1 hr 55 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 27900,
        summary: 'The event loop, callback hell, Promises, async/await, and fetching real-time weather data.'
      },
      {
        id: 'fcc-6',
        title: 'Module 6: React Essentials: Components, State & Hooks',
        duration: '1 hr 50 mins',
        youtubeId: 'nu_pCVPKzTk',
        timestampSeconds: 34800,
        summary: 'Why React exists, virtual DOM, props, state management with useState, and lifecycle hooks.'
      }
    ],
    resourceLinks: [
      { title: 'freeCodeCamp Official Interactive Curriculum', url: 'https://www.freecodecamp.org', type: 'tool' },
      { title: 'Modern JavaScript Cheatsheet', url: 'https://github.com/mbeaudru/modern-js-cheatsheet', type: 'cheatsheet' }
    ]
  },

  // 9. MIT 6.0001 Introduction to Computer Science in Python
  {
    id: 'mit-60001-python-cs',
    title: 'MIT 6.0001: Computer Science & Python Programming',
    shortDescription: "MIT's legendary introductory programming curriculum focusing on computational thinking and algorithm design.",
    detailedDescription: 'Taught by Prof. Eric Grimson and Prof. John Guttag at MIT, this foundational course teaches students how to formulate problems computationally, design robust algorithms, perform asymptotic complexity analysis (Big-O), and write elegant object-oriented Python code.',
    category: 'programming',
    categoryLabel: 'Programming & Web Dev',
    channelName: 'MIT OpenCourseWare',
    channelAvatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80',
    subscribers: '5.1M',
    instructor: 'Prof. Eric Grimson & MIT EECS Faculty',
    primaryYoutubeId: 'nykOeWgQcHM',
    duration: '8 hrs 15 mins',
    totalMinutes: 495,
    lecturesCount: 6,
    rating: 4.99,
    reviewsCount: 41200,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'Ivy League Curriculum',
    tags: ['MIT', 'Python', 'Computer Science', 'Algorithms', 'Big-O', 'Data Structures'],
    skillsLearned: [
      'Computational thinking and problem decomposition',
      'Branching, iteration, bisection search, and floating point approximation',
      'Recursion, induction, and divide-and-conquer algorithms',
      'Testing, debugging, assertions, and defensive programming',
      'Object-Oriented Programming (OOP): classes, inheritance, polymorphism',
      'Algorithmic complexity: Big-O notation, binary search, merge sort'
    ],
    prerequisites: ['Basic high school algebra; no prior programming required'],
    takeaways: [
      'Master genuine computer science fundamentals taught to MIT undergraduates',
      'Learn how computers represent data and execute instructions in memory',
      'Gain computational confidence to tackle any advanced technical discipline'
    ],
    chapters: [
      {
        id: 'mit-cs-1',
        title: 'Lecture 1: What is Computation? Syntax, Semantics & Memory',
        duration: '50 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 0,
        summary: 'Stored program computers, flowcharts, variables, expressions, and string operations in Python.'
      },
      {
        id: 'mit-cs-2',
        title: 'Lecture 2: Branching, Iteration & Bisection Search Algorithms',
        duration: '52 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 3000,
        summary: 'While and for loops, guess-and-check, approximations, and the power of logarithmic search.'
      },
      {
        id: 'mit-cs-3',
        title: 'Lecture 3: Functions, Decomposition & Variable Scope',
        duration: '50 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 6120,
        summary: 'Formal parameters, return statements, the stack frame, environments, and functional abstraction.'
      },
      {
        id: 'mit-cs-4',
        title: 'Lecture 4: Compound Data Structures: Tuples, Lists, Mutation',
        duration: '54 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 9120,
        summary: 'Mutability vs immutability, list aliasing, memory references, cloning, and list comprehensions.'
      },
      {
        id: 'mit-cs-5',
        title: 'Lecture 5: Recursion & Dictionaries as Lookup Tables',
        duration: '53 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 12360,
        summary: 'Mathematical induction, base cases, Towers of Hanoi, Fibonacci memoization, and hash tables.'
      },
      {
        id: 'mit-cs-6',
        title: 'Lecture 6: Object-Oriented Programming & Algorithmic Complexity',
        duration: '55 mins',
        youtubeId: 'nykOeWgQcHM',
        timestampSeconds: 15540,
        summary: 'Classes, dunder methods, encapsulation, asymptotic order of growth, and search algorithms.'
      }
    ],
    resourceLinks: [
      { title: 'MIT 6.0001 Official Problem Sets & Lecture Notes', url: 'https://ocw.mit.edu/courses/6-0001', type: 'slides' },
      { title: 'Python Reference Documentation', url: 'https://docs.python.org/3/', type: 'cheatsheet' }
    ]
  },

  // 10. Simplilearn Python Programming Full Course
  {
    id: 'simplilearn-python-full-course',
    title: 'Python Programming Full Course: Complete Masterclass',
    shortDescription: 'Master Python syntax, functions, OOP, file handling, web scraping, and automation.',
    detailedDescription: 'Comprehensive Python training by Simplilearn covering core programming logic, data structures (lists, tuples, sets, dictionaries), object-oriented programming, error handling, regular expressions, web scraping with Beautiful Soup, and working with APIs.',
    category: 'programming',
    categoryLabel: 'Programming & Web Dev',
    channelName: 'Simplilearn',
    channelAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    subscribers: '3.65M',
    instructor: 'Simplilearn Senior Software Engineers',
    primaryYoutubeId: 'm67-bOpOoPU',
    duration: '8 hrs 30 mins',
    totalMinutes: 510,
    lecturesCount: 6,
    rating: 4.89,
    reviewsCount: 17800,
    level: 'Beginner',
    isPro: true,
    featuredBadge: 'High Demand',
    tags: ['Python', 'Software Engineering', 'Automation', 'OOP', 'Data Structures', 'Backend'],
    skillsLearned: [
      'Core Python syntax, conditions, and control flows',
      'Advanced data structures: dictionaries, sets, list comprehensions',
      'Object-oriented principles: inheritance, encapsulation, polymorphism',
      'File handling (CSV, JSON, text) and exception handling',
      'Python libraries: Requests, BeautifulSoup, and automation scripts'
    ],
    prerequisites: ['No programming prerequisites'],
    takeaways: [
      'Write clean, idiomatic PEP-8 compliant Python code',
      'Automate repetitive real-world tasks like file sorting and web data extraction',
      'Prepare for technical Python coding assessments'
    ],
    chapters: [
      {
        id: 'simpli-py-1',
        title: 'Module 1: Python Installation, Setup & Basic Syntax',
        duration: '1 hr 10 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 0,
        summary: 'Installing Python and VS Code, variables, comments, print statements, and user inputs.'
      },
      {
        id: 'simpli-py-2',
        title: 'Module 2: Operators, Conditionals & Loops',
        duration: '1 hr 20 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 4200,
        summary: 'Arithmetic, logical, and comparison operators. If-elif-else branching, for and while loops.'
      },
      {
        id: 'simpli-py-3',
        title: 'Module 3: Python Collections: Lists, Tuples, Dictionaries, Sets',
        duration: '1 hr 35 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 9000,
        summary: 'Indexing, slicing, dictionary key-value manipulation, set operations, and memory handling.'
      },
      {
        id: 'simpli-py-4',
        title: 'Module 4: Functions, Lambdas & Modular Code',
        duration: '1 hr 15 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 14700,
        summary: 'Defining functions, default arguments, *args, **kwargs, lambda functions, and importing modules.'
      },
      {
        id: 'simpli-py-5',
        title: 'Module 5: Object-Oriented Programming (OOP) in Python',
        duration: '1 hr 40 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 19200,
        summary: 'Class vs instance variables, __init__ constructor, inheritance, method overriding, and private attributes.'
      },
      {
        id: 'simpli-py-6',
        title: 'Module 6: File Handling, Exceptions & Practical Automation Script',
        duration: '1 hr 30 mins',
        youtubeId: 'm67-bOpOoPU',
        timestampSeconds: 25200,
        summary: 'Try-except-finally blocks, reading and writing JSON/CSV files, and building an automated organizer.'
      }
    ],
    resourceLinks: [
      { title: 'Python 3 Essential Cheatsheet', url: 'https://www.simplilearn.com', type: 'cheatsheet' },
      { title: 'GitHub Sample Automation Scripts', url: 'https://github.com', type: 'github' }
    ]
  }
];
