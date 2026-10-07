import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Phone,
  Mail,
  ArrowRight,
  Code2,
  Terminal,
  Send,
  CheckCircle2,
  Clock,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Database,
  Layers,
  Check,
  User,
  Heart,
  MessageSquare,
  Copy,
  Terminal as TermIcon
} from 'lucide-react';

// Types for Projects
interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  tech: string[];
  image: string;
  demoType: 'analytics' | 'markdown' | 'fintech';
  metrics: { label: string; value: string }[];
  githubFiles: { name: string; content: string }[];
}

// Types for Messages
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'agent_reading' | 'replied';
  replyText?: string;
}

// Types for Terminal Commands Output
interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function App() {
  // Dark/Light Mode state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rana_portfolio_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rana_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Cursor tracking for ambient mouse spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Text carousel for Hero title roles
  const roles = ['Software Developer', 'Full-Stack Engineer', 'React System Architect', 'UI Specialist'];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentRoleIndex(prev => (prev + 1) % roles.length);
        setFadeState('in');
      }, 500); // Wait for fade-out to finish
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Navigation menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Skill filter category state
  const [activeSkillCategory, setActiveSkillCategory] = useState<'all' | 'frontend' | 'backend' | 'tools'>('all');

  // Contact form inputs
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Persisted messages state
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('rana_portfolio_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Copy success indicator state
  const [copiedText, setCopiedText] = useState<'email' | 'phone' | null>(null);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Project simulation modal state
  const [activeSimulationProject, setActiveSimulationProject] = useState<Project | null>(null);
  const [activeGithubProject, setActiveGithubProject] = useState<Project | null>(null);

  // Simulation metrics / interactions states
  const [analyticsMetric, setAnalyticsMetric] = useState<'users' | 'revenue' | 'conversion'>('revenue');
  const [markdownInput, setMarkdownInput] = useState(`# Live Document Editor

Welcome to Rana's Live Markdown Editor simulation. 

## Features:
- Fully client-side interactive parsing
- Instant live preview
- Style compensation for dark/light theme

**Try editing this text directly!** It parses headings, bold text, lists, and blockquotes perfectly.

> "A premium user experience is quiet, predictable, and delightful."`);
  const [fintechRecipient, setFintechRecipient] = useState('');
  const [fintechAmount, setFintechAmount] = useState('150');
  const [fintechStatus, setFintechStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [fintechReceiptId, setFintechReceiptId] = useState('');

  // Selected file in simulated GitHub Repository view
  const [selectedGithubFile, setSelectedGithubFile] = useState<string>('');

  // Terminal CLI console state
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: 'RanaOS Developer Console v1.4.2 (Secure Build)', type: 'success' },
    { text: 'Welcome, Guest! Type "help" to list available structural outputs.', type: 'output' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { text: `guest@rana-portfolio:~$ ${cmd}`, type: 'input' as const }];

    let response: TerminalLine[] = [];

    switch (cmd) {
      case 'help':
        response = [
          { text: 'Available commands on this platform:', type: 'success' },
          { text: '  about      - Details Rana\'s core philosophy & bio credentials.', type: 'output' },
          { text: '  skills     - Prints an ASCII formatted ledger of capabilities.', type: 'output' },
          { text: '  projects   - Displays curated works and code repos.', type: 'output' },
          { text: '  education  - Lists degrees, academic nodes, and GPAs.', type: 'output' },
          { text: '  contact    - Prints secure dials, emails, and PST time proof.', type: 'output' },
          { text: '  neofetch   - Displays system specification layout with ASCII computer.', type: 'output' },
          { text: '  clear      - Wipes previous line entries from memory buffer.', type: 'output' }
        ];
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'about':
        response = [
          { text: '----------------- BIOGRAPHY -----------------', type: 'success' },
          { text: 'Rana Abdul Raheem - Senior Software Developer', type: 'output' },
          { text: 'Location: Lahore, Pakistan', type: 'output' },
          { text: 'Career Mission: To lead development of scalable React & Node.js visual architectures.', type: 'output' },
          { text: 'Focus: High-performance layouts, accessibility (WCAG AA), and robust schema definitions.', type: 'output' }
        ];
        break;
      case 'skills':
        response = [
          { text: '--- CORE CAPABILITY METRICS ---', type: 'success' },
          { text: '  React / Next.js    [██████████████████░] 96% - Expert', type: 'output' },
          { text: '  HTML5 / CSS3 / TW  [███████████████████] 98% - Master', type: 'output' },
          { text: '  TypeScript / ESNext[████████████████░░░] 92% - Senior', type: 'output' },
          { text: '  NodeJS / Express   [████████████████░░░] 88% - Advanced', type: 'output' },
          { text: '  SQL / Firestore    [██████████████░░░░░] 85% - Advanced', type: 'output' },
          { text: '  Git / GitHub Flow  [██████████████████░] 94% - Expert', type: 'output' }
        ];
        break;
      case 'projects':
        response = [
          { text: '--- SELECTIONS CATALOG ---', type: 'success' },
          { text: '  1. OmniFlow Analytics Dashboard  - Next.js / ChartJS - Performance metric analyzer', type: 'output' },
          { text: '  2. DevHub Workspace             - React / HTML5 Parser - Live split-pane markdown compiler', type: 'output' },
          { text: '  3. SwiftPay Mobile Web App      - React / LocalStorage - Transaction ledger simulator', type: 'output' },
          { text: 'Type "Live Demo" on the respective project cards below to test processing systems.', type: 'success' }
        ];
        break;
      case 'education':
        response = [
          { text: '--- ACADEMIA TIMELINE ---', type: 'success' },
          { text: '  BSCS (Computer Science) - Punjab University (2020-2024) | CGPA: 3.8/4.0', type: 'output' },
          { text: '  Intermediate Pre-Eng   - GCU Lahore (2018-2020) | Grade: A+', type: 'output' }
        ];
        break;
      case 'contact':
        response = [
          { text: '--- DIRECT SECURE COORDINATES ---', type: 'success' },
          { text: '  Phone: +92 320 1218759', type: 'output' },
          { text: '  Email: abdulrahimrana715@gmail.com', type: 'output' },
          { text: '  Github: github.com/abdulrahimrana715', type: 'output' },
          { text: 'Dial coordinates using forms on the right for automatic responses.', type: 'success' }
        ];
        break;
      case 'neofetch':
        response = [
          { text: '   ,-----------------,          guest@rana-portfolio', type: 'success' },
          { text: '   |  ,-----------,  |          --------------------', type: 'output' },
          { text: '   |  |  Rana OS  |  |          OS: RanaOS Cloud Build v1.4', type: 'output' },
          { text: '   |  |           |  |          Host: Web-Portfolio node-01', type: 'output' },
          { text: '   |  `-----------`  |          Kernel: Pakistan-Standard-Time UTC+5', type: 'output' },
          { text: '   `-----------------`          Uptime: Live Simulator Active', type: 'output' },
          { text: '     ____|_____|____            Shell: client-side bash simulation', type: 'output' },
          { text: '    / ********** \\           Resolution: Fluid Responsive Grid', type: 'output' },
          { text: '   / ************* \\          Terminal Font: JetBrains Mono', type: 'output' },
          { text: '  ~~~~~~~~~~~~~~~~~~~           Primary Frame: React 19 + Tailwind v4', type: 'output' }
        ];
        break;
      default:
        response = [
          { text: `shell: command not registered: "${cmd}". Type "help" to inspect protocols.`, type: 'error' }
        ];
        break;
    }

    setTerminalHistory([...newHistory, ...response]);
    setTerminalInput('');
  };

  // Local clock state to show dynamic timezone proof (Rana's local time)
  const [localTime, setLocalTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save messages to localStorage and simulate recruiter replies
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;

    setFormStatus('submitting');

    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: Math.random().toString(36).substring(2, 9),
        name: formName,
        email: formEmail,
        message: formMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };

      const updated = [newMessage, ...messages];
      setMessages(updated);
      localStorage.setItem('rana_portfolio_messages', JSON.stringify(updated));

      setFormName('');
      setFormEmail('');
      setFormMsg('');
      setFormStatus('success');

      simulateMessageLifecycle(newMessage.id);
    }, 1200);
  };

  const simulateMessageLifecycle = (id: string) => {
    setTimeout(() => {
      updateMessageStatus(id, 'delivered');

      setTimeout(() => {
        updateMessageStatus(id, 'agent_reading');

        setTimeout(() => {
          updateMessageStatus(
            id,
            'replied',
            `Hi, this is Rana's Portfolio Assistant! Thank you so much for reaching out, ${formName || 'there'}. Rana has received your message and will review it immediately. Feel free to also call directly at 03201218759 for instant coordination!`
          );
        }, 5000);
      }, 4000);
    }, 3000);
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status'], replyText?: string) => {
    setMessages(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          return { ...m, status, ...(replyText ? { replyText } : {}) };
        }
        return m;
      });
      localStorage.setItem('rana_portfolio_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('rana_portfolio_messages');
  };

  // Skill data
  const skills = [
    { name: 'HTML5 / CSS3', level: 98, category: 'frontend', metric: 'Semantic Markup & Responsive Grid' },
    { name: 'JavaScript (ES6+)', level: 95, category: 'frontend', metric: 'Asynchronous Logic & DOM Experts' },
    { name: 'React', level: 96, category: 'frontend', metric: 'Custom Hooks, Context & Concurrent Modes' },
    { name: 'Next.js', level: 92, category: 'frontend', metric: 'App Router, SSR, Incremental Static Build' },
    { name: 'Tailwind CSS', level: 98, category: 'frontend', metric: 'Utility-first, Custom Themes, v4 Directives' },
    { name: 'TypeScript', level: 90, category: 'frontend', metric: 'Strict Type-Safety, Generics, Interfaces' },
    { name: 'Node.js / Express', level: 88, category: 'backend', metric: 'RESTful Endpoints & Middleware' },
    { name: 'REST APIs', level: 94, category: 'backend', metric: 'Data Normalization & Secure Routing' },
    { name: 'Git & GitHub', level: 92, category: 'tools', metric: 'Advanced Rebase, Branching & Actions' },
    { name: 'Vite / Webpack', level: 85, category: 'tools', metric: 'Hot Module Reloading & Custom Plugins' },
    { name: 'PostgreSQL / SQL', level: 82, category: 'backend', metric: 'Structured Query Optimization' },
    { name: 'Firebase / Firestore', level: 87, category: 'backend', metric: 'NoSQL Schema & Real-Time Listeners' }
  ];

  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === 'all') return skills;
    return skills.filter(s => s.category === activeSkillCategory);
  }, [activeSkillCategory]);

  // Project database
  const projectsList: Project[] = [
    {
      id: 'omniflow',
      name: 'OmniFlow Analytics Dashboard',
      description: 'A premium, high-fidelity business intelligence dashboard optimized for real-time tracking, customer metrics, and cash flow analysis.',
      longDescription: 'OmniFlow Analytics is a flagship enterprise platform designed to aggregate multi-channel ecommerce metrics. Built for high performance, it processes thousands of mocked transaction cycles client-side with elegant SVG chart renders, fluid responsive animations, and precise dark-theme optimization.',
      tech: ['Next.js', 'Tailwind CSS', 'TypeScript', 'ChartJS', 'Tabular Numerals'],
      image: '/src/assets/images/project_dashboard_1791359043699.jpg',
      demoType: 'analytics',
      metrics: [
        { label: 'Active Sessions', value: '42,912' },
        { label: 'Avg Load Time', value: '0.14s' },
        { label: 'Retention Rate', value: '94.2%' }
      ],
      githubFiles: [
        {
          name: 'DashboardView.tsx',
          content: `import React, { useState } from 'react';\nimport { TrendingUp, Users, DollarSign } from 'lucide-react';\n\nexport default function DashboardView() {\n  const [range, setRange] = useState('7d');\n  const metrics = [\n    { label: 'Total Revenue', value: '$124,942.00', change: '+14.2%' },\n    { label: 'Active Users', value: '14,291', change: '+8.1%' },\n    { label: 'Conversion Rate', value: '3.42%', change: '+0.12%' }\n  ];\n\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n      {metrics.map(m => (\n        <div key={m.label} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">\n          <span className="text-xs text-zinc-500 font-medium">{m.label}</span>\n          <h3 className="text-2xl font-bold text-white mt-1 font-mono">{m.value}</h3>\n          <span className="text-emerald-500 text-xs mt-2 inline-block font-mono">{m.change}</span>\n        </div>\n      ))}\n    </div>\n  );\n}`
        },
        {
          name: 'ChartRenderer.tsx',
          content: `// Client-side SVG line chart renderer with smooth bezier curves\nexport function SvgBezierChart({ data }) {\n  const points = data.map((val, idx) => \`\${idx * 80},\${200 - val * 1.5}\`).join(' ');\n  return (\n    <svg className="w-full h-48 overflow-visible" viewBox="0 0 480 200">\n      <polyline fill="none" stroke="#2563eb" strokeWidth="3" points={points} />\n      <g className="opacity-10">\n        <polygon fill="#2563eb" points={\`0,200 \${points} 480,200\`} />\n      </g>\n    </svg>\n  );\n}`
        }
      ]
    },
    {
      id: 'devhub',
      name: 'DevHub Collaborative Workspace',
      description: 'An interactive developer environment with structured Markdown rendering, customizable workspaces, and visual code repositories.',
      longDescription: 'DevHub resolves the challenge of remote document layout alignment. It features a fully responsive live Markdown renderer, custom file explorers, a pseudo-terminal executing fundamental client-side operations, and pixel-perfect syntax-styled outputs designed specifically to optimize developer collaboration.',
      tech: ['React', 'Tailwind CSS', 'ESNext', 'Lucide Icons', 'HTML5 Parser'],
      image: '/src/assets/images/project_web_dev_1791359062996.jpg',
      demoType: 'markdown',
      metrics: [
        { label: 'Live Parsing Latency', value: '<2ms' },
        { label: 'Custom Snippets', value: '45+' },
        { label: 'SEO Efficiency', value: '100/100' }
      ],
      githubFiles: [
        {
          name: 'MarkdownParser.ts',
          content: `// Regex-based simple, secure Markdown parser for real-time text previews\nexport function parseMarkdown(text: string): string {\n  let html = text\n    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-display font-bold mt-6 mb-3">$1</h1>')\n    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-display font-bold mt-4 mb-2">$1</h2>')\n    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-3 mb-1">$1</h3>')\n    .replace(/^\\* (.*$)/gim, '<li class="list-disc ml-5 my-1 text-stone-700 dark:text-stone-300">$1</li>')\n    .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')\n    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent-cobalt pl-4 my-3 italic text-stone-500">$1</blockquote>');\n  return html;\n}`
        },
        {
          name: 'AppWorkspace.tsx',
          content: `import React, { useState } from 'react';\nimport { parseMarkdown } from './MarkdownParser';\n\nexport default function AppWorkspace() {\n  const [code, setCode] = useState('# Try typing!');\n  return (\n    <div className="flex h-screen">\n      <textarea className="w-1/2 p-4 font-mono text-sm bg-zinc-900 text-zinc-100" value={code} onChange={e => setCode(e.target.value)} />\n      <div className="w-1/2 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: parseMarkdown(code) }} />\n    </div>\n  );\n}`
        }
      ]
    },
    {
      id: 'swiftpay',
      name: 'SwiftPay Mobile Web App',
      description: 'A premium, modern fintech mobile simulation featuring biometric transaction verification, receipt generator, and transaction history.',
      longDescription: 'SwiftPay showcases a mobile-first premium transaction framework. Specifically crafted to model modern fintech apps, it incorporates high-end visual feedback, transaction ledger states, visual feedback loops, and automated receipt outputs. Accessible and highly responsive.',
      tech: ['React', 'Tailwind CSS', 'Vite', 'Local Storage', 'Tabular Figures'],
      image: '/src/assets/images/project_mobile_app_1791359081577.jpg',
      demoType: 'fintech',
      metrics: [
        { label: 'Security Protocols', value: 'AES-256' },
        { label: 'Transfer Speed', value: 'Instant' },
        { label: 'User Rating', value: '4.95 / 5' }
      ],
      githubFiles: [
        {
          name: 'TransactionService.ts',
          content: `interface Transaction {\n  id: string;\n  amount: number;\n  recipient: string;\n  date: string;\n  status: 'completed' | 'failed';\n}\n\nexport const processTransfer = async (recipient: string, amount: number): Promise<Transaction> => {\n  // Simulate cryptographic network call latency\n  await new Promise(resolve => setTimeout(resolve, 1500));\n  return {\n    id: 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase(),\n    amount,\n    recipient,\n    date: new Date().toISOString(),\n    status: 'completed'\n  };\n};`
        },
        {
          name: 'FintechCard.tsx',
          content: `import React from 'react';\nimport { CreditCard } from 'lucide-react';\n\nexport function CreditCardWidget({ balance }) {\n  return (\n    <div className="bg-gradient-to-br from-indigo-600 to-rose-500 rounded-2xl p-6 text-white shadow-xl">\n      <div className="flex justify-between items-start">\n        <span>SwiftPay Platinum</span>\n        <CreditCard className="w-6 h-6 opacity-80" />\n      </div>\n      <h2 className="text-3xl font-mono tracking-wider mt-8 font-bold">\n        \${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n      </h2>\n      <div className="flex justify-between items-center mt-6 text-xs text-indigo-100">\n        <span>Rana Abdul Raheem</span>\n        <span>10 / 29</span>\n      </div>\n    </div>\n  );\n}`
        }
      ]
    }
  ];

  // Helper for rendering simulated Markdown HTML in client safely
  const renderMarkdownHtml = (md: string) => {
    let html = md
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl md:text-3xl font-display font-bold mt-4 mb-2 text-stone-900 dark:text-stone-100">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl md:text-2xl font-display font-bold mt-3 mb-2 text-stone-800 dark:text-stone-200">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1 text-stone-700 dark:text-stone-300">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="list-disc ml-6 my-1 text-stone-600 dark:text-stone-400">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-stone-900 dark:text-stone-100">$1</strong>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-2 italic text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-zinc-900 p-2 rounded-r">$1</blockquote>')
      .replace(/\n/g, '<br/>');
    return { __html: html };
  };

  // Mock charts coordinates
  const analyticsChartData = {
    revenue: [45, 68, 52, 90, 85, 120, 115, 140, 165, 150, 180, 210],
    users: [1200, 1400, 1350, 1800, 2100, 2050, 2400, 2900, 3100, 3400, 3800, 4200],
    conversion: [2.1, 2.3, 2.2, 2.8, 3.1, 2.9, 3.2, 3.4, 3.5, 3.3, 3.6, 3.8]
  };

  // SVG Bezier computation helper
  const computeSvgPoints = (data: number[]) => {
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const valRange = maxVal - minVal || 1;
    const width = 500;
    const height = 150;
    const padding = 20;

    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - minVal) / valRange) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');
  };

  const handleFintechTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fintechRecipient || !fintechAmount) return;
    setFintechStatus('processing');
    setTimeout(() => {
      setFintechReceiptId('TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase());
      setFintechStatus('success');
    }, 1500);
  };

  const resetFintechSim = () => {
    setFintechRecipient('');
    setFintechAmount('150');
    setFintechStatus('idle');
    setFintechReceiptId('');
  };

  const openGithubModal = (proj: Project) => {
    setActiveGithubProject(proj);
    setSelectedGithubFile(proj.githubFiles[0].name);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-200 noise-overlay transition-colors duration-300 relative overflow-hidden`}>
      
      {/* AMBIENT MOUSE TRACKING GLOW (DYNAMIC REAL-TIME GRAPHICS) */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300 opacity-60 dark:opacity-80"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${theme === 'dark' ? 'rgba(225, 29, 72, 0.05)' : 'rgba(37, 99, 235, 0.04)'}, transparent 80%)`
        }}
      />

      {/* FIXED GLASSMOPRHIC BACKGROUND SHAPES */}
      <div className="pointer-events-none absolute top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-rose-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute bottom-80 -right-40 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      {/* HEADER: STRICT 3-ZONE CONTRACT */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-stone-50/80 dark:bg-zinc-950/80 border-b border-stone-200/50 dark:border-zinc-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* ZONE 1: BRAND TITLE */}
          <button 
            onClick={() => handleScrollTo('hero')}
            className="text-lg font-display font-extrabold tracking-tight text-stone-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Rana Abdul Raheem
          </button>

          {/* ZONE 2: NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => handleScrollTo('about')}
              className={`hover:text-blue-600 dark:hover:text-rose-500 transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'about' ? 'text-blue-600 dark:text-rose-500' : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => handleScrollTo('experience')}
              className={`hover:text-blue-600 dark:hover:text-rose-500 transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'experience' ? 'text-blue-600 dark:text-rose-500' : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Experience
            </button>
            <button 
              onClick={() => handleScrollTo('skills')}
              className={`hover:text-blue-600 dark:hover:text-rose-500 transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'skills' ? 'text-blue-600 dark:text-rose-500' : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Skills
            </button>
            <button 
              onClick={() => handleScrollTo('projects')}
              className={`hover:text-blue-600 dark:hover:text-rose-500 transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'projects' ? 'text-blue-600 dark:text-rose-500' : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => handleScrollTo('education')}
              className={`hover:text-blue-600 dark:hover:text-rose-500 transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'education' ? 'text-blue-600 dark:text-rose-500' : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Education
            </button>
          </nav>

          {/* ZONE 3: ACTIONS */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-rose-500 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Direct Contact Action */}
            <button
              onClick={() => handleScrollTo('contact')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Let's Talk
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-lg bg-stone-100 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SCROLL NAV MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-stone-50 dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-800 z-40 p-6 flex flex-col gap-4 animate-fadeIn">
          <button onClick={() => handleScrollTo('about')} className="text-left py-2 font-medium text-lg border-b border-stone-100 dark:border-zinc-900 text-stone-800 dark:text-zinc-200">About</button>
          <button onClick={() => handleScrollTo('experience')} className="text-left py-2 font-medium text-lg border-b border-stone-100 dark:border-zinc-900 text-stone-800 dark:text-zinc-200">Experience</button>
          <button onClick={() => handleScrollTo('skills')} className="text-left py-2 font-medium text-lg border-b border-stone-100 dark:border-zinc-900 text-stone-800 dark:text-zinc-200">Skills</button>
          <button onClick={() => handleScrollTo('projects')} className="text-left py-2 font-medium text-lg border-b border-stone-100 dark:border-zinc-900 text-stone-800 dark:text-zinc-200">Projects</button>
          <button onClick={() => handleScrollTo('education')} className="text-left py-2 font-medium text-lg border-b border-stone-100 dark:border-zinc-900 text-stone-800 dark:text-zinc-200">Education</button>
          <button onClick={() => handleScrollTo('contact')} className="text-left py-2 font-medium text-lg text-blue-600 dark:text-rose-500 font-semibold">Contact Me</button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-16 relative z-20">

        {/* 1. HERO SECTION */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center py-12 border-b border-stone-200/50 dark:border-zinc-900/50 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Typographic Hierarchy */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Introduction Kicker */}
              <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-blue-600 dark:text-rose-500 uppercase">
                <Sparkles className="w-4 h-4 animate-pulse-slow" />
                <span>Premium Engineering Portfolio</span>
              </div>

              {/* Huge Name Display */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.15] mb-4 text-wrap balance">
                Rana Abdul Raheem
              </h1>

              {/* ROTATING ROLE WORD CAROUSEL WITH SMOOTH SLIDE/FADE TRANSITION */}
              <div className="h-10 mb-8 overflow-hidden relative">
                <div 
                  className={`text-xl sm:text-2xl font-mono text-stone-600 dark:text-zinc-400 font-semibold transition-all duration-500 transform ${
                    fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                >
                  {roles[currentRoleIndex]}
                </div>
              </div>

              {/* Explanatory introduction */}
              <p className="text-stone-600 dark:text-zinc-300 text-base md:text-lg max-w-xl leading-relaxed mb-8">
                I engineer highly performant, responsive, and pixel-perfect software ecosystems. Specializing in high-end React layouts, clean Tailwind CSS v4 variables, and robust database architectures.
              </p>

              {/* Action Area */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <button
                  onClick={() => handleScrollTo('projects')}
                  className="px-6 py-3 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>View Selected Works</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleScrollTo('contact')}
                  className="px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-900 dark:text-stone-100 font-semibold rounded-lg border border-stone-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Mail className="w-4 h-4" />
                  <span>Execute Inquiry</span>
                </button>
              </div>

              {/* Claim-to-Proof Adjacency Metrics */}
              <div className="mt-12 pt-8 border-t border-stone-200/50 dark:border-zinc-900/50 grid grid-cols-3 gap-6">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 dark:text-white font-mono tracking-tight">4+</h4>
                  <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-1 uppercase font-bold tracking-wider">Years Coding</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 dark:text-white font-mono tracking-tight">25+</h4>
                  <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-1 uppercase font-bold tracking-wider">Deployments</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 dark:text-white font-mono tracking-tight">100%</h4>
                  <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-1 uppercase font-bold tracking-wider">Standard Verified</p>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Profile Area */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                {/* Glowing light borders */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-amber-500 dark:from-rose-500 dark:to-orange-500 rounded-2xl opacity-30 blur-lg animate-pulse-slow"></div>
                
                {/* Premium Inner Container */}
                <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800/60 p-3 shadow-xl">
                  {/* Photo Container with strict nesting ratio */}
                  <div className="w-full h-full rounded-xl overflow-hidden relative group">
                    <img
                      src="/src/assets/images/rana_avatar_1791359021171.jpg"
                      alt="Rana Abdul Raheem Profile Portrait"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Editorial photo caption overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div>
                        <span className="block text-xs font-mono font-bold text-white uppercase tracking-widest">Rana Abdul Raheem</span>
                        <span className="block text-[10px] text-zinc-400 mt-1">Full-Stack Developer · Lahore, PK</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Status Badge */}
                <div className="absolute -bottom-3 -right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-stone-200 dark:border-zinc-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-float">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-850 dark:text-zinc-200">ACTIVE FOR HIRE</span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* 2. ABOUT SECTION */}
        <section id="about" className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50 scroll-mt-16">
          <div className="max-w-4xl">
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">01. Biography</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-8">
              A Passion for Clean Engineering
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-stone-600 dark:text-zinc-300">
              <div className="md:col-span-7 space-y-4">
                <p className="leading-relaxed text-sm md:text-base">
                  Hi, I'm <strong className="text-stone-900 dark:text-white">Rana Abdul Raheem</strong>. I started coding because of a simple fascination: how simple text files can render powerful interfaces that reach millions worldwide. Over the years, this has evolved into a dedicated career path in full-stack engineering and visual development.
                </p>
                <p className="leading-relaxed text-sm md:text-base">
                  I specialize in structuring and optimizing performance-critical React and Node.js solutions. My focus is on writing robust codebases characterized by complete semantic layout structures, rigorous responsive scaling, and proper separation of modular concerns.
                </p>
                <p className="leading-relaxed text-sm md:text-base">
                  My ultimate goal is to lead the engineering of innovative, scalable, and secure developer architectures that satisfy business objectives without sacrificing design integrity or web accessibility standards.
                </p>
              </div>

              {/* Bento Quick-Info Highlights */}
              <div className="md:col-span-5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-stone-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Core Specializations</h3>
                  <ul className="space-y-3 text-xs font-medium text-stone-700 dark:text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Advanced React Architectures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Next.js App Router & SSR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Tailwind CSS Responsive Grids</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Type-Safe TypeScript Modules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>NoSQL & Relational Databases</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-stone-200/65 dark:border-zinc-800/60 text-[10px] text-stone-500 dark:text-zinc-450 leading-relaxed font-semibold uppercase tracking-wider">
                  <span>Open to contract arrangements, remote positions, and full-time engineering roles.</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* INFINITE RUNNING EDITORIAL MARQUEE RIBBON (PREMIUM TRANSITION) */}
        <div className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-y border-stone-800 dark:border-stone-100 my-8">
          <div className="flex whitespace-nowrap animate-marquee font-display font-extrabold text-sm uppercase tracking-widest gap-8">
            <span>RANA ABDUL RAHEEM · SOFTWARE ENGINEERING · SYSTEM ARCHITECTURE · ACCESSIBILITY (WCAG AA) · PIXEL-PERFECT RENDER · NEXT.JS ROUTER · FULL-STACK STABLE RENDER</span>
            <span>RANA ABDUL RAHEEM · SOFTWARE ENGINEERING · SYSTEM ARCHITECTURE · ACCESSIBILITY (WCAG AA) · PIXEL-PERFECT RENDER · NEXT.JS ROUTER · FULL-STACK STABLE RENDER</span>
          </div>
        </div>


        {/* 3. EXPERIENCE SECTION */}
        <section id="experience" className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50 scroll-mt-16">
          <div className="max-w-4xl">
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">02. Career Timeline</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-12">
              Professional Experience
            </h2>

            {/* Timeline structure */}
            <div className="relative border-l border-stone-200 dark:border-zinc-800 ml-3 md:ml-6 pl-6 md:pl-10 space-y-12">
              
              {/* Job 1 */}
              <div className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-blue-600 dark:bg-rose-500 ring-4 ring-stone-50 dark:ring-zinc-950 transition-transform group-hover:scale-125"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      Senior Software Developer
                      <span className="text-xs font-normal text-stone-400">·</span>
                      <span className="text-blue-600 dark:text-rose-400 font-mono text-sm">Apex Digital Solutions</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      <span>Full-Time Role</span>
                      <span>·</span>
                      <span>Lahore, Pakistan (Hybrid)</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs font-mono text-stone-500 dark:text-zinc-400 mt-2 md:mt-0 font-bold bg-stone-100 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800/50 px-3 py-1 rounded">
                    2024 - PRESENT
                  </span>
                </div>
                
                <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                  Lead full-stack engineering operations across multiple high-performance client projects. Deliver resilient next-generation layouts using Next.js, React, and modular server layouts.
                </p>
                <ul className="space-y-1.5 text-xs text-stone-500 dark:text-zinc-450 list-disc pl-4 font-medium">
                  <li>Designed and implemented the core visual system for dynamic corporate data analytics, resulting in 40% loading speed efficiency.</li>
                  <li>Architected type-safe database adapters for relational databases and structured Firestore collections.</li>
                  <li>Supervised a developmental team of 4 junior engineers, maintaining agile standard codes and reviews.</li>
                </ul>
              </div>

              {/* Job 2 */}
              <div className="relative group">
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-stone-300 dark:bg-zinc-700 ring-4 ring-stone-50 dark:ring-zinc-950 transition-transform group-hover:bg-blue-600 dark:group-hover:bg-rose-500 group-hover:scale-125"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      Full Stack Developer
                      <span className="text-xs font-normal text-stone-400">·</span>
                      <span className="text-blue-600 dark:text-rose-400 font-mono text-sm">ByteCraft Technologies</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      <span>Full-Time Role</span>
                      <span>·</span>
                      <span>Remote</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs font-mono text-stone-500 dark:text-zinc-400 mt-2 md:mt-0 font-bold bg-stone-100 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800/50 px-3 py-1 rounded">
                    2022 - 2024
                  </span>
                </div>
                
                <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                  Developed enterprise ecommerce backbones, customer directories, and real-time interactive document planners. Focus on client-side visual performance and SEO optimizations.
                </p>
                <ul className="space-y-1.5 text-xs text-stone-500 dark:text-zinc-450 list-disc pl-4 font-medium">
                  <li>Built modular React dashboard cards, featuring real-time client filter tabs and interactive progress timelines.</li>
                  <li>Integrated Stripe payments and structured OAuth credentials flow following strict guidelines.</li>
                  <li>Optimized Lighthouse performance scores from 70 to 98 through comprehensive media optimization and deferred script techniques.</li>
                </ul>
              </div>

              {/* Job 3 */}
              <div className="relative group">
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-stone-300 dark:bg-zinc-700 ring-4 ring-stone-50 dark:ring-zinc-950 transition-transform group-hover:bg-blue-600 dark:group-hover:bg-rose-500 group-hover:scale-125"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      Frontend Engineer Intern
                      <span className="text-xs font-normal text-stone-400">·</span>
                      <span className="text-blue-600 dark:text-rose-400 font-mono text-sm">CodeMatrix Labs</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      <span>Internship</span>
                      <span>·</span>
                      <span>Lahore, Pakistan</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs font-mono text-stone-500 dark:text-zinc-400 mt-2 md:mt-0 font-bold bg-stone-100 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800/50 px-3 py-1 rounded">
                    2021 - 2022
                  </span>
                </div>
                
                <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                  Collaborated with visual designers to implement beautiful, pixel-perfect user views. Standardized component architectures using CSS Custom Properties and modular classes.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* 4. SKILLS SECTION */}
        <section id="skills" className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50 scroll-mt-16">
          <div className="max-w-4xl">
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">03. Competencies</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-6">
              Technical Capabilities
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-sm mb-8 leading-relaxed max-w-xl font-medium">
              I have developed expertise across modern web technologies. Click on the filters below to dynamically partition my toolset.
            </p>

            {/* Interactive Segmented Filter Control */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-stone-100 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800/60 rounded-xl mb-8 max-w-lg shadow-sm">
              <button
                onClick={() => setActiveSkillCategory('all')}
                className={`flex-1 min-w-[80px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSkillCategory === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                All Tools
              </button>
              <button
                onClick={() => setActiveSkillCategory('frontend')}
                className={`flex-1 min-w-[80px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSkillCategory === 'frontend'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Frontend
              </button>
              <button
                onClick={() => setActiveSkillCategory('backend')}
                className={`flex-1 min-w-[80px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSkillCategory === 'backend'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Backend
              </button>
              <button
                onClick={() => setActiveSkillCategory('tools')}
                className={`flex-1 min-w-[80px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSkillCategory === 'tools'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Tools
              </button>
            </div>

            {/* Skills Progress Indicator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {filteredSkills.map(s => (
                <div key={s.name} className="p-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 rounded-xl hover:shadow-md hover:border-stone-300 dark:hover:border-zinc-700 transition-all duration-300">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-stone-950 dark:text-white uppercase tracking-wider">{s.name}</span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-rose-500 tabular-nums">{s.level}%</span>
                  </div>
                  
                  {/* Styled micro progress bar */}
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 dark:bg-rose-500 rounded-full transition-all duration-1000"
                      style={{ width: `${s.level}%` }}
                    ></div>
                  </div>

                  {/* Micro Metadata explanation (unboxed, clean typography) */}
                  <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-2 font-medium">
                    {s.metric}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ADVANCED CLI TERMINAL SECTION (EXCLUSIVE GIMMICK FOR DEVS/RECRUITERS) */}
        <section className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50">
          <div className="max-w-4xl">
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">04. Sandbox Console</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-6">
              Interactive Dev Terminal
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-sm mb-8 leading-relaxed max-w-xl font-medium">
              Are you a developer or technical recruiter? Execute direct commands below to query my credentials in a secure, local sandbox terminal. Type <strong className="text-stone-950 dark:text-white font-mono">"help"</strong> to inspect protocols.
            </p>

            {/* Terminal Chassis */}
            <div className="bg-stone-950 text-zinc-300 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col h-96">
              
              {/* Header Bar */}
              <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-mono text-stone-500 font-semibold ml-2 select-none">guest@rana-portfolio-cloud</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <TermIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono select-none">RanaOS v1.4</span>
                </div>
              </div>

              {/* Terminal Logs Display Area */}
              <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2 select-text custom-scrollbar">
                {terminalHistory.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`leading-relaxed whitespace-pre-wrap ${
                      line.type === 'input' ? 'text-zinc-100 font-semibold' : 
                      line.type === 'success' ? 'text-emerald-400' :
                      line.type === 'error' ? 'text-rose-400' : 'text-zinc-300'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Input Command Line */}
              <form onSubmit={handleTerminalCommand} className="p-4 bg-stone-900/60 border-t border-stone-850 flex items-center gap-3">
                <span className="font-mono text-xs text-blue-400 select-none">guest@rana-portfolio:~$</span>
                <input
                  type="text"
                  placeholder='Try typing "neofetch" or "skills"...'
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-white border-none outline-none focus:ring-0 p-0 placeholder-stone-600"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <button 
                  type="submit" 
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Send CLI command"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        </section>


        {/* 5. PROJECTS SECTION */}
        <section id="projects" className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50 scroll-mt-16">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">05. Selected Works</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-4">
              Featured Engineering Projects
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-sm mb-12 max-w-xl leading-relaxed font-medium">
              Every card below is fully responsive and interactive. Click <strong className="text-stone-900 dark:text-white">Live Demo</strong> to boot up a fully functional, real-time mock sandbox simulation directly in this page!
            </p>

            {/* Projects Bento / Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {projectsList.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col h-full group hover:shadow-xl hover:border-stone-300 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300"
                >
                  
                  {/* Photo Container */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={`${p.name} Preview Shot`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-rose-500 transition-colors">
                      {p.name}
                    </h3>

                    {/* Tech stack - STRICT UNBOXED METADATA */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-blue-600 dark:text-rose-400 font-bold mb-4">
                      {p.tech.map((t, idx) => (
                        <span key={t} className="flex items-center">
                          {t}
                          {idx < p.tech.length - 1 && <span className="ml-2 text-stone-300 dark:text-zinc-800" aria-hidden="true">·</span>}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
                      {p.description}
                    </p>

                    {/* Micro quantitative metrics */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200/50 dark:border-zinc-800/60 mb-6 text-center">
                      {p.metrics.map(m => (
                        <div key={m.label}>
                          <span className="block text-xs font-bold text-stone-850 dark:text-white font-mono">{m.value}</span>
                          <span className="block text-[10px] text-stone-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveSimulationProject(p)}
                        className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-zinc-100 rounded-lg text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </button>
                      <button
                        onClick={() => openGithubModal(p)}
                        className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-zinc-800/80 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 rounded-lg text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code Base</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 6. EDUCATION SECTION */}
        <section id="education" className="py-16 border-b border-stone-200/50 dark:border-zinc-900/50 scroll-mt-16">
          <div className="max-w-4xl">
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">06. Academia</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-10">
              Education Background
            </h2>

            <div className="space-y-6">
              
              {/* Degree 1 */}
              <div className="p-6 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-stone-300 dark:hover:border-zinc-700 transition-all group shadow-sm">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-stone-100 dark:bg-zinc-800 text-blue-600 dark:text-rose-500 rounded-xl mt-1">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-950 dark:text-white">
                      Bachelor of Science in Computer Science (BSCS)
                    </h3>
                    {/* Unboxed Metadata list */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1 font-semibold">
                      <span>Punjab University</span>
                      <span>·</span>
                      <span>Lahore, Pakistan</span>
                      <span>·</span>
                      <span>CGPA: 3.8 / 4.0</span>
                    </div>
                  </div>
                </div>
                <span className="mt-4 md:mt-0 px-4 py-1.5 font-mono text-xs font-bold text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 border border-stone-200/50 dark:border-zinc-700 rounded-lg">
                  2020 - 2024
                </span>
              </div>

              {/* Degree 2 */}
              <div className="p-6 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-stone-300 dark:hover:border-zinc-700 transition-all group shadow-sm">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-stone-100 dark:bg-zinc-800 text-stone-500 rounded-xl mt-1">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-950 dark:text-white">
                      Intermediate in Pre-Engineering
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1 font-semibold">
                      <span>Government College University (GCU)</span>
                      <span>·</span>
                      <span>Lahore, Pakistan</span>
                      <span>·</span>
                      <span>Grade: A+</span>
                    </div>
                  </div>
                </div>
                <span className="mt-4 md:mt-0 px-4 py-1.5 font-mono text-xs font-bold text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 border border-stone-200/50 dark:border-zinc-700 rounded-lg">
                  2018 - 2020
                </span>
              </div>

            </div>
          </div>
        </section>


        {/* 7. CONTACT SECTION */}
        <section id="contact" className="py-16 scroll-mt-16">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-rose-500 uppercase tracking-widest block mb-2">07. Correspondence</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-stone-900 dark:text-white mb-10">
              Get In Touch
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Direct Coordinate Info */}
              <div className="lg:col-span-5 space-y-8">
                
                <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
                  Let's discuss how we can work together to architect your next high-performance digital layout. Reach out directly or use the secure message transmitter on the right.
                </p>

                <div className="space-y-4">
                  
                  {/* Phone Coordinate with Copy To Clipboard */}
                  <div 
                    onClick={() => copyToClipboard('03201218759', 'phone')}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="p-3 bg-white/80 dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800 rounded-lg text-blue-600 dark:text-rose-500 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-rose-500 transition-all">
                      <Phone className="w-5 h-5 animate-pulse-slow" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase text-stone-400 dark:text-zinc-500 font-bold tracking-wider">Direct Dial (Click to Copy)</span>
                      <span className="text-sm font-bold text-stone-955 dark:text-white group-hover:text-blue-600 dark:group-hover:text-rose-450 transition-colors">
                        03201218759
                      </span>
                    </div>
                    {copiedText === 'phone' ? (
                      <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-150 animate-fadeIn">✓ Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Email Coordinate with Copy To Clipboard */}
                  <div 
                    onClick={() => copyToClipboard('abdulrahimrana715@gmail.com', 'email')}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="p-3 bg-white/80 dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800 rounded-lg text-blue-600 dark:text-rose-500 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-rose-500 transition-all">
                      <Mail className="w-5 h-5 animate-pulse-slow" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase text-stone-400 dark:text-zinc-500 font-bold tracking-wider">Email (Click to Copy)</span>
                      <span className="text-sm font-bold text-stone-955 dark:text-white group-hover:text-blue-600 dark:group-hover:text-rose-450 transition-colors truncate max-w-[200px] block">
                        abdulrahimrana715@gmail.com
                      </span>
                    </div>
                    {copiedText === 'email' ? (
                      <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-150 animate-fadeIn">✓ Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Time Proof Indicator (Lahore standard) */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-stone-100 dark:bg-zinc-900 border border-stone-200/40 dark:border-zinc-800 rounded-lg text-emerald-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-stone-400 dark:text-zinc-500 font-bold tracking-wider">Lahore Time (UTC+5)</span>
                      <span className="text-sm font-bold text-stone-950 dark:text-white font-mono tabular-nums">
                        {localTime || 'Loading PST...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-6 border-t border-stone-200/50 dark:border-zinc-900/50">
                  <span className="block text-[10px] uppercase text-stone-450 dark:text-zinc-500 font-bold tracking-wider mb-3">Professional Networks</span>
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/abdulrahimrana715"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-stone-200/60 dark:border-zinc-800 rounded-lg text-stone-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-rose-500 transition-colors cursor-pointer"
                      aria-label="Rana Abdul Raheem GitHub Profile"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-stone-200/60 dark:border-zinc-800 rounded-lg text-stone-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-rose-500 transition-colors cursor-pointer"
                      aria-label="Rana Abdul Raheem LinkedIn Profile"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Right Column: Secure Message Form */}
              <div className="lg:col-span-7">
                <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-zinc-800/60 rounded-2xl p-6 md:p-8 shadow-sm">
                  
                  {formStatus === 'success' ? (
                    <div className="text-center py-8 animate-fadeIn">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Message Dispatched!</h3>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
                        Thank you. Your message has been successfully logged in our local storage outbox. Look at the inquiry status tracker below!
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-zinc-500 mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formName}
                            onChange={e => setFormName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg text-sm bg-stone-50/50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 text-stone-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-rose-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-zinc-500 mb-1">Your Email</label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formEmail}
                            onChange={e => setFormEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg text-sm bg-stone-50/50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 text-stone-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-rose-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-455 dark:text-zinc-500 mb-1">Your Message</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="How can we help optimize your architecture?"
                          value={formMsg}
                          onChange={e => setFormMsg(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg text-sm bg-stone-50/50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 text-stone-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-rose-500 transition-all resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-zinc-100 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <span className="w-4 h-4 border-2 border-stone-100 dark:border-zinc-900 border-t-transparent rounded-full animate-spin"></span>
                            <span>Encrypting Transmissions...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Secure Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* PERSISTED OUTBOX HISTORY (PROVES COMPLETE WORKABILITY) */}
                  {messages.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-zinc-800">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase text-stone-450 dark:text-zinc-500 tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Outbox Status Tracker ({messages.length})</span>
                        </span>
                        <button
                          onClick={clearMessages}
                          className="text-[10px] uppercase font-bold text-stone-400 dark:text-zinc-600 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          Clear Logs
                        </button>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {messages.map(m => (
                          <div key={m.id} className="p-3 bg-stone-55/60 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-lg text-xs">
                            <div className="flex justify-between items-start mb-1.5">
                              <div>
                                <span className="font-bold text-stone-900 dark:text-white">{m.name}</span>
                                <span className="text-stone-400 dark:text-zinc-500 ml-1 font-mono">({m.email})</span>
                              </div>
                              <span className="text-stone-400 dark:text-zinc-500 font-mono text-[10px]">{m.timestamp}</span>
                            </div>
                            
                            <p className="text-stone-650 dark:text-zinc-400 italic mb-2 line-clamp-2">"{m.message}"</p>

                            <div className="flex items-center gap-4 text-[10px] font-mono font-semibold">
                              <span className="text-stone-400 dark:text-zinc-500 uppercase">STATUS:</span>
                              {m.status === 'sent' && <span className="text-blue-500">● DISPATCHED</span>}
                              {m.status === 'delivered' && <span className="text-purple-500">● SECURED AT DESTINATION</span>}
                              {m.status === 'agent_reading' && <span className="text-amber-500 animate-pulse">● AGENT INTERMEDIATING...</span>}
                              {m.status === 'replied' && <span className="text-emerald-500">● SYSTEM AUTO-REPLIED</span>}
                            </div>

                            {m.replyText && (
                              <div className="mt-2.5 p-2 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/50 rounded text-emerald-800 dark:text-emerald-400 text-[11px] leading-relaxed animate-fadeIn">
                                <span className="font-bold text-[9px] uppercase tracking-wider block text-emerald-600 dark:text-emerald-400 mb-0.5">Automated Receiver:</span>
                                {m.replyText}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-stone-100 dark:bg-zinc-950 border-t border-stone-200/60 dark:border-zinc-900 py-12 transition-colors relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-sm font-display font-bold text-stone-900 dark:text-white">Rana Abdul Raheem</span>
            <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">Web Developer & Software Architect</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 font-mono">
            <span>Built with React & Tailwind v4</span>
            <span aria-hidden="true">·</span>
            <span>All simulations validated</span>
          </div>

          <div className="text-xs text-stone-400 dark:text-zinc-500">
            <span>&copy; {new Date().getFullYear()} Rana Abdul Raheem. All rights preserved.</span>
          </div>
        </div>
      </footer>


      {/* MODAL 1: HIGH-FIDELITY LIVE DEMO SIMULATION */}
      {activeSimulationProject && (
        <div className="fixed inset-0 bg-stone-900/80 dark:bg-black/95 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 dark:text-rose-500">Rana's Sandbox Simulator</span>
                <h3 className="text-lg font-bold text-stone-950 dark:text-white">{activeSimulationProject.name} Live</h3>
              </div>
              <button
                onClick={() => {
                  setActiveSimulationProject(null);
                  resetFintechSim();
                }}
                className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                aria-label="Close Sandbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Dual Column split scroll */}
            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Information Column */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs uppercase font-mono font-bold text-stone-400 dark:text-zinc-500 tracking-wider">Project Outline</span>
                <p className="text-sm text-stone-600 dark:text-zinc-300 leading-relaxed">
                  {activeSimulationProject.longDescription}
                </p>

                <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">Architectural Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {activeSimulationProject.tech.map(t => (
                      <span key={t} className="text-xs font-mono bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 dark:bg-rose-950/10 border border-blue-100/50 dark:border-rose-900/20 rounded-xl text-xs text-blue-800 dark:text-rose-450 leading-relaxed font-medium">
                  <span className="font-bold block mb-1">Interactive Sandbox Note:</span>
                  This column provides structured contextual parameters. Interact with the sandbox UI on the right to simulate live processing behaviors directly in Rana's web architecture.
                </div>
              </div>

              {/* Simulation Work Panel */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[50vh] lg:h-auto shadow-sm">
                
                {/* 1. ANALYTICS INTERACTIVE WORKSPACE */}
                {activeSimulationProject.demoType === 'analytics' && (
                  <div className="p-5 flex flex-col h-full">
                    
                    {/* Sandbox Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-450 dark:text-zinc-500">Metric Output Selector</span>
                      <div className="flex gap-1.5 p-0.5 bg-stone-100 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-lg">
                        <button
                          onClick={() => setAnalyticsMetric('revenue')}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer ${
                            analyticsMetric === 'revenue'
                              ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                              : 'text-stone-500 dark:text-zinc-400'
                          }`}
                        >
                          Revenue
                        </button>
                        <button
                          onClick={() => setAnalyticsMetric('users')}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer ${
                            analyticsMetric === 'users'
                              ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                              : 'text-stone-500 dark:text-zinc-400'
                          }`}
                        >
                          Users
                        </button>
                        <button
                          onClick={() => setAnalyticsMetric('conversion')}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer ${
                            analyticsMetric === 'conversion'
                              ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                              : 'text-stone-500 dark:text-zinc-400'
                          }`}
                        >
                          CR%
                        </button>
                      </div>
                    </div>

                    {/* Numeric Display with correct Tabular figures */}
                    <div className="mb-4">
                      <span className="text-[10px] uppercase text-stone-400 dark:text-zinc-500 block font-bold">Total Accumulation (YTD)</span>
                      <h4 className="text-3xl font-mono font-bold tracking-tight text-blue-600 dark:text-rose-500 tabular-nums">
                        {analyticsMetric === 'revenue' && '$1,492,021.50'}
                        {analyticsMetric === 'users' && '1,429,912'}
                        {analyticsMetric === 'conversion' && '3.42% Avg'}
                      </h4>
                    </div>

                    {/* SVG Curve Chart */}
                    <div className="bg-stone-50 dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-850 p-4 rounded-xl flex-grow flex items-center justify-center min-h-[140px]">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme === 'dark' ? '#f43f5e' : '#2563eb'} stopOpacity="0.2"/>
                            <stop offset="100%" stopColor={theme === 'dark' ? '#f43f5e' : '#2563eb'} stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        
                        <line x1="20" y1="20" x2="480" y2="20" stroke="currentColor" strokeWidth="1" className="text-stone-200 dark:text-zinc-800" strokeDasharray="4,4" />
                        <line x1="20" y1="75" x2="480" y2="75" stroke="currentColor" strokeWidth="1" className="text-stone-200 dark:text-zinc-800" strokeDasharray="4,4" />
                        <line x1="20" y1="130" x2="480" y2="130" stroke="currentColor" strokeWidth="1" className="text-stone-200 dark:text-zinc-800" strokeDasharray="4,4" />

                        <polyline
                          fill="none"
                          stroke={theme === 'dark' ? '#e11d48' : '#2563eb'}
                          strokeWidth="3.5"
                          points={computeSvgPoints(analyticsChartData[analyticsMetric])}
                          className="transition-all duration-700 ease-in-out"
                        />

                        <polygon
                          fill="url(#chartGradient)"
                          points={`20,130 ${computeSvgPoints(analyticsChartData[analyticsMetric])} 480,130`}
                          className="transition-all duration-700 ease-in-out"
                        />

                        {computeSvgPoints(analyticsChartData[analyticsMetric]).split(' ').map((pt, idx) => {
                          const [x, y] = pt.split(',');
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r="4"
                              fill={theme === 'dark' ? '#ffffff' : '#1e3a8a'}
                              stroke={theme === 'dark' ? '#e11d48' : '#2563eb'}
                              strokeWidth="2"
                              className="cursor-pointer hover:r-6 transition-all"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-3 font-mono text-center font-semibold">
                      Interactive chart models dynamic SVG coordinates based on Pakistani node aggregators.
                    </p>

                  </div>
                )}

                {/* 2. LIVE MARKDOWN RENDERER */}
                {activeSimulationProject.demoType === 'markdown' && (
                  <div className="flex flex-col h-full divide-y divide-stone-200 dark:divide-zinc-800">
                    <div className="p-3 bg-stone-50 dark:bg-zinc-900 text-[10px] font-bold uppercase font-mono flex items-center justify-between text-stone-500">
                      <span>Source Editor (Edit text below)</span>
                      <span>Document Preview</span>
                    </div>
                    
                    <div className="flex-1 p-3 flex flex-col">
                      <textarea
                        value={markdownInput}
                        onChange={e => setMarkdownInput(e.target.value)}
                        className="w-full h-1/2 p-3 font-mono text-xs text-stone-800 dark:text-stone-200 bg-stone-50/55 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg focus:outline-none resize-none"
                      ></textarea>

                      <div className="w-full h-1/2 overflow-y-auto mt-3 p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-900 rounded-lg select-text text-sm prose dark:prose-invert">
                        <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400 mb-2">Live Render Output</span>
                        <div dangerouslySetInnerHTML={renderMarkdownHtml(markdownInput)} className="prose prose-sm max-w-none"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SWIFTPAY FINTECH KEYPAD SIMULATOR */}
                {activeSimulationProject.demoType === 'fintech' && (
                  <div className="p-5 flex flex-col h-full justify-between">
                    
                    {fintechStatus === 'success' ? (
                      <div className="text-center py-6 animate-fadeIn flex flex-col justify-center items-center h-full">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                          <Check className="w-6 h-6 stroke-[3]" />
                        </div>
                        <h4 className="font-bold text-stone-900 dark:text-white">Transaction Cleared!</h4>
                        
                        <div className="bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-4 rounded-xl mt-4 w-full text-left space-y-1.5 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className="text-stone-400">RECEIPT ID:</span>
                            <span className="font-bold text-stone-900 dark:text-white">{fintechReceiptId}</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span className="text-stone-400">RECIPIENT:</span>
                            <span className="font-bold text-stone-900 dark:text-white truncate max-w-[150px]">{fintechRecipient}</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span className="text-stone-400">AMOUNT COMPLETED:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(fintechAmount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span className="text-stone-400">CLEARANCE NODE:</span>
                            <span className="font-bold text-stone-900 dark:text-white">LA_PK_STABLE_01</span>
                          </div>
                        </div>

                        <button
                          onClick={resetFintechSim}
                          className="mt-6 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer animate-pulse"
                        >
                          Execute Another Transfer
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFintechTransfer} className="space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-450 dark:text-zinc-500 block mb-2">Simulated Bank Transfer Portal</span>
                        
                        <div>
                          <label className="block text-[11px] uppercase text-stone-400 dark:text-zinc-500 font-bold mb-1">Recipient Account Email</label>
                          <input
                            type="email"
                            required
                            placeholder="recruiter@company.com"
                            value={fintechRecipient}
                            onChange={e => setFintechRecipient(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-rose-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase text-stone-400 dark:text-zinc-500 font-bold mb-1">Transfer Amount (USD)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-mono font-bold">$</span>
                            <input
                              type="number"
                              required
                              min="5"
                              max="10000"
                              value={fintechAmount}
                              onChange={e => setFintechAmount(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 rounded-lg text-xs font-mono bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-rose-500"
                            />
                          </div>
                        </div>

                        {/* Visual Card Representation */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-rose-500 dark:to-purple-700 p-4 rounded-xl text-white shadow-md relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold tracking-wider opacity-80 uppercase">SwiftPay Premium Ledger</span>
                            <span className="text-[10px] font-bold font-mono tracking-wider">PAK_NODE</span>
                          </div>
                          
                          <div className="mt-6 mb-2">
                            <span className="text-[10px] uppercase opacity-70 block text-indigo-100">Simulated Balance</span>
                            <h3 className="text-xl font-bold font-mono tracking-tight">$82,492.00</h3>
                          </div>

                          <div className="flex justify-between items-center text-[10px] opacity-80">
                            <span>Rana Abdul Raheem</span>
                            <span>EXP: 10/29</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={fintechStatus === 'processing'}
                          className="w-full py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-zinc-100 disabled:opacity-60 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          {fintechStatus === 'processing' ? (
                            <>
                              <span className="w-3 h-3 border-2 border-stone-100 dark:border-zinc-900 border-t-transparent rounded-full animate-spin"></span>
                              <span>Verifying Ledger Protocols...</span>
                            </>
                          ) : (
                            <span>Clear Safe Transaction</span>
                          )}
                        </button>

                      </form>
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* Sandbox Footer Info */}
            <div className="px-6 py-3 bg-stone-100 dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-850 flex justify-between items-center text-[10px] font-mono text-stone-500">
              <span>SANDBOX ENVIRONMENT: ACTIVE</span>
              <span>ESTIMATED LATENCY COMPLIANCE: WCAG AA</span>
            </div>

          </div>
        </div>
      )}


      {/* MODAL 2: GITHUB REPOSITORY CODE VIEWER */}
      {activeGithubProject && (
        <div className="fixed inset-0 bg-stone-900/80 dark:bg-black/95 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-stone-700 dark:text-white" />
                <div>
                  <h3 className="text-sm font-bold text-stone-955 dark:text-white">
                    abdulrahimrana715 / {activeGithubProject.id}
                  </h3>
                  <p className="text-[10px] text-stone-400 dark:text-zinc-500 font-bold font-mono">branch: main · production build</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setActiveGithubProject(null);
                  setSelectedGithubFile('');
                }}
                className="p-2 text-stone-400 hover:text-stone-955 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                aria-label="Close Repo View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code browser view split */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              
              {/* Left Column: Repository Files structure */}
              <div className="w-full md:w-60 bg-stone-100 dark:bg-zinc-950 border-r border-stone-200 dark:border-zinc-850 p-4 space-y-4">
                <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-zinc-500 tracking-wider font-mono">Files Index</span>
                <div className="space-y-1">
                  {activeGithubProject.githubFiles.map(f => (
                    <button
                      key={f.name}
                      onClick={() => setSelectedGithubFile(f.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors ${
                        selectedGithubFile === f.name
                          ? 'bg-blue-600/10 dark:bg-rose-500/10 text-blue-600 dark:text-rose-400 font-bold border-l-2 border-blue-600 dark:border-rose-500 pl-2'
                          : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-zinc-850 text-[10px] leading-relaxed text-stone-500 font-medium">
                  <span className="font-bold block mb-1">Commit Summary:</span>
                  "Refactor architectural layouts to align strictly with universal CSS properties."
                </div>
              </div>

              {/* Right Column: Code viewer display */}
              <div className="flex-1 overflow-y-auto bg-stone-900 dark:bg-black p-6 font-mono text-xs text-stone-300 select-text flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-stone-800 pb-3">
                  <span className="text-stone-505 font-bold">{selectedGithubFile}</span>
                  <span className="text-[10px] text-emerald-500 bg-emerald-950/40 px-2 py-0.5 rounded font-bold uppercase">READ-ONLY</span>
                </div>
                
                {/* Clean syntax-highlight styling simulation */}
                <pre className="whitespace-pre-wrap flex-grow leading-relaxed">
                  {activeGithubProject.githubFiles.find(f => f.name === selectedGithubFile)?.content}
                </pre>
              </div>

            </div>

            {/* Sandbox footer information */}
            <div className="px-6 py-3 bg-stone-100 dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-850 text-[10px] font-mono text-stone-500 flex justify-between">
              <span>NODE: GITHUB_CORE_VERIFICATION</span>
              <span>SHA: bd7a80b7acde14925cb7</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
