import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import profilePic from '../Assets/ren techy2 copy.png';
import logoImg   from '../Assets/logo.png';
import {
  siN8n, siZapier, siMake, siAirtable, siNotion,
  siAnthropic, siZoho, siMeta,
  siJira, siAsana, siWhatsapp, siWordpress, siZoom,
  siGithub, siXero, siSupabase, siGoogle, siElevenlabs, siCursor
} from 'simple-icons';
import {
  Zap, FileText, Repeat, Database, BarChart2,
  ChevronRight, ChevronLeft, Search, Layers, CheckCircle,
  Mail, Linkedin, ArrowRight, ExternalLink,
  Sun, Moon,
  CalendarDays, Clock, Timer, Gift, Check, Video
} from 'lucide-react';

// --- DATA DEFINITIONS ---

const WORKFLOWS = [
  {
    icon: 'zap',
    title: 'Speed to Lead',
    problem: 'A lead fills your form. You respond 6 hours later. They\'ve already hired someone else.',
    solution: 'Automated response within 60 seconds — qualified, routed, and followed up without anyone lifting a finger.'
  },
  {
    icon: 'file-text',
    title: 'Document Processing',
    problem: 'Someone spends their entire day copying data from PDFs into spreadsheets.',
    solution: 'AI reads the document, extracts what matters, validates it, and pushes it where it needs to go — automatically.'
  },
  {
    icon: 'repeat',
    title: 'Follow-Up Sequences',
    problem: 'You followed up once. They didn\'t reply. You moved on. They bought from your competitor a week later.',
    solution: 'Behavior-triggered sequences that send the right message at the right time and stop the moment they respond.'
  },
  {
    icon: 'database',
    title: 'Database Reactivation',
    problem: 'Thousands of contacts in your CRM haven\'t heard from you in months.',
    solution: 'Personalized campaigns referencing each contact\'s history that restart conversations at scale.'
  },
  {
    icon: 'bar-chart-2',
    title: 'Internal Reporting',
    problem: 'Your manager spends Monday mornings pulling numbers from four tools just to write one report.',
    solution: 'Automated summaries delivered to email or Slack before anyone opens their laptop.'
  }
];

const CASE_STUDIES = [
  {
    category: 'CRM & Operations',
    industry: 'Creative Studio · Coaching',
    client: 'Bee Fearless Studios',
    website: 'https://www.beefearlessstudios.com/',
    problem: 'Bee Fearless Studios was scaling fast but drowning in manual work — 3+ hours daily across eight disconnected tools, with no reliable way to track client communication, content tasks, or data.',
    bullets: [
      'Built 15+ workflows in n8n and Zapier connecting CRM, ClickUp, and Google Workspace',
      'Integrated Meta Business Suite API — eliminated all manual data entry',
      'AI-powered content workflows using ChatGPT and Claude APIs',
      'Real-time sync across Google Sheets, Notion, and Airtable',
      'Full Notion documentation so the non-technical team could maintain independently'
    ],
    results: [
      { value: '60%', label: 'Manual tasks reduced' },
      { value: '20 hrs', label: 'Saved weekly' },
      { value: '30 min', label: 'Daily comms (was 3 hrs)' }
    ],
    tools: ['n8n', 'Zapier', 'ClickUp', 'Google Workspace', 'Meta API', 'ChatGPT API', 'Claude API', 'Notion', 'Airtable'],
    diagram: {
      title: 'Client Intake & Content Automation',
      groups: [
        { label: 'TRIGGER', nodes: [{ id: 'n1', label: 'Inbox', desc: 'New inquiry received' }] },
        { label: 'ROUTE', nodes: [{ id: 'n2', label: 'Qualify', desc: 'Check inquiry type' }, { id: 'n3', label: 'ClickUp', desc: 'Create & assign task' }] },
        { label: 'AUTOMATE', nodes: [{ id: 'n4', label: 'Email', desc: 'Send welcome sequence' }, { id: 'n5', label: 'Claude API', desc: 'Generate content draft' }] },
        { label: 'LOG', nodes: [{ id: 'n6', label: 'Sheets', desc: 'Sync to Airtable' }, { id: 'n7', label: 'Slack', desc: 'Notify manager' }] }
      ],
      edges: [['n1','n2'],['n2','n3'],['n3','n4'],['n4','n5'],['n5','n6'],['n6','n7']]
    }
  },
  {
    category: 'Lead Generation',
    industry: 'Home Services · Roofing',
    client: 'Elevated Roofing & Restoration',
    website: 'https://elevatedroofing.com',
    problem: '80–100 leads per month from Google Ads. Response time: 6+ hours. By then, the lead had already called three other roofers. They were paying for leads they were throwing away.',
    bullets: [
      'Speed to Lead workflow triggered instantly on form submission via webhook',
      'Automated SMS and email to prospect within 60 seconds of inquiry',
      'Qualification layer tagging leads by service type and routing to the right salesperson',
      'Task created in ClickUp with full lead context and contact details',
      '3-touchpoint follow-up sequence for non-responders over 7 days'
    ],
    results: [
      { value: '60 sec', label: 'Response time (was 6 hrs)' },
      { value: '27%', label: 'Lead-to-appt rate (was 11%)' },
      { value: '$18K+', label: 'Est. monthly recovered revenue' }
    ],
    tools: ['n8n', 'Zoho CRM', 'ClickUp', 'Twilio SMS', 'Google Workspace', 'Webhooks'],
    diagram: {
      title: 'Speed to Lead Automation',
      groups: [
        { label: 'CAPTURE', nodes: [{ id: 'n1', label: 'Form Submit', desc: 'Webhook fires instantly' }] },
        { label: 'QUALIFY', nodes: [{ id: 'n2', label: 'Filter', desc: 'Tag by service & location' }] },
        { label: 'RESPOND', nodes: [{ id: 'n3', label: 'SMS', desc: '60-sec text to lead' }, { id: 'n4', label: 'Email', desc: 'Confirmation sent' }] },
        { label: 'ROUTE', nodes: [{ id: 'n5', label: 'ClickUp', desc: 'Task + assign salesperson' }] },
        { label: 'NURTURE', nodes: [{ id: 'n6', label: 'Sequence', desc: '3-step follow-up' }, { id: 'n7', label: 'CRM', desc: 'Log all interactions' }] }
      ],
      edges: [['n1','n2'],['n2','n3'],['n2','n4'],['n3','n5'],['n4','n5'],['n5','n6'],['n6','n7']]
    }
  },
  {
    category: 'AI Automation',
    industry: 'Accounting & Finance',
    client: 'Brightpath Accounting Solutions',
    website: 'https://brightpathaccounting.com',
    problem: '150–200 invoices per week processed entirely by hand. 15 minutes each. One full-time employee doing nothing but copy-paste data entry. A $65,000-per-year bottleneck with a 12% error rate built in.',
    bullets: [
      'Processing pipeline triggered by new emails in shared Gmail inbox',
      'Claude API extracts vendor, invoice number, date, amount, line items, payment terms',
      'Rule-based validation cross-checks against chart of accounts and flags mismatches',
      'Clean data pushed to accounting software via REST API',
      'PDFs archived to Google Drive with automatic naming convention',
      'Google Sheets dashboard tracking daily volume, error rates, and flagged items'
    ],
    results: [
      { value: '2 min', label: 'Per invoice (was 15 min)' },
      { value: '<1%', label: 'Error rate (was 12%)' },
      { value: '$60K+', label: 'Annual labor savings' }
    ],
    tools: ['Make.com', 'Claude API', 'Gmail', 'Google Drive', 'Google Sheets', 'REST API'],
    diagram: {
      title: 'Invoice Processing Pipeline',
      groups: [
        { label: 'INGEST', nodes: [{ id: 'n1', label: 'Gmail', desc: 'Invoice lands in inbox' }] },
        { label: 'EXTRACT', nodes: [{ id: 'n2', label: 'Claude API', desc: 'Read & extract all fields' }] },
        { label: 'VALIDATE', nodes: [{ id: 'n3', label: 'Rules', desc: 'Check chart of accounts' }, { id: 'n4', label: 'Flag', desc: 'Route mismatch to review' }] },
        { label: 'OUTPUT', nodes: [{ id: 'n5', label: 'API Push', desc: 'Send to accounting software' }, { id: 'n6', label: 'Drive', desc: 'Archive PDF auto-named' }] },
        { label: 'REPORT', nodes: [{ id: 'n7', label: 'Sheets', desc: 'Update error dashboard' }] }
      ],
      edges: [['n1','n2'],['n2','n3'],['n3','n4'],['n4','n5'],['n5','n6'],['n6','n7']]
    }
  },
  {
    category: 'Lead Generation',
    industry: 'Business Coaching · Online Education',
    client: 'Momentum Coaching Group',
    website: 'https://www.momentum-coaching.co.uk/',
    problem: 'Monthly webinars, 150 registrants, one generic follow-up email. No-shows got nothing. Conversion from webinar to discovery call was 4% — most of the audience went completely cold.',
    bullets: [
      'Post-webinar automation triggered by webinar platform completion event',
      'Two separate sequences for attendees and no-shows with different messaging',
      'CRM integration personalizing every message with each contact\'s history',
      '5-touchpoint sequence over 14 days mixing email and SMS',
      'Auto-stop triggers the moment a lead books a call or replies',
      'Slack alerts to sales team with full conversation context on engagement'
    ],
    results: [
      { value: '13%', label: 'Conversion rate (was 4%)' },
      { value: '22', label: 'Booked calls per webinar (was 6)' },
      { value: '$80K+', label: 'Revenue per webinar (was $24K)' }
    ],
    tools: ['n8n', 'Zoho CRM', 'ActiveCampaign', 'Twilio SMS', 'Slack', 'Webhooks'],
    diagram: {
      title: 'Post-Webinar Nurture Sequence',
      groups: [
        { label: 'TRIGGER', nodes: [{ id: 'n1', label: 'Webinar End', desc: 'Completion event fires' }] },
        { label: 'SEGMENT', nodes: [{ id: 'n2', label: 'Branch', desc: 'Attendee or no-show?' }] },
        { label: 'NURTURE', nodes: [{ id: 'n3', label: 'Seq A', desc: 'Attendee: email + SMS' }, { id: 'n4', label: 'Seq B', desc: 'No-show: replay + re-engage' }] },
        { label: 'CONVERT', nodes: [{ id: 'n5', label: 'Stop Check', desc: 'Replied or booked?' }, { id: 'n6', label: 'CRM', desc: 'Tag + update pipeline' }] },
        { label: 'NOTIFY', nodes: [{ id: 'n7', label: 'Slack', desc: 'Alert sales with context' }] }
      ],
      edges: [['n1','n2'],['n2','n3'],['n2','n4'],['n3','n5'],['n4','n5'],['n5','n6'],['n6','n7']]
    }
  },
  {
    category: 'CRM & Operations',
    industry: 'Real Estate · Property Management',
    client: 'Harborview Property Management',
    website: 'https://www.hvp.com/',
    problem: '200+ rental units, four tools, and one ops manager spending every Monday morning manually pulling data just to write a report the owner reads in five minutes.',
    bullets: [
      'Automated reporting workflow running every Monday at 7 AM via scheduler',
      'Connected property management software, ClickUp, and Google Sheets via API',
      'Aggregated open maintenance tickets, rent collection status, and team workload',
      'Formatted weekly summary emailed to owner, condensed version posted to Slack',
      'Real-time alerts for 48-hour stale tickets and 5-day overdue rent — auto-ping responsible member'
    ],
    results: [
      { value: '4 hrs', label: 'Reporting time eliminated weekly' },
      { value: '65%', label: 'Faster issue response' },
      { value: '0', label: 'Status meetings needed' }
    ],
    tools: ['n8n', 'ClickUp', 'Google Sheets', 'Slack', 'Gmail', 'REST API', 'Webhooks'],
    diagram: {
      title: 'Weekly Ops Reporting Automation',
      groups: [
        { label: 'TRIGGER', nodes: [{ id: 'n1', label: 'Scheduler', desc: 'Every Monday 7 AM' }] },
        { label: 'COLLECT', nodes: [{ id: 'n2', label: 'API Pull', desc: 'ClickUp + Sheets + PM' }] },
        { label: 'ANALYZE', nodes: [{ id: 'n3', label: 'Aggregate', desc: 'Tickets, rent, workload' }] },
        { label: 'ALERT', nodes: [{ id: 'n4', label: 'Check', desc: 'Overdue? Ping member' }, { id: 'n5', label: 'Alert', desc: 'Auto-notify responsible' }] },
        { label: 'DELIVER', nodes: [{ id: 'n6', label: 'Email', desc: 'Report to owner' }, { id: 'n7', label: 'Slack', desc: 'Condensed team post' }] }
      ],
      edges: [['n1','n2'],['n2','n3'],['n3','n4'],['n4','n5'],['n3','n6'],['n3','n7']]
    }
  }
];

const TESTIMONIALS = [
  {
    quote: 'Renthel mapped our entire intake process in the first call and had automation running within a week. We went from three hours of admin daily to twenty minutes. I genuinely cannot imagine going back.',
    name: 'Bee T.',
    role: 'Studio Director, Bee Fearless Studios'
  },
  {
    quote: 'We were losing leads every week without knowing it. The speed-to-lead system paid for itself in the first two jobs we closed. ROI was immediate and obvious.',
    name: 'James T.',
    role: 'Owner, Elevated Roofing & Restoration'
  },
  {
    quote: 'I used to dread Monday mornings. Now the report is in my inbox before I open my laptop. The whole team relies on it.',
    name: 'Diana R.',
    role: 'Operations Manager, Harborview Property Management'
  }
];

const STEPS = [
  {
    number: '01',
    title: 'Discovery Call',
    description: 'We map your current process together. I ask the right questions. You know exactly what we are building before I write a single line of logic.',
    icon: 'search'
  },
  {
    number: '02',
    title: 'Build & Test',
    description: 'I build with your real data, stress-test for edge cases, and QA internally. You see a working system — not a prototype.',
    icon: 'layers'
  },
  {
    number: '03',
    title: 'Handover & Support',
    description: 'Loom walkthrough, Notion docs, two weeks post-launch support. Your team runs it. You own it.',
    icon: 'check-circle'
  }
];

const TECH_STACK = [
  { name: 'n8n',              color: '#FF6D5A' },
  { name: 'Zapier',           color: '#FF4F00' },
  { name: 'Make.com',         color: '#8B5CF6' },
  { name: 'Airtable',         color: '#18BFFF' },
  { name: 'Notion',           color: '#000000' },
  { name: 'Jira',             color: '#0052CC' },
  { name: 'Asana',            color: '#F06A6A' },
  { name: 'OpenAI',           color: '#10A37F' },
  { name: 'Claude',           color: '#D97757' },
  { name: 'Claude Code',      color: '#D97757' },
  { name: 'Vapi',             color: '#6366F1' },
  { name: 'ElevenLabs',       color: '#000000' },
  { name: 'Zoho CRM',         color: '#E01E26' },
  { name: 'GoHighLevel',      color: '#7B68EE' },
  { name: 'Apollo.io',        color: '#E8531A' },
  { name: 'Slack',            color: '#4A154B' },
  { name: 'WhatsApp',         color: '#25D366' },
  { name: 'Twilio',           color: '#F22F46' },
  { name: 'Zoom',             color: '#2D8CFF' },
  { name: 'Google Workspace', color: '#4285F4' },
  { name: 'Meta API',         color: '#0668E1' },
  { name: 'GitHub',           color: '#181717' },
  { name: 'Cursor',           color: '#000000' },
  { name: 'Supabase',         color: '#3ECF8E' },
  { name: 'WordPress',        color: '#21759B' },
  { name: 'Ahrefs',           color: '#FF8C00' },
  { name: 'Xero',             color: '#13B5EA' },
  { name: 'REST APIs',        color: '#A1A1AA' },
];

const CLIENT_LOGOS = [
  'Bee Fearless Studios', 'Elevated Roofing', 'Harborview Property', 
  'TechFlow Solutions', 'Nexus Creative', 'Peak Performance',
  'Global Logistics', 'Modern Real Estate', 'Vanguard Legal'
];

const FAQ_DATA = [
  {
    question: "Will automation replace my employees?",
    answer: "No. Automation is designed to handle the repetitive, 'robotic' tasks that humans find draining. By automating data entry and routine follow-ups, your team is freed up to focus on high-level strategy, creative work, and building real relationships with clients."
  },
  {
    question: "How long does a typical setup take?",
    answer: "A standard automation project usually takes between 2 to 4 weeks from discovery to handover. This includes mapping your process, building the logic, stress-testing with real data, and creating documentation for your team."
  },
  {
    question: "What tools do you work with?",
    answer: "I work with a wide range of modern business tools including n8n, Zapier, Make.com, Zoho CRM, ClickUp, Airtable, Notion, and various AI APIs (ChatGPT, Claude). If your tool has an API or can send a webhook, I can likely connect it."
  },
  {
    question: "Do I need to be tech-savvy to maintain it?",
    answer: "Not at all. I provide full Notion documentation and Loom walkthroughs for every system I build. My goal is to hand over a 'black box' that just works, but also give you the knowledge to understand the high-level logic."
  }
];

// --- HOOKS ---

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-init');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.children).filter(
                  el => el.classList.contains('fade-init')
                )
              : [];
            const index = siblings.indexOf(entry.target as Element);
            (entry.target as HTMLElement).style.transitionDelay = `${index * 80}ms`;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// --- COMPONENTS ---

function CountUp({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={elRef}>{count}{suffix}</span>;
}

function CursorGlow({ theme }: { theme: string }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top  = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const bg = theme === 'light'
    ? 'radial-gradient(circle, rgba(62,198,138,0.13) 0%, transparent 70%)'
    : 'radial-gradient(circle, rgba(210,210,210,0.07) 0%, transparent 70%)';

  return (
    <div ref={glowRef} style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 0,
      left: -600, top: -600,
      transform: 'translate(-50%, -50%)',
      width: 280, height: 280,
      borderRadius: '50%',
      background: bg,
      transition: 'left 0.14s ease-out, top 0.14s ease-out',
    }} />
  );
}

function Navbar({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--nav-height)', zIndex: 100,
      background: theme === 'dark' ? 'rgba(8, 9, 12, 0.9)' : 'rgba(249, 250, 251, 0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      transition: 'var(--transition)'
    }}>
      <div style={{
        width: '100%', maxWidth: 'var(--max-width)',
        margin: '0 auto', padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={logoImg}
            alt="Renthel Cueto logo"
            style={{
              height: 28, width: 'auto',
              filter: theme === 'dark' ? 'invert(1)' : 'none',
              transition: 'filter 0.3s ease'
            }}
          />
          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
            Renthel Cueto
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="nav-links">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { id: 'about', label: 'About' },
              { id: 'work', label: 'Work' },
              { id: 'roi', label: 'ROI' },
              { id: 'process', label: 'Process' },
              { id: 'faq', label: 'FAQ' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontWeight: 400, fontSize: 14,
                color: 'var(--text-secondary)', padding: 0,
                transition: 'color 150ms ease'
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '6px',
                borderRadius: 'var(--radius-badge)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LogoMarquee() {
  return (
    <div style={{ 
      width: '100%', overflow: 'hidden', background: 'var(--surface)', 
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      padding: '32px 0'
    }}>
      <div className="marquee-track" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
        {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
          <span key={i} style={{ 
            fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, 
            background: 'linear-gradient(135deg, #f6f7f8 0%, #bdbfc1 50%, #f6f7f8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.02em',
            opacity: 0.8
          }}>
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

const EXTRA_PATHS: Record<string, string> = {
  'OpenAI': 'M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.4 14.115a4.5 4.5 0 0 1-2.06-6.22zm16.597 3.855-5.815-3.354 2.02-1.168a.076.076 0 0 1 .071 0l4.418 2.549a4.5 4.5 0 0 1-.676 8.123v-5.676a.79.79 0 0 0-.018-.474zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.419-2.548a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z',
  'Slack':  'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z',
  'Twilio': 'M11.993 0C5.366 0 0 5.366 0 12s5.366 12 12 12 12-5.366 12-12S18.627 0 11.993 0zM12 19.23c-3.987 0-7.23-3.243-7.23-7.23 0-3.987 3.243-7.23 7.23-7.23 3.987 0 7.23 3.243 7.23 7.23 0 3.987-3.243 7.23-7.23 7.23zm4.632-9.12a1.548 1.548 0 1 1-3.096 0 1.548 1.548 0 0 1 3.096 0zm-3.18 4.824a1.548 1.548 0 1 1-3.096 0 1.548 1.548 0 0 1 3.096 0zm-4.08-4.824a1.548 1.548 0 1 1 3.096 0 1.548 1.548 0 0 1-3.096 0zm3.18 4.824a1.548 1.548 0 1 1 3.096 0 1.548 1.548 0 0 1-3.096 0z',
  'REST APIs': 'M7.5 4.5L1 12l6.5 7.5h2.25L3.25 12 9.75 4.5zm9 0L23 12l-6.5 7.5h-2.25L20.75 12 14.25 4.5zM13.5 3l-3 18h2l3-18z',
  // GoHighLevel — lightning bolt (CRM/marketing platform)
  'GoHighLevel': 'M13 2L3.5 14h7L7 22 20.5 10h-7.5z',
  // Apollo.io — concentric circles (sales intelligence / targeting)
  'Apollo.io': 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 1 1 0 16A8 8 0 0 1 12 4zm0 3a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  // Vapi — microphone (voice AI platform)
  'Vapi': 'M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zm-7 9h2a7 7 0 0 0 14 0h2a9 9 0 0 1-8 8.945V23h3v2H8v-2h3v-2.055A9 9 0 0 1 3 12h2z',
  // Ahrefs — ascending bars (SEO analytics)
  'Ahrefs': 'M4 16h3v4H4v-4zm4.5-5H12v9H8.5v-9zm4.5 2h3.5v7H13v-7zm4.5-7H21v14h-3.5V6zM4 10h3v4H4v-4zm-.5-6H7v4H3.5V4z',
};

const SI_MAP: Record<string, { path: string }> = {
  'n8n':              siN8n,
  'Zapier':           siZapier,
  'Make.com':         siMake,
  'Airtable':         siAirtable,
  'Notion':           siNotion,
  'Claude':           siAnthropic,
  'Claude Code':      siAnthropic,
  'Zoho CRM':         siZoho,
  'Meta API':         siMeta,
  'Jira':             siJira,
  'Asana':            siAsana,
  'WhatsApp':         siWhatsapp,
  'WordPress':        siWordpress,
  'Zoom':             siZoom,
  'GitHub':           siGithub,
  'Xero':             siXero,
  'Supabase':         siSupabase,
  'Google Workspace': siGoogle,
  'ElevenLabs':       siElevenlabs,
  'Cursor':           siCursor,
};

function TechIcon({ name, size = 24, isDark = true }: { name: string; size?: number; isDark?: boolean }) {
  const path = SI_MAP[name]?.path ?? EXTRA_PATHS[name] ?? '';
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
      fill={isDark ? 'url(#chrome-fill)' : 'url(#chrome-fill-light)'}>
      <path d={path} />
    </svg>
  );
}

function TechStack({ theme }: { theme: string }) {
  const isDark = theme === 'dark';
  const rows = useMemo(() => {
    const all = TECH_STACK;
    const rev = [...TECH_STACK].reverse();
    return [all, rev].map(r => [...r, ...r]);
  }, []);

  const rowClasses = ['tech-row-1', 'tech-row-2'];

  return (
    <section id="stack" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>The Tech Stack</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em', marginBottom: 20
          }}>
            Tools I master to build your systems
          </h2>
          <p style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            I don't just use these tools — I push them to their limits to create reliable,
            scalable infrastructure for your business.
          </p>
        </div>
      </div>

      {/* Shared gradient defs — chrome for dark, dark-slate for light */}
      <svg aria-hidden width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="chrome-fill" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#e8e8e8" />
            <stop offset="25%"  stopColor="#b4b4b4" />
            <stop offset="50%"  stopColor="#f5f5f5" />
            <stop offset="75%"  stopColor="#9a9a9a" />
            <stop offset="100%" stopColor="#d0d0d0" />
          </linearGradient>
          <linearGradient id="chrome-fill-light" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#2a2a2a" />
            <stop offset="25%"  stopColor="#404040" />
            <stop offset="50%"  stopColor="#1a1a1a" />
            <stop offset="75%"  stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3 rows with fade masks */}
      <div style={{
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage:        'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0',
      }}>
        {rows.map((row, ri) => (
          <div key={ri} className={rowClasses[ri]} style={{
            display: 'inline-flex', alignItems: 'center',
            gap: 16, whiteSpace: 'nowrap',
          }}>
            {row.map((tech: typeof TECH_STACK[0], i: number) => (
              <div key={`${ri}-${i}`} className="tech-card" style={{
                display: 'inline-flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10,
                width: 100, height: 100,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
                <TechIcon name={tech.name} size={34} isDark={isDark} />
                <span style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
                  color: isDark ? '#c8c8c8' : '#1a1a1a',
                  letterSpacing: '-0.01em',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  maxWidth: 80,
                  whiteSpace: 'normal',
                }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
function Hero() {
  return (
    <section style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px'
    }}>
      <div className="hero-content" style={{
        textAlign: 'center', maxWidth: 680, margin: '0 auto', width: '100%'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '6px 14px', borderRadius: 100,
          fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)'
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--success)', flexShrink: 0
          }} />
          Available for new projects
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(40px, 6vw, 64px)',
          lineHeight: 1.05, letterSpacing: '-0.04em',
          fontWeight: 600, color: 'var(--text-primary)',
          marginTop: 28
        }}>
          Your business is<br />
          <span className="accent-gradient">leaking time.</span>
        </h1>

        <p style={{
          fontFamily: 'Inter', fontWeight: 400, fontSize: 18,
          lineHeight: 1.7, color: 'var(--text-secondary)',
          maxWidth: 460, margin: '20px auto 0'
        }}>
          I find exactly where — then<br />
          build the automation that stops it.
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 12, marginTop: 36
        }}>
          <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'var(--gradient)', color: '#fff', border: 'none',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 15,
              padding: '13px 28px', borderRadius: 'var(--radius-btn)',
              cursor: 'pointer', transition: 'opacity 150ms'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            See My Work
          </button>
          <button onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'Inter', fontWeight: 400, fontSize: 15,
              padding: '13px 28px', borderRadius: 'var(--radius-btn)',
              cursor: 'pointer', transition: 'border-color 150ms, color 150ms'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
          >
            Book a Call
          </button>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', alignItems: 'center',
          marginTop: 64, gap: 0
        }} className="stats-row">
          {[
            { end: 60, suffix: '%',    label: 'Less Manual Work' },
            { end: 20, suffix: ' hrs', label: 'Recovered Weekly' },
            { end: 40, suffix: '+',    label: 'Workflows Shipped' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div className="stat-divider" style={{
                  width: 1, height: 40,
                  background: 'var(--border)',
                  margin: '0 32px', flexShrink: 0
                }} />
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 42, lineHeight: 1,
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-secondary)', marginTop: 8
                }}>{stat.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding: 'var(--section-padding) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 80, alignItems: 'center' }} className="about-grid">

          {/* Photo column */}
          <div className="fade-init" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 340 }}>
              {/* Glow ring behind the card */}
              <div style={{
                position: 'absolute', inset: -2,
                borderRadius: 24,
                background: 'linear-gradient(135deg, var(--accent) 0%, transparent 70%)',
                opacity: 0.08,
                filter: 'blur(10px)',
                zIndex: 0
              }} />
              <img
                src={profilePic}
                alt="Renthel Cueto"
                style={{
                  width: '100%',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1
                }}
              />
              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 100, padding: '8px 18px',
                fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap', zIndex: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                Based in Philippines · Working Globally
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="fade-init" style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>

            {/* Header */}
            <div>
              <span style={{
                fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: 14
              }}>About Me</span>

              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 3vw, 42px)',
                lineHeight: 1.15, color: 'var(--text-primary)', fontWeight: 600,
                letterSpacing: '-0.03em', marginBottom: 6
              }}>
                Hi, I'm Renthel —<br />
                <span className="accent-gradient">AI Automation Specialist</span>
              </h2>

              {/* Subtitle roles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                {['Automation Engineer', 'Workflow Specialist', 'AI Integration Engineer'].map((role, i) => (
                  <span key={role} style={{
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                    color: 'var(--text-tertiary)', padding: '4px 12px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 100
                  }}>{role}</span>
                ))}
              </div>

              <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 16 }}>
                I build systems that remove repetitive work and connect your tools so your business runs faster with less effort.
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                In 2 years, I've delivered 40+ automations — cutting hours of daily admin, reducing errors, and speeding up workflows for studios, service businesses, and SaaS teams.
              </p>
            </div>

            {/* Focus block */}
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: 24,
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
              <span style={{
                fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)'
              }}>Focus</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['n8n', 'Zapier', 'Make.com', 'AI Integrations', 'CRM', 'Workflows'].map(chip => (
                  <span key={chip} style={{
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                    color: 'var(--text-secondary)', padding: '6px 14px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 100
                  }}>{chip}</span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

function Workflows() {
  const [active, setActive] = useState(0);
  const total = WORKFLOWS.length;

  const getIcon = (name: string) => {
    switch (name) {
      case 'zap':        return <Zap size={22} color="var(--accent)" />;
      case 'file-text':  return <FileText size={22} color="var(--accent)" />;
      case 'repeat':     return <Repeat size={22} color="var(--accent)" />;
      case 'database':   return <Database size={22} color="var(--accent)" />;
      case 'bar-chart-2':return <BarChart2 size={22} color="var(--accent)" />;
      default:           return <Zap size={22} color="var(--accent)" />;
    }
  };

  const getPos = (i: number) => {
    let pos = (i - active + total) % total;
    if (pos > Math.floor(total / 2)) pos -= total;
    return pos; // −2 … +2 for 5 cards
  };

  const goNext = () => setActive(n => (n + 1) % total);
  const goPrev = () => setActive(n => (n - 1 + total) % total);

  return (
    <section id="work" style={{ padding: 'var(--section-padding) 0', overflow: 'hidden' }}>
      {/* Section header */}
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>What I Build</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Five Proven Automations for Real Operations
          </h2>
        </div>
      </div>

      {/* Coverflow stage */}
      <div className="coverflow-stage" style={{
        position: 'relative',
        height: 460,
        perspective: '1100px',
        perspectiveOrigin: '50% 50%',
      }}>
        {WORKFLOWS.map((w, i) => {
          const pos = getPos(i);
          const isCenter = pos === 0;
          const isLeft1  = pos === -1;
          const isRight1 = pos === 1;
          const isLeft2  = pos === -2;
          const isRight2 = pos === 2;
          const isVisible = Math.abs(pos) <= 2;

          let transform = '';
          if (isCenter)      transform = 'translateX(0px)    scale(1)    rotateY(0deg)';
          else if (isLeft1)  transform = 'translateX(-340px)  scale(0.8)  rotateY(22deg)';
          else if (isRight1) transform = 'translateX(340px)   scale(0.8)  rotateY(-22deg)';
          else if (isLeft2)  transform = 'translateX(-590px)  scale(0.62) rotateY(32deg)';
          else if (isRight2) transform = 'translateX(590px)   scale(0.62) rotateY(-32deg)';
          else if (pos < 0)  transform = 'translateX(-820px)  scale(0.5)  rotateY(35deg)';
          else               transform = 'translateX(820px)   scale(0.5)  rotateY(-35deg)';

          const opacity = isCenter ? 1 : (isLeft1 || isRight1) ? 0.65 : (isLeft2 || isRight2) ? 0.35 : 0;
          const zIndex  = isCenter ? 4 : (isLeft1 || isRight1) ? 3 : (isLeft2 || isRight2) ? 2 : 0;

          return (
            <div
              key={i}
              className="silver-glow"
              onClick={isLeft1 ? goPrev : isRight1 ? goNext : undefined}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 400, height: 400,
                marginLeft: -200, marginTop: -200,
                boxSizing: 'border-box',
                background: 'var(--surface)',
                border: `1px solid ${isCenter ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 20,
                padding: 32,
                display: 'flex', flexDirection: 'column', gap: 14,
                transform,
                opacity,
                zIndex,
                cursor: (isLeft1 || isRight1) ? 'pointer' : 'default',
                pointerEvents: (isLeft1 || isRight1) ? 'auto' : isCenter ? 'auto' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isCenter
                  ? '0 8px 24px rgba(0,0,0,0.18)'
                  : '0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--accent-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getIcon(w.icon)}
              </div>

              <h3 style={{
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20,
                color: 'var(--text-primary)', lineHeight: 1.2, margin: 0,
              }}>
                {w.title}
              </h3>

              <p style={{
                fontFamily: 'Inter', fontStyle: 'italic', fontSize: 13,
                color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0,
              }}>
                {w.problem}
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2px 0' }} />

              <p style={{
                fontFamily: 'Inter', fontSize: 14, lineHeight: 1.65,
                color: 'var(--text-secondary)', margin: 0,
              }}>
                {w.solution}
              </p>
            </div>
          );
        })}
      </div>

      {/* Navigation: prev arrow · dots · next arrow */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 12, marginTop: 28,
      }}>
        <button
          onClick={goPrev}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          <ChevronLeft size={18} />
        </button>

        {WORKFLOWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8, height: 8,
              borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
              background: i === active ? 'var(--accent)' : 'var(--border)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}

        <button
          onClick={goNext}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Background({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = Math.min(Math.floor(width / 20), 100);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const scrollY = scrollRef.current;

      const particleColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      const connectionColor = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';

      particles.forEach((p, i) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // React to scroll (parallax effect)
        const adjustedY = (p.y - scrollY * 0.2) % height;
        const finalY = adjustedY < 0 ? adjustedY + height : adjustedY;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, finalY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect to mouse
        const dx = mouseX - p.x;
        const dy = mouseY - finalY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, finalY);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(${connectionColor}, ${0.05 * (1 - dist / 150)})`;
          ctx.stroke();
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2Y = (p2.y - scrollY * 0.2) % height;
          const finalP2Y = p2Y < 0 ? p2Y + height : p2Y;

          const dx2 = p.x - p2.x;
          const dy2 = finalY - finalP2Y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, finalY);
            ctx.lineTo(p2.x, finalP2Y);
            ctx.strokeStyle = `rgba(${connectionColor}, ${0.03 * (1 - dist2 / 100)})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
}

function WorkflowDiagram({ diagram, theme }: { diagram: any, theme: string }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const isDark = theme === 'dark';
  const NODE_W = 120;
  const NODE_H = 60;
  const GROUP_GAP = 40;
  const NODE_GAP = 16;
  const TOP_OFFSET = 50;
  const SIDE_PADDING = 30;

  const nodePositions: any = {};
  let x = SIDE_PADDING;

  diagram.groups.forEach((group: any) => {
    const groupWidth = group.nodes.length * NODE_W + (group.nodes.length - 1) * NODE_GAP;
    const groupX = x;
    group.nodes.forEach((node: any, ni: number) => {
      nodePositions[node.id] = {
        id: node.id,
        x: groupX + ni * (NODE_W + NODE_GAP),
        y: TOP_OFFSET,
        cx: groupX + ni * (NODE_W + NODE_GAP) + NODE_W / 2,
        cy: TOP_OFFSET + NODE_H / 2,
        label: node.label,
        desc: node.desc,
        groupLabel: group.label,
        groupX,
        groupWidth
      };
    });
    x += groupWidth + GROUP_GAP;
  });

  const totalWidth = x - GROUP_GAP + SIDE_PADDING;
  const viewBoxHeight = TOP_OFFSET + NODE_H + 50;

  const edges = diagram.edges.map(([from, to]: [string, string], i: number) => {
    const a = nodePositions[from];
    const b = nodePositions[to];
    if (!a || !b) return null;
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return (
      <path
        key={i}
        d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
        stroke={isDark ? '#A1A1AA' : '#9CA3AF'}
        strokeWidth="2"
        strokeOpacity="0.5"
        fill="none"
        className="flow-line"
        style={{ animationDelay: `${i * 0.3}s` }}
      />
    );
  });

  const groupLabels: any[] = [];
  const seen = new Set();
  Object.values(nodePositions).forEach((pos: any) => {
    if (!seen.has(pos.groupLabel)) {
      seen.add(pos.groupLabel);
      groupLabels.push({ label: pos.groupLabel, x: pos.groupX, width: pos.groupWidth });
    }
  });

  return (
    <div style={{
      background: isDark ? '#111318' : '#F3F4F6',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 32,
      width: '100%',
      overflow: 'hidden',
      boxShadow: isDark ? 'inset 0 0 30px rgba(0,0,0,0.4)' : 'inset 0 0 20px rgba(0,0,0,0.04)',
      position: 'relative'
    }}>
      <p style={{
        fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)', marginBottom: 24
      }}>{diagram.title}</p>
      <svg
        viewBox={`0 0 ${totalWidth} ${viewBoxHeight}`}
        width="100%"
        height="auto"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {groupLabels.map((g, i) => (
          <text
            key={i}
            x={g.x + g.width / 2}
            y={TOP_OFFSET - 16}
            textAnchor="middle"
            fontFamily="Space Grotesk"
            fontSize="10"
            fontWeight="700"
            fill={isDark ? '#4D5261' : '#9CA3AF'}
            letterSpacing="1.5"
          >
            {g.label}
          </text>
        ))}
        {edges}
        {Object.values(nodePositions).map((pos: any, i) => {
          const isSelected = selectedNode?.id === pos.id;
          return (
            <g 
              key={i} 
              style={{ cursor: 'pointer' }} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(pos);
              }}
              onMouseEnter={e => {
                if (isSelected) return;
                const rect = (e.currentTarget as any).querySelector('rect');
                rect.style.stroke = 'var(--accent)';
                rect.style.fill = 'var(--surface-hover)';
              }}
              onMouseLeave={e => {
                if (isSelected) return;
                const rect = (e.currentTarget as any).querySelector('rect');
                rect.style.stroke = isDark ? 'var(--border)' : '#D1D5DB';
                rect.style.fill = isDark ? '#1A1C24' : '#FFFFFF';
              }}
            >
              <rect
                x={pos.x} y={pos.y}
                width={NODE_W} height={NODE_H}
                rx="10" ry="10"
                fill={isSelected ? 'var(--surface-hover)' : isDark ? '#1A1C24' : '#FFFFFF'}
                stroke={isSelected ? 'var(--accent)' : isDark ? 'var(--border)' : '#D1D5DB'}
                strokeWidth={isSelected ? "2.5" : "1.5"}
                style={{
                  transition: 'all 0.2s ease',
                  animation: isSelected ? 'nodePulse 2s infinite' : 'none'
                }}
              />
              <text
                x={pos.x + NODE_W / 2}
                y={pos.y + 24}
                textAnchor="middle"
                fontFamily="Space Grotesk"
                fontSize="13"
                fontWeight="600"
                fill={isSelected ? 'var(--accent)' : isDark ? '#F2F2F3' : '#111827'}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
              >
                {pos.label}
              </text>
              <text
                x={pos.x + NODE_W / 2}
                y={pos.y + 42}
                textAnchor="middle"
                fontFamily="Inter"
                fontSize="10"
                fill={isSelected ? 'var(--text-primary)' : isDark ? '#8E929E' : '#6B7280'}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
              >
                {pos.desc.length > 18 ? pos.desc.substring(0, 18) + '…' : pos.desc}
              </text>
            </g>
          );
        })}
      </svg>

      {selectedNode && (
        <div 
          onClick={() => setSelectedNode(null)}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(8, 9, 12, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, zIndex: 10, borderRadius: 12,
            animation: 'heroFadeIn 0.3s ease-out',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ 
              textAlign: 'center', 
              maxWidth: 300, 
              cursor: 'default',
              background: 'var(--surface)',
              padding: '32px 24px',
              borderRadius: 16,
              border: '1px solid var(--border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <span style={{
              fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--accent)', display: 'block', marginBottom: 8
            }}>{selectedNode.groupLabel}</span>
            <h4 style={{
              fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 12
            }}>{selectedNode.label}</h4>
            <p style={{
              fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: 24
            }}>{selectedNode.desc}</p>
            <button 
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'var(--accent)', 
                border: 'none',
                color: theme === 'dark' ? '#000' : '#fff', 
                padding: '10px 24px', 
                borderRadius: 8,
                fontFamily: 'Space Grotesk', 
                fontSize: 12, 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
            >Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniWorkflowBar({ diagram: _diagram, onClick }: { diagram: any; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
      color: 'var(--text-secondary)', transition: 'border-color 0.18s, color 0.18s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
    >
      <Layers size={13} />
      Preview Workflow
    </button>
  );
}

function CaseStudies({ theme }: { theme: string }) {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const categories = ['All', 'CRM & Operations', 'Lead Generation', 'AI Automation'];

  const filteredStudies = filter === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(s => s.category === filter);
  const total = filteredStudies.length;

  useEffect(() => { setActive(0); }, [filter]);

  const getPos = (i: number) => {
    let pos = (i - active + total) % total;
    if (pos > Math.floor(total / 2)) pos -= total;
    return pos;
  };

  const goNext = () => setActive(n => (n + 1) % total);
  const goPrev = () => setActive(n => (n - 1 + total) % total);

  const swipeCooldown = useRef(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore vertical scroll
    if (swipeCooldown.current) return;
    if (Math.abs(e.deltaX) < 30) return;
    e.deltaX > 0 ? goNext() : goPrev();
    swipeCooldown.current = true;
    setTimeout(() => { swipeCooldown.current = false; }, 600);
  };

  return (
    <section id="work" style={{ padding: 'var(--section-padding) 0 24px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>Case Studies</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em', marginBottom: 32
          }}>Real problems. Automated solutions.</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '8px 20px', borderRadius: '99px', fontSize: 13,
                fontFamily: 'Inter', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: filter === cat ? 'var(--accent)' : 'var(--surface)',
                color: filter === cat ? (theme === 'dark' ? '#000' : '#fff') : 'var(--text-secondary)',
                border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Coverflow stage */}
      <div className="cs-coverflow-stage"
        onWheel={handleWheel}
        style={{
          position: 'relative', height: 580,
          perspective: '1400px', perspectiveOrigin: '50% 50%',
        }}>
        {filteredStudies.map((cs, i) => {
          const pos      = getPos(i);
          const isCenter = pos === 0;
          const isLeft   = pos === -1;
          const isRight  = pos === 1;
          const isVis    = Math.abs(pos) <= 1;

          let transform = '';
          if (isCenter)    transform = 'translateX(0px)    scale(1)    rotateY(0deg)';
          else if (isLeft) transform = 'translateX(-490px) scale(0.82) rotateY(20deg)';
          else if (isRight)transform = 'translateX(490px)  scale(0.82) rotateY(-20deg)';
          else if (pos < 0)transform = 'translateX(-900px) scale(0.65) rotateY(26deg)';
          else             transform = 'translateX(900px)  scale(0.65) rotateY(-26deg)';

          const baseShadow = isCenter ? '0 8px 32px rgba(0,0,0,0.22)' : '0 4px 12px rgba(0,0,0,0.1)';
          const glowShadow = '0 0 0 2px #3EC68A, 0 0 24px 8px rgba(62,198,138,0.6), 0 0 60px 16px rgba(62,198,138,0.25)';

          return (
            <div key={cs.client + filter} className="silver-glow"
              onClick={isLeft ? goPrev : isRight ? goNext : undefined}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = glowShadow;
                el.style.border = '2px solid #3EC68A';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = baseShadow;
                el.style.border = `1px solid ${isCenter ? 'rgba(200,200,200,0.28)' : 'var(--border)'}`;
              }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 660, marginLeft: -330, marginTop: -280,
                boxSizing: 'border-box',
                background: 'var(--surface)',
                border: `1px solid ${isCenter ? 'rgba(200,200,200,0.28)' : 'var(--border)'}`,
                borderRadius: 20, padding: 28,
                display: 'flex', flexDirection: 'column', gap: 16,
                transform,
                opacity: isCenter ? 1 : isVis ? 0.6 : 0,
                zIndex: isCenter ? 3 : isVis ? 2 : 0,
                cursor: (isLeft || isRight) ? 'pointer' : 'default',
                pointerEvents: isVis ? 'auto' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease, border-color 0.3s, box-shadow 0.35s ease',
                boxShadow: baseShadow,
                overflow: 'hidden',
              }}
            >
              {/* Category badge */}
              <div style={{
                position: 'absolute', top: 0, right: 0, padding: '7px 14px',
                background: 'var(--accent-glow)', color: 'var(--accent)',
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', borderBottomLeftRadius: 12,
              }}>{cs.category}</div>

              {/* Zone 1 — Identity */}
              <div>
                <span style={{
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-tertiary)', display: 'block', marginBottom: 5,
                }}>{cs.industry}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                    {cs.website ? (
                      <a href={cs.website} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'inherit', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                      >{cs.client}<ExternalLink size={15} style={{ opacity: 0.5 }} /></a>
                    ) : cs.client}
                  </h3>
                  <MiniWorkflowBar diagram={cs.diagram} onClick={() => setSelectedWorkflow(cs)} />
                </div>
              </div>

              {/* Zone 2 — Problem */}
              <div>
                <span style={{
                  fontFamily: 'Inter', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--text-tertiary)', display: 'block', marginBottom: 6,
                }}>The Problem</span>
                <p style={{
                  fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)',
                  lineHeight: 1.65, margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{cs.problem}</p>
              </div>

              {/* Zone 3 — Results */}
              <div>
                <span style={{
                  fontFamily: 'Inter', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--success)', display: 'block', marginBottom: 10, opacity: 0.85,
                }}>Results</span>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {cs.results.map((res, ri) => (
                    <div key={ri}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, lineHeight: 1, color: 'var(--success)', letterSpacing: '-0.02em' }}>{res.value}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.3 }}>{res.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', flexShrink: 0 }} />

              {/* Zone 4 — What changed */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: 0, padding: 0 }}>
                {cs.bullets.slice(0, 3).map((b, bi) => (
                  <li key={bi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <CheckCircle size={12} color="var(--success)" style={{ marginTop: 3, flexShrink: 0, opacity: 0.8 }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Zone 5 — Tech footer */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {cs.tools.map((tool, ti) => (
                    <span key={ti} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      padding: '4px 9px', borderRadius: 'var(--radius-badge)',
                      fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
                    }}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>

      {/* Workflow Preview Modal */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedWorkflow(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24, backdropFilter: 'blur(8px)'
            }}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 24, maxWidth: 1000, width: '100%',
                maxHeight: '90vh', overflow: 'hidden', position: 'relative'
              }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 24, color: 'var(--text-primary)' }}>{selectedWorkflow.client} Workflow</h3>
                  <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)' }}>Stylized preview of the automation architecture</p>
                </div>
                <button onClick={() => setSelectedWorkflow(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >Close</button>
              </div>
              <div style={{ padding: 40, background: theme === 'dark' ? '#000' : 'var(--bg)', position: 'relative', overflow: 'auto' }}>
                <div style={{
                  width: '100%', height: 500,
                  background: 'url(https://picsum.photos/seed/workflow/1200/800) center/cover no-repeat',
                  filter: 'blur(40px) brightness(0.5)',
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <WorkflowDiagram diagram={selectedWorkflow.diagram} theme={theme} />
                </div>
                <div style={{
                  marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.03)',
                  borderRadius: 12, border: '1px solid var(--border)',
                  fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6
                }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>Architecture Overview:</strong>
                  This workflow utilizes a hub-and-spoke model where <strong>{selectedWorkflow.tools[0]}</strong> acts as the central orchestrator.
                  Data is ingested via webhooks, processed through AI logic gates for classification, and then distributed to
                  <strong> {selectedWorkflow.tools.slice(1, 4).join(', ')}</strong>.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}

function Process() {
  const getIcon = (name: string) => {
    switch(name) {
      case 'search': return <Search size={20} color="var(--text-tertiary)" />;
      case 'layers': return <Layers size={20} color="var(--text-tertiary)" />;
      case 'check-circle': return <CheckCircle size={20} color="var(--text-tertiary)" />;
      default: return <Search size={20} color="var(--text-tertiary)" />;
    }
  };

  return (
    <section id="process" style={{ padding: 'var(--section-padding) 0' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>Process</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Simple. No surprises.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16
        }} className="three-col">
          {STEPS.map((step, i) => (
            <div key={i} className="fade-init card-hover" style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
              display: 'flex', flexDirection: 'column', gap: 16, minHeight: 240
            }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: 'var(--accent)' }}>
                {step.number}
              </div>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 17, color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {step.description}
              </p>
              <div style={{ marginTop: 'auto' }}>
                {getIcon(step.icon)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>Testimonials</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            What clients say.
          </h2>
        </div>

        <div style={{ position: 'relative', minHeight: 300 }}>
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={i} 
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                opacity: currentIndex === i ? 1 : 0,
                visibility: currentIndex === i ? 'visible' : 'hidden',
                transform: `translateX(${(i - currentIndex) * 20}px)`,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
                textAlign: 'center'
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                {[...Array(5)].map((_, idx) => <Zap key={idx} size={16} fill="currentColor" style={{ margin: '0 2px' }} />)}
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32 }}>
                "{t.quote}"
              </p>
              <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text-primary)', fontSize: 16 }}>{t.name}</div>
                <div style={{ fontFamily: 'Inter', color: 'var(--text-tertiary)', fontSize: 13, marginTop: 4 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: currentIndex === i ? 'var(--accent)' : 'var(--border)',
                border: 'none', cursor: 'pointer', transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" style={{ padding: 'var(--section-padding) 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div className="fade-init" style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)', padding: '80px 40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.05, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.04em', marginBottom: 20
          }}>
            Ready to find your leak?
          </h2>
          <p style={{
            fontFamily: 'Inter', fontSize: 16, color: 'var(--text-secondary)',
            maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6
          }}>
            Check my availability above or reach out directly — I'll get back within 24 hours.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: 'var(--gradient)', color: '#fff',
                fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
                padding: '16px 36px', borderRadius: 'var(--radius-btn)',
                transition: 'transform 0.2s ease', border: 'none', cursor: 'pointer'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >
              Check Availability
              <ChevronRight size={20} />
            </button>
            <a href="mailto:rnthlcueto@gmail.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
              padding: '16px 36px', borderRadius: 'var(--radius-btn)',
              transition: 'background 0.2s ease', border: '1px solid var(--border)',
              textDecoration: 'none'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
            >
              Send an Email
            </a>
          </div>
          <div style={{
            marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'Inter', fontSize: 13, color: 'var(--text-tertiary)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
            2 spots left for April
          </div>
        </div>
      </div>
    </section>
  );
}

const CAL_DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const CAL_EVENT_TYPE_ID = 5528727;
const CAL_API_KEY = import.meta.env.VITE_CAL_API_KEY as string;

function utcToLabel(utcIso: string): string {
  const d = new Date(utcIso);
  const h = (d.getUTCHours() + 8) % 24;
  const min = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${min.toString().padStart(2, '0')} ${ampm}`;
}

function GoogleCalendar() {
  const [step, setStep]               = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; label: string } | null>(null);
  const [slots, setSlots]             = useState<{ time: string; label: string }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [form, setForm]       = useState({ name: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError]   = useState('');

  // Fetch real availability from Cal.com when date changes
  useEffect(() => {
    if (!selectedDate) { setSlots([]); return; }
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    const y = selectedDate.getFullYear(), m = selectedDate.getMonth(), d = selectedDate.getDate();
    // midnight PHT (UTC+8) = UTC midnight - 8 h; end of PHT day = UTC 15:59
    const startUTC = new Date(Date.UTC(y, m, d) - 8 * 3600 * 1000).toISOString();
    const endUTC   = new Date(Date.UTC(y, m, d, 15, 59, 0)).toISOString();
    const url = `https://api.cal.com/v2/slots/available?startTime=${encodeURIComponent(startUTC)}&endTime=${encodeURIComponent(endUTC)}&eventTypeSlug=30min&usernameList[0]=renthelautomations`;
    fetch(url, { headers: { Authorization: `Bearer ${CAL_API_KEY}`, 'cal-api-version': '2024-09-23' } })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success' && data.data?.slots) {
          const dateSlots: { time: string }[] = Object.values(data.data.slots).flat() as { time: string }[];
          setSlots(dateSlots.map(s => ({ time: s.time, label: utcToLabel(s.time) })));
        }
        setSlotsLoading(false);
      })
      .catch(() => setSlotsLoading(false));
  }, [selectedDate]);

  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  }, []);

  const monthLabel = useMemo(() =>
    currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    [currentMonth]
  );

  const calDays = useMemo(() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(y, m, d));
    return cells;
  }, [currentMonth]);

  const isAvail  = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6 && d >= today;
  const isSel    = (d: Date) => !!selectedDate &&
    d.getFullYear() === selectedDate.getFullYear() &&
    d.getMonth()    === selectedDate.getMonth()    &&
    d.getDate()     === selectedDate.getDate();
  const isToday  = (d: Date) => d.getTime() === today.getTime();
  const goMonth  = (dir: 1 | -1) =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + dir, 1));

  const fmtLong  = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long',  month: 'long',  day: 'numeric', year: 'numeric' });
  const fmtShort = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleConfirm = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Please fill in your name and email.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Please enter a valid email address.'); return;
    }
    if (!selectedSlot) return;

    // Show success immediately — fire API in background
    setSubmitted(true);

    const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-08-13',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: selectedSlot.time,
        eventTypeId: CAL_EVENT_TYPE_ID,
        attendee: { name: form.name, email: form.email, timeZone: visitorTz, language: 'en' },
        ...(form.notes ? { metadata: { notes: form.notes } } : {}),
      }),
    }).catch(() => {});
  };

  const inputSt: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 16px', fontFamily: 'Inter', fontSize: 14,
    color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <section id="calendar" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)', padding: '64px 48px', textAlign: 'center',
            }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
              background: 'rgba(200,200,200,0.08)', border: '1px solid rgba(200,200,200,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}><Check size={28} strokeWidth={2} /></div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              You're all set!
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              A confirmation has been sent to{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{form.email}</span>.
            </p>
            <div style={{
              background: 'rgba(200,200,200,0.05)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px', display: 'inline-block', textAlign: 'left',
            }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 10 }}>
                Discovery Call with Renthel
              </div>
              {([
                { icon: <CalendarDays size={14} />, text: selectedDate ? fmtLong(selectedDate) : '' },
                { icon: <Clock size={14} />,        text: `${selectedSlot?.label} PHT` },
                { icon: <Video size={14} />,         text: '30 min · Google Meet' },
                { icon: <Gift size={14} />,          text: 'Free — no obligation' },
              ] as { icon: React.ReactNode; text: string }[]).map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ── Main calendar ── */
  return (
    <section id="calendar" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12,
          }}>Book a Call</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>Let's find your time.</h2>
          <p style={{
            fontFamily: 'Inter', fontSize: 16, color: 'var(--text-secondary)',
            maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
          }}>Pick a slot and confirm — you'll get a calendar invite immediately.</p>
        </div>

        {/* Card */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)', overflow: 'hidden',
          position: 'relative', zIndex: 1,
        }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {([{ n: 1, label: 'Choose a time' }, { n: 2, label: 'Your details' }] as { n: 1|2; label: string }[]).map(({ n, label }, i) => {
              const active = step === n, done = step > n;
              return (
                <div key={n} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                  padding: '18px 28px',
                  borderRight: i === 0 ? '1px solid var(--border)' : 'none',
                  background: active ? 'rgba(200,200,200,0.03)' : 'transparent',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                    border: active ? '1.5px solid var(--accent)'
                           : done   ? 'none'
                           :          '1.5px solid var(--border)',
                    background: done ? 'var(--accent)' : 'transparent',
                    color: active ? 'var(--accent)' : done ? 'var(--bg)' : 'var(--text-tertiary)',
                  }}>{done ? '✓' : n}</div>
                  <div>
                    <div style={{
                      fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                    }}>Step {n}</div>
                    <div style={{
                      fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                      color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}>{label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Date + Time ── */}
          {step === 1 && (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 460 }} className="cal-step1-grid">

              {/* Left: Calendar grid */}
              <div style={{ padding: '32px', borderRight: '1px solid var(--border)' }}>
                {/* Month nav */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <button onClick={() => goMonth(-1)} style={{
                    background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                    width: 34, height: 34, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                  >‹</button>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                    {monthLabel}
                  </span>
                  <button onClick={() => goMonth(1)} style={{
                    background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                    width: 34, height: 34, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                  >›</button>
                </div>

                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
                  {CAL_DAY_HEADERS.map(h => (
                    <div key={h} style={{
                      textAlign: 'center', fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                      color: 'var(--text-tertiary)', textTransform: 'uppercase',
                      letterSpacing: '0.05em', padding: '4px 0',
                    }}>{h}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
                  {calDays.map((date, i) => {
                    if (!date) return <div key={`e-${i}`} />;
                    const avail = isAvail(date), sel = isSel(date), tod = isToday(date);
                    return (
                      <button key={i} onClick={() => { if (avail) { setSelectedDate(date); setSelectedSlot(null); } }}
                        disabled={!avail}
                        style={{
                          aspectRatio: '1', borderRadius: 8,
                          border: sel ? '1.5px solid rgba(200,200,200,0.55)'
                                : tod ? '1px solid rgba(200,200,200,0.28)'
                                :        '1px solid transparent',
                          background: sel ? 'rgba(200,200,200,0.14)' : 'transparent',
                          color: 'var(--text-primary)',
                          fontFamily: 'Inter', fontSize: 13, fontWeight: sel ? 600 : 400,
                          cursor: avail ? 'pointer' : 'default',
                          opacity: avail ? 1 : 0.22,
                          transition: 'background 0.12s, border-color 0.12s',
                        }}
                        onMouseEnter={e => { if (avail && !sel) (e.currentTarget as HTMLElement).style.background = 'rgba(200,200,200,0.08)'; }}
                        onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >{date.getDate()}</button>
                    );
                  })}
                </div>

                <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 20, lineHeight: 1.7 }}>
                  Times shown in Philippine Time (PHT, GMT+8).<br />Weekdays only — Mon to Fri.
                </p>
              </div>

              {/* Right: Time slots */}
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
                {!selectedDate ? (
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 12,
                  }}>
                    <CalendarDays size={36} style={{ opacity: 0.25, color: 'var(--text-tertiary)' }} />
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
                      Select a date to see<br />available time slots
                    </div>
                  </div>
                ) : (
                  <motion.div key={selectedDate.toDateString()}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                        {fmtShort(selectedDate)}
                      </div>
                      <AnimatePresence>
                        {selectedSlot && (
                          <motion.button
                            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                            onClick={() => setStep(2)}
                            style={{
                              padding: '7px 16px', background: 'var(--gradient)',
                              border: 'none', borderRadius: 8, color: '#fff',
                              fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                              cursor: 'pointer', letterSpacing: '0.01em', transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                          >Next →</motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 18 }}>
                      Pick an available time slot
                    </div>

                    {slotsLoading ? (
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-tertiary)', padding: '24px 0', textAlign: 'center' }}>
                        Loading available times...
                      </div>
                    ) : slots.length === 0 ? (
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-tertiary)', padding: '24px 0', textAlign: 'center', lineHeight: 1.6 }}>
                        No available slots on this day.<br />Please choose another date.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {slots.map(slot => {
                          const sel = selectedSlot?.time === slot.time;
                          return (
                            <button key={slot.time} onClick={() => setSelectedSlot(slot)} style={{
                              padding: '11px 8px', borderRadius: 10, textAlign: 'center',
                              border: sel ? '1.5px solid rgba(200,200,200,0.5)' : '1px solid var(--border)',
                              background: sel ? 'rgba(200,200,200,0.12)' : 'var(--bg)',
                              color: sel ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontFamily: 'Inter', fontSize: 13, fontWeight: sel ? 600 : 400,
                              cursor: 'pointer', transition: 'border-color 0.14s, background 0.14s, color 0.14s',
                            }}
                            onMouseEnter={e => { if (!sel) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,200,200,0.3)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; } }}
                            onMouseLeave={e => { if (!sel) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; } }}
                            >{slot.label}</button>
                          );
                        })}
                      </div>
                    )}

                  </motion.div>
                )}
              </div>
            </div>

            </>
          )}

          {/* ── Step 2: Form ── */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '40px 48px' }}
            >
              {/* Selected slot chip */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                background: 'rgba(200,200,200,0.05)', border: '1px solid rgba(200,200,200,0.14)',
                borderRadius: 12, padding: '16px 20px', marginBottom: 32,
              }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                    Selected Slot
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedDate && fmtLong(selectedDate)} · {selectedSlot?.label} PHT
                  </div>
                </div>
                <button onClick={() => setStep(1)} style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '6px 16px', fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#3EC68A';
                  el.style.color = '#3EC68A';
                  el.style.background = 'rgba(62,198,138,0.07)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.color = 'var(--text-secondary)';
                  el.style.background = 'none';
                }}
                >Change</button>
              </div>

              {/* Form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="cal-form-grid">
                  <div>
                    <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                      Full Name <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input type="text" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name" style={inputSt}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,200,200,0.4)'}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                      Email Address <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@company.com" style={inputSt}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,200,200,0.4)'}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                    What would you like to automate?{' '}
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Tell me about your business and what you'd like to streamline..."
                    rows={4}
                    style={{ ...inputSt, resize: 'vertical', minHeight: 100 }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(200,200,200,0.4)'}
                    onBlur={e  => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'}
                  />
                </div>

                {formError && (
                  <div style={{
                    fontFamily: 'Inter', fontSize: 13, color: '#f87171',
                    padding: '10px 16px', background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8,
                  }}>{formError}</div>
                )}

                <button onClick={handleConfirm} style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none',
                  background: 'var(--gradient)', color: '#fff',
                  fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.01em', width: '100%',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >Confirm Booking</button>

                <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
                  You'll receive a calendar invite and confirmation email shortly after booking.
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${progress}%`,
      height: '2px',
      background: 'linear-gradient(to right, #888, #E2E2E2, #888)',
      zIndex: 1000,
      transition: 'width 0.1s ease-out'
    }} />
  );
}

function ROICalculator() {
  const [tasks, setTasks] = useState(5);
  const [timePerTask, setTimePerTask] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(30);

  const dailySavings = (tasks * timePerTask) / 60;
  const annualTimeSavings = dailySavings * 260; // 260 working days
  const annualCostSavings = annualTimeSavings * hourlyRate;

  return (
    <section id="roi" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>ROI Calculator</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Quantify your time leak.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          alignItems: 'center'
        }} className="two-col">
          <div className="fade-init" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
            display: 'flex', flexDirection: 'column', gap: 32
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                  Manual tasks per day
                </label>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>{tasks}</span>
              </div>
              <input 
                type="range" min="1" max="50" value={tasks} 
                onChange={(e) => setTasks(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                  Minutes per task
                </label>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>{timePerTask}m</span>
              </div>
              <input 
                type="range" min="5" max="120" step="5" value={timePerTask} 
                onChange={(e) => setTimePerTask(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                  Employee hourly rate ($)
                </label>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>${hourlyRate}</span>
              </div>
              <input 
                type="range" min="15" max="200" step="5" value={hourlyRate} 
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>
          </div>

          <div className="fade-init" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
              textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Annual Time Recovered
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 48, fontWeight: 600, color: 'var(--success)' }}>
                {Math.round(annualTimeSavings)} hrs
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
                That's {Math.round(annualTimeSavings / 8)} full work days back.
              </div>
            </div>

            <div style={{
              background: 'var(--gradient)', borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
              textAlign: 'center', color: '#fff'
            }}>
              <div style={{ fontFamily: 'Inter', fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Potential Annual Savings
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 48, fontWeight: 600 }}>
                ${annualCostSavings.toLocaleString()}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 14, opacity: 0.9, marginTop: 8 }}>
                Stop paying for manual data entry.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" style={{ padding: 'var(--section-padding) 0' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>FAQ</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Common questions.
          </h2>
        </div>

        <div className="faq-row" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'nowrap',
        }}>
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="fade-init card-hover" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: 24,
              width: 260,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxSizing: 'border-box',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}>
              <span style={{
                fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700,
                color: 'var(--accent)', letterSpacing: '0.04em',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 style={{
                fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700,
                color: 'var(--text-primary)', lineHeight: 1.35,
                margin: 0,
              }}>
                {item.question}
              </h3>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

              <p style={{
                fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)',
                lineHeight: 1.6, margin: 0,
              }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: '48px 0',
      borderTop: '1px solid var(--border)',
      marginTop: 64
    }}>
      <div style={{
        maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }} className="footer-inner">
        <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>
          Renthel Cueto
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-tertiary)' }}>
          © 2026 · Built with precision.
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="mailto:renthel.smm@gmail.com" style={{ color: 'var(--text-tertiary)', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'}
          >
            <Mail size={18} />
          </a>
          <a href="https://www.linkedin.com/in/rnthlcueto/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'}
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

// --- APP ROOT ---

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  // Inject global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

      :root {
        --bg: #08090C;
        --surface: #0F1014;
        --surface-hover: #13141A;
        --border: rgba(255, 255, 255, 0.06);
        --border-hover: rgba(255, 255, 255, 0.12);
        --text-primary: #F2F2F3;
        --text-secondary: #6B6F7A;
        --text-tertiary: #3D4049;
        --accent: #E4E4E7;
        --accent-glow: rgba(228, 228, 231, 0.1);
        --success: #3EC68A;
        --gradient: linear-gradient(135deg, #3F3F46 0%, #18181B 100%);
        --radius-card: 12px;
        --radius-badge: 6px;
        --radius-btn: 8px;
        --section-padding: 120px;
        --card-padding: 32px;
        --max-width: 1160px;
        --nav-height: 64px;
        --transition: all 0.3s ease;
      }

      body.light-mode {
        --bg: #F9FAFB;
        --surface: #FFFFFF;
        --surface-hover: #F3F4F6;
        --border: rgba(0, 0, 0, 0.08);
        --border-hover: rgba(0, 0, 0, 0.15);
        --text-primary: #111827;
        --text-secondary: #4B5563;
        --text-tertiary: #6B7280;
        --accent: #3F3F46;
        --accent-glow: rgba(63, 63, 70, 0.05);
        --success: #10B981;
        --gradient: linear-gradient(135deg, #18181B 0%, #3F3F46 100%);
        background-image:
          radial-gradient(ellipse 110% 45% at 50% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
          radial-gradient(ellipse 60% 30% at 100% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 1.5px 1.5px, rgba(0, 0, 0, 0.1) 1px, transparent 0);
        background-size: 100% auto, 100% auto, 32px 32px;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; font-size: 16px; }
      body {
        background-color: var(--bg);
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
        line-height: 1.6;
        padding-top: var(--nav-height);
        background-image: 
          radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0);
        background-size: 40px 40px;
        animation: grid-move 120s linear infinite;
      }

      @keyframes grid-move {
        from { background-position: 0 0; }
        to { background-position: 40px 40px; }
      }

      img, svg { max-width: 100%; display: block; }
      a { text-decoration: none; color: inherit; }
      ul { list-style: none; }

      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @keyframes flowLine {
        to { stroke-dashoffset: -24; }
      }

      @keyframes heroFadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .accent-gradient {
        background: var(--gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: inline-block;
      }

      .hero-content {
        animation: heroFadeIn 600ms ease-out 200ms both;
      }

      .fade-init {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 500ms ease-out, transform 500ms ease-out;
      }

      .fade-init.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .flow-line {
        stroke-dasharray: 4 4;
        animation: flowLine 2.5s linear infinite;
      }

      @keyframes nodePulse {
        0% { stroke-opacity: 0.4; stroke-width: 1.5; }
        50% { stroke-opacity: 1; stroke-width: 2.5; }
        100% { stroke-opacity: 0.4; stroke-width: 1.5; }
      }

      .marquee-track {
        display: inline-flex;
        animation: marquee 35s linear infinite;
        white-space: nowrap;
      }

      .marquee-track:hover {
        animation-play-state: paused;
      }

      .tech-row-1 {
        display: inline-flex; white-space: nowrap;
        animation: marquee 45s linear infinite;
      }
      .tech-row-2 {
        display: inline-flex; white-space: nowrap;
        animation: marquee 60s linear infinite reverse;
      }
      .tech-row-3 {
        display: inline-flex; white-space: nowrap;
        animation: marquee 52s linear infinite;
      }
      .tech-row-1:hover, .tech-row-2:hover, .tech-row-3:hover {
        animation-play-state: paused;
      }

      .card-hover {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                    border-color 0.3s ease,
                    background-color 0.3s ease,
                    box-shadow 0.3s ease;
      }
      .card-hover:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: rgba(200, 200, 200, 0.25);
        background-color: var(--surface-hover);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18),
                    0 0 0 1px rgba(200, 200, 200, 0.08),
                    0 0 16px rgba(210, 210, 210, 0.06);
      }

      .tech-card {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                    border-color 0.3s ease,
                    box-shadow 0.3s ease;
        cursor: default;
      }
      .tech-card:hover {
        transform: scale(1.08);
        border-color: rgba(200, 200, 200, 0.25);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(200, 200, 200, 0.08),
                    0 0 12px rgba(210, 210, 210, 0.06);
      }

      .silver-glow {
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .silver-glow:hover {
        border-color: rgba(200, 200, 200, 0.25) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22),
                    0 0 0 1px rgba(200, 200, 200, 0.08),
                    0 0 18px rgba(210, 210, 210, 0.07) !important;
      }

      @media (max-width: 1024px) {
        .case-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      }

      @media (max-width: 768px) {
        :root { --section-padding: 80px; --card-padding: 24px; }
        .nav-links button { display: none; }
        .nav-links { gap: 16px; }
        .two-col { grid-template-columns: 1fr !important; }
        .three-col { grid-template-columns: 1fr !important; }
        .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        .about-grid > div:first-child { justify-content: center !important; align-items: center !important; text-align: center; }
        .about-grid > div:first-child img { max-width: 280px; width: 100%; }
        .about-grid > div:first-child > div { margin: 0 auto; }
        .calendar-grid { grid-template-columns: 1fr !important; }
        .workflow-fifth { max-width: 100% !important; }
        .footer-inner { flex-direction: column; text-align: center; align-items: center; gap: 12px; }
        .stats-row { flex-direction: column; gap: 0; }
        .stat-divider { display: none !important; }
        .stats-row > div { padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--border); width: 100%; }
        .stats-row > div:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }

        /* Results banner */
        .results-banner { flex-direction: column !important; gap: 12px !important; }
        .results-sep { display: none !important; }

        /* Coverflow carousel */
        .coverflow-stage {
          transform: scale(0.68) !important;
          transform-origin: center top !important;
          margin-bottom: -148px !important;
        }

        /* Case study inner two-column */
        .case-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      }

      @media (max-width: 540px) {
        /* FAQ: 2-up then 1-up */
        .faq-row { flex-wrap: wrap !important; justify-content: center !important; }
        .faq-row > div { width: calc(50% - 8px) !important; }

        /* Coverflow tighter */
        .coverflow-stage {
          transform: scale(0.5) !important;
          transform-origin: center top !important;
          margin-bottom: -228px !important;
        }
      }

      @media (max-width: 380px) {
        .faq-row > div { width: 100% !important; }
      }

      @media (max-width: 640px) {
        .cal-step1-grid { grid-template-columns: 1fr !important; }
        .cal-step1-grid > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        .cal-form-grid { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Scroll reveal
  useScrollReveal();

  return (
    <>
      <ScrollProgress />
      <CursorGlow theme={theme} />
      <Background theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <LogoMarquee />
        <About />
        <TechStack theme={theme} />
        <Workflows />
        <CaseStudies theme={theme} />
        <Process />
        <Testimonials />
        <ROICalculator />
        <GoogleCalendar />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
