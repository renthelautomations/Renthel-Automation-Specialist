import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { motion, AnimatePresence } from 'motion/react';
import profilePic from '../Assets/ren techy2 copy.png';
import logoImg   from '../Assets/logo.png';
import linkedinAutomationImg from '../Automations/AI-Powered LinkedIn Content Engine.png';
import gmailAutomationImg from '../Automations/AI Gmail Management System.png';
import leadAutomationImg from '../Automations/AI Lead Management & Booking System.png';
import metaAutomationImg from '../Automations/Meta Competitor Ad Intelligence System.png';
import {
  Zap, FileText, Repeat, Database, BarChart2,
  ChevronRight, ChevronLeft, Search, Layers, CheckCircle,
  Mail, Linkedin, ArrowRight, ExternalLink,
  Sun, Moon,
  CalendarDays, Clock, Timer, Gift, Check, Video, Star,
  Menu, X
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
    role: 'Studio Director, Bee Fearless Studios',
    stat: '3 hrs → 20 min',
    statLabel: 'Daily admin time'
  },
  {
    quote: 'We were losing leads every week without knowing it. The speed-to-lead system paid for itself in the first two jobs we closed. ROI was immediate and obvious.',
    name: 'James T.',
    role: 'Owner, Elevated Roofing & Restoration',
    stat: 'Job 1–2',
    statLabel: 'Paid for itself'
  },
  {
    quote: 'I used to dread Monday mornings. Now the report is in my inbox before I open my laptop. The whole team relies on it.',
    name: 'Diana R.',
    role: 'Operations Manager, Harborview Property Management',
    stat: '0 min',
    statLabel: 'Manual reporting time'
  }
];

const STEPS = [
  {
    number: '01',
    title: 'Discovery Call',
    description: 'We map your current process together. I ask the right questions. You know exactly what we are building before I write a single line of logic.',
    duration: '~1 hour',
    effort: 'Your time: 1 call',
  },
  {
    number: '02',
    title: 'Build & Test',
    description: 'I build with your real data, stress-test for edge cases, and QA internally. You see a working system — not a prototype.',
    duration: '4–8 weeks',
    effort: 'Your time: Feedback only',
  },
  {
    number: '03',
    title: 'Handover & Support',
    description: 'Loom walkthrough, Notion docs, two weeks post-launch support. Your team runs it. You own it.',
    duration: '2 weeks',
    effort: 'Your time: 1 walkthrough',
  },
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

const AUTOMATION_SHOWCASES = [
  {
    image: linkedinAutomationImg,
    name: 'AI-Powered LinkedIn Content Engine',
    tagline: 'From zero content to daily posting — fully automated',
    problem: 'Posting consistently on LinkedIn takes time most founders don\'t have. Researching trends. Writing posts. Designing visuals. Posting daily. It easily eats up 1–2 hours per day. Content becomes inconsistent. Growth slows. Leads drop.',
    solution: 'I built a fully automated system that turns AI news into ready-to-publish LinkedIn content — every single day. No manual research. No writing from scratch. No design work. Just consistent, high-quality output.',
    whatItDoes: [
      'Pulls the latest AI and tech news from multiple sources',
      'Filters and summarizes the most relevant stories',
      'Writes a complete LinkedIn post (human tone, not robotic)',
      'Generates a custom image for the post',
      'Updates a content calendar automatically',
      'Publishes directly to LinkedIn',
      'Sends notifications once the post is live',
    ],
    tools: ['n8n', 'OpenAI', 'Google Sheets', 'Google Drive', 'LinkedIn API', 'Telegram'],
    results: [
      { value: '10–12 hrs', label: 'Saved per week' },
      { value: 'Daily', label: 'Posts published' },
      { value: '90%', label: 'Faster production' },
      { value: '3x', label: 'Content consistency' },
    ],
  },
  {
    image: gmailAutomationImg,
    name: 'AI Gmail Management System',
    tagline: 'Automatically organize, prioritize, and protect your inbox',
    problem: 'Email becomes overwhelming fast. Important messages get buried. Spam slips through. Urgent emails get missed. For busy founders and operators, inbox management becomes a daily bottleneck — 1–2 hours lost every day just sorting emails, with missed opportunities and increased risk of phishing.',
    solution: 'An AI-powered system that reads, understands, and organizes your emails automatically. It doesn\'t just filter emails — it thinks through them and decides what matters.',
    whatItDoes: [
      'Monitors incoming emails in real-time via Gmail',
      'Uses AI to analyze intent, category, urgency, and spam probability',
      'Automatically classifies emails into: Business inquiries, Support requests, Personal messages, Spam or threats',
      'Assigns labels inside Gmail automatically',
      'Flags urgent emails instantly',
      'Sends SMS alerts for high-priority messages',
      'Logs all processed emails into a tracking system',
    ],
    tools: ['n8n', 'OpenAI', 'Gmail', 'Google Sheets', 'SMS API'],
    results: [
      { value: '80–90%', label: 'Less manual sorting' },
      { value: 'Instant', label: 'Urgent detection' },
      { value: '0', label: 'Missed priority emails' },
      { value: '7–10 hrs', label: 'Saved per week' },
    ],
  },
  {
    image: leadAutomationImg,
    name: 'AI Lead Management & Booking System',
    tagline: 'Turn inquiries into booked clients — automatically',
    problem: 'Leads come from everywhere — Instagram DMs, website chats, forms. Without a system, messages get missed or delayed. No clear priority between serious vs. casual inquiries. Manual replies slow down conversions. Hot leads go cold. Result: lost bookings and wasted opportunities.',
    solution: 'A centralized system that captures, qualifies, scores, and responds to leads automatically — in real-time. No more guessing who\'s serious. No more delayed replies. No more messy inboxes.',
    whatItDoes: [
      'Captures leads from Instagram DMs, Wix website chat, and Tally form submissions',
      'Normalizes all incoming data into one system',
      'Uses AI to detect intent, urgency, and extract dates and key details',
      'Checks real-time availability via Google Calendar',
      'Suggests available booking slots and generates personalized responses',
      'Sends branded email replies automatically',
      'Scores every lead based on intent, urgency, budget, and message quality',
      'Classifies leads as HOT, WARM, or COLD and sends instant WhatsApp alerts for hot leads',
    ],
    tools: ['n8n', 'OpenAI', 'Google Calendar', 'Google Sheets', 'Instagram', 'Wix', 'Tally', 'WhatsApp', 'Gmail'],
    results: [
      { value: 'Seconds', label: 'Response time' },
      { value: '10+ hrs', label: 'Saved per week' },
      { value: '80+', label: 'Hot lead score' },
      { value: '100%', label: 'Leads qualified' },
    ],
  },
  {
    image: metaAutomationImg,
    name: 'Meta Competitor Ad Intelligence System',
    tagline: 'Track winning ads and uncover profitable products automatically',
    problem: 'Running ads without knowing what works is expensive. Most businesses guess what creatives to use, manually check competitor ads (if at all), and miss trends until it\'s too late. Result: wasted ad spend, slow testing, and missed winning opportunities.',
    solution: 'A system that automatically tracks competitor ads, detects winners, and delivers daily insights. No manual research. No guesswork. Just data-backed decisions.',
    whatItDoes: [
      'Scrapes ads daily from Meta Ads Library',
      'Tracks multiple keywords, niches, and competitors',
      'Extracts landing pages, creative types (video, image, text), start dates, and ad status',
      'Detects new ads launched today and filters duplicate ads automatically',
      'Identifies winning ads running 3+ days',
      'Groups ads by product and landing page for deeper insights',
      'Generates daily reports: new ads, active winners, top-performing products',
      'Sends real-time alerts via Telegram',
    ],
    tools: ['n8n', 'Apify', 'Meta Ads Library', 'Google Sheets', 'Telegram'],
    results: [
      { value: '100+', label: 'Ads tracked daily' },
      { value: '90%', label: 'Less research time' },
      { value: 'Auto', label: 'Winner detection' },
      { value: '3+ days', label: 'Winning threshold' },
    ],
  },
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

const NAV_LINKS = [
  { id: 'about',   label: 'About'   },
  { id: 'work',    label: 'Work'    },
  { id: 'roi',     label: 'ROI'     },
  { id: 'process', label: 'Process' },
  { id: 'faq',     label: 'FAQ'     },
];

function Navbar({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 10);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--nav-height)', zIndex: 100,
        background: theme === 'dark' ? 'rgba(8, 9, 12, 0.9)' : 'rgba(249, 250, 251, 0.9)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        transition: 'var(--transition)'
      }}>
        <div style={{
          width: '100%', maxWidth: 'var(--max-width)',
          margin: '0 auto', padding: '0 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {/* Logo */}
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <img src={logoImg} alt="Renthel Cueto logo" style={{
              height: 28, width: 'auto',
              filter: theme === 'dark' ? 'invert(1)' : 'none',
              transition: 'filter 0.3s ease'
            }} />
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
              Renthel Cueto
            </span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="nav-links">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {NAV_LINKS.map(({ id, label }) => (
                <button key={id} onClick={() => scrollTo(id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter', fontWeight: 400, fontSize: 14,
                  color: 'var(--text-secondary)', padding: 0,
                  transition: 'color 150ms ease'
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
                >{label}</button>
              ))}
            </div>
            <button onClick={toggleTheme} style={{
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

          {/* Mobile right: theme toggle + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="nav-mobile-controls">
            <button onClick={toggleTheme} style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', padding: '6px',
              borderRadius: 'var(--radius-badge)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', padding: '6px',
              borderRadius: 'var(--radius-badge)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0,
              zIndex: 99,
              background: theme === 'dark' ? 'rgba(8,9,12,0.97)' : 'rgba(249,250,251,0.97)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px 24px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontWeight: 500, fontSize: 17,
                color: 'var(--text-secondary)', padding: '12px 0',
                textAlign: 'left', borderBottom: '1px solid var(--border)',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
              >{label}</button>
            ))}
            <button onClick={() => scrollTo('calendar')} style={{
              marginTop: 12, padding: '13px', borderRadius: 10, border: 'none',
              background: '#3EC68A', color: '#fff',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>Book a Call</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
          <span key={i} className="marquee-logo">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

const LOGO_DOMAINS: Record<string, string> = {
  'n8n':              'n8n.io',
  'Zapier':           'zapier.com',
  'Make.com':         'make.com',
  'Airtable':         'airtable.com',
  'Notion':           'notion.so',
  'Jira':             'atlassian.com',
  'Asana':            'asana.com',
  'OpenAI':           'openai.com',
  'Claude':           'claude.ai',
  'Claude Code':      'claude.ai',
  'Vapi':             'vapi.ai',
  'ElevenLabs':       'elevenlabs.io',
  'Zoho CRM':         'zoho.com',
  'GoHighLevel':      'gohighlevel.com',
  'Apollo.io':        'apollo.io',
  'Slack':            'slack.com',
  'WhatsApp':         'whatsapp.com',
  'Twilio':           'twilio.com',
  'Zoom':             'zoom.us',
  'Google Workspace': 'workspace.google.com',
  'Meta API':         'meta.com',
  'GitHub':           'github.com',
  'Cursor':           'cursor.com',
  'Supabase':         'supabase.com',
  'WordPress':        'wordpress.org',
  'Ahrefs':           'ahrefs.com',
  'Xero':             'xero.com',
  'REST APIs':        'swagger.io',
};

const LOGO_TOKEN = 'pk_OCHBJzrDRDO7R1LWkGPUMA';

function TechIcon({ name, size = 24 }: { name: string; size?: number; isDark?: boolean }) {
  const domain = LOGO_DOMAINS[name];
  if (!domain) return null;
  return (
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_TOKEN}`}
      alt={name}
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: 4 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
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
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
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

      {/* rows with fade masks */}
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
const HERO_PHRASES = [
  'leaking time.',
  'losing leads.',
  'wasting hours.',
  'running on manual.',
];

const LEFT_TOASTS = [
  { text: 'Lead captured',   tool: 'Apollo.io'     },
  { text: 'CRM updated',     tool: 'Zoho CRM'      },
  { text: 'Invoice sent',    tool: 'Xero'          },
  { text: 'Slack notified',  tool: 'Slack'         },
  { text: 'Report ready',    tool: 'Google Sheets' },
];

const RIGHT_TOASTS = [
  { text: 'Email drafted',      tool: 'Gmail'    },
  { text: 'Post published',     tool: 'LinkedIn' },
  { text: 'Meeting booked',     tool: 'Cal.com'  },
  { text: 'Data synced',        tool: 'Airtable' },
  { text: 'Follow-up queued',   tool: 'Make.com' },
];

type ToastItem = { id: number; text: string; tool: string };

function FloatingToasts({ list, startDelay = 0 }: { list: typeof LEFT_TOASTS; startDelay?: number }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idxRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      const spawn = () => {
        const item = list[idxRef.current % list.length];
        idxRef.current++;
        const id = counterRef.current++;
        setToasts(t => [...t.slice(-2), { id, text: item.text, tool: item.tool }]);
      };
      spawn();
      interval = setInterval(spawn, 2400);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column-reverse', gap: 10,
      pointerEvents: 'none', width: 190,
    }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(62,198,138,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Check size={11} color="var(--success)" strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{t.text}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{t.tool}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i + 1) % HERO_PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div className="hero-side-diagram" style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)' }}>
        <FloatingToasts list={LEFT_TOASTS} startDelay={0} />
      </div>
      <div className="hero-side-diagram" style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }}>
        <FloatingToasts list={RIGHT_TOASTS} startDelay={1200} />
      </div>
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
          <span style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIdx}
                style={{ display: 'inline-block', color: 'var(--success)' }}
                initial={{ opacity: 0, y: '60%' }}
                animate={{ opacity: 1, y: '0%' }}
                exit={{ opacity: 0, y: '-60%' }}
                transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              >
                {HERO_PHRASES[phraseIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
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
          <div className="hero-book-call-outer">
            <div className="hero-book-call-glow-bg" />
            <div className="hero-book-call-clip">
              <div className="hero-book-call-snake" />
              <button onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-book-call-btn"
              >
                Book a Call
              </button>
            </div>
          </div>
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
                  fontSize: 'clamp(28px, 7vw, 42px)', lineHeight: 1,
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
                <span style={{ color: 'var(--success)' }}>AI Automation Specialist</span>
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
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
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

function ZoomableImage({ src, alt, zoom, theme, results }: {
  src: string; alt: string; zoom: number; theme: string;
  results: { value: string; label: string }[];
}) {
  const numericResults = results.filter(r => /\d/.test(r.value));
  return (
    <div style={{
      padding: 24, borderRight: '1px solid var(--border)',
      background: theme === 'dark' ? '#07080b' : '#f0f1f4',
      display: 'flex', flexDirection: 'column', gap: 16,
      overflow: 'hidden',
    }}>
      {/* Image — grows to fill available space, centered */}
      <div
        className="zoom-container"
        style={{
          flexGrow: 1, overflow: 'auto', borderRadius: 10,
          border: '1px solid var(--border)',
          background: '#000',
          minHeight: 0,
          cursor: zoom > 1 ? 'grab' : 'default',
          display: 'flex', alignItems: zoom <= 1 ? 'center' : 'flex-start',
          justifyContent: zoom <= 1 ? 'center' : 'flex-start',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            display: 'block',
            width: zoom <= 1 ? 'auto' : `${Math.round(zoom * 100)}%`,
            maxWidth: zoom <= 1 ? '100%' : 'none',
            minWidth: zoom > 1 ? '100%' : 'unset',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Zoom hint */}
      <p style={{
        fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
        textAlign: 'center', margin: 0, flexShrink: 0,
      }}>
        Scroll to zoom · {Math.round(zoom * 100)}%
      </p>

      {/* Stats below image */}
      {numericResults.length > 0 && (
        <div style={{
          background: 'rgba(62,198,138,0.05)', border: '1px solid rgba(62,198,138,0.18)',
          borderRadius: 12, padding: '16px 20px', flexShrink: 0,
        }}>
          <span style={{
            display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--success)', marginBottom: 14, opacity: 0.9,
          }}>Real Results</span>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'nowrap', overflow: 'hidden' }}>
            {numericResults.map((r, idx) => (
              <div key={idx} style={{ flex: '1 1 0', minWidth: 0, paddingRight: 10 }}>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700,
                  fontSize: 'clamp(18px, 1.8vw, 26px)',
                  lineHeight: 1, color: 'var(--success)', letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{r.value}</div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 10, color: 'var(--text-tertiary)',
                  marginTop: 4, lineHeight: 1.3,
                }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AutomationShowcase({ theme }: { theme: string }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const total = AUTOMATION_SHOWCASES.length;

  const selected = selectedIdx !== null ? AUTOMATION_SHOWCASES[selectedIdx] : null;
  const goPrev = () => { setSelectedIdx(i => i !== null ? (i - 1 + total) % total : null); setZoom(1); };
  const goNext = () => { setSelectedIdx(i => i !== null ? (i + 1) % total : null); setZoom(1); };

  // Wheel zoom — attached on document so there are zero DOM-timing issues.
  // Only fires when the cursor is inside .zoom-container.
  useEffect(() => {
    if (selectedIdx === null) return;
    const handler = (e: WheelEvent) => {
      if (!(e.target as Element).closest('.zoom-container')) return;
      e.preventDefault();
      const delta = e.deltaY * (e.ctrlKey ? 0.018 : 0.005);
      setZoom(z => Math.min(4, Math.max(0.5, z - delta)));
    };
    document.addEventListener('wheel', handler, { passive: false });
    return () => document.removeEventListener('wheel', handler);
  }, [selectedIdx]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'Escape')     setSelectedIdx(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIdx]);

  const navBtn = (onClick: () => void, icon: React.ReactNode) => (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
    >{icon}</button>
  );

  return (
    <section style={{ padding: '0 0 var(--section-padding)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>

        <span style={{
          fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--accent)', display: 'block', marginBottom: 20,
          textAlign: 'center',
        }}>More Automations</span>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        }} className="automation-grid">
          {AUTOMATION_SHOWCASES.map((automation, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(62,198,138,0.35)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            >
              <div style={{ width: '100%', height: 180, overflow: 'hidden', flexShrink: 0 }}>
                <img src={automation.image} alt={automation.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                />
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1 }}>
                <h3 style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15,
                  color: 'var(--text-primary)', lineHeight: 1.35, margin: 0,
                }}>{automation.name}</h3>
                <p style={{
                  fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)',
                  lineHeight: 1.6, margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{automation.tagline}</p>

                <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                  <button
                    onClick={() => { setSelectedIdx(i); setZoom(1); }}
                    style={{
                      width: '100%', padding: '10px 16px',
                      background: 'var(--accent-glow)', border: '1px solid var(--accent)',
                      color: 'var(--accent)', borderRadius: 8,
                      fontFamily: 'Inter', fontWeight: 600, fontSize: 13,
                      cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                      (e.currentTarget as HTMLElement).style.color = theme === 'dark' ? '#000' : '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--accent-glow)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                    }}
                  >
                    View Full Automation →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: '24px 16px', backdropFilter: 'blur(10px)',
            }}
          >
            {/* Prev button */}
            {navBtn(goPrev, <ChevronLeft size={22} />)}

            <motion.div
              key={selectedIdx}
              initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }} transition={{ duration: 0.22 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 24, maxWidth: 1060, width: '100%',
                maxHeight: '90vh', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', flexShrink: 1,
              }}
            >
              {/* Modal header */}
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)',
                  }}>Automation Details</span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
                  }}>{selectedIdx + 1} / {total}</span>
                </div>
                <button
                  onClick={() => setSelectedIdx(null)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '6px 16px',
                    fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >Close ✕</button>
              </div>

              {/* Modal body: two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', flexGrow: 1, minHeight: 0 }}>

                {/* Left: zoomable image */}
                <ZoomableImage
                  src={selected.image}
                  alt={selected.name}
                  zoom={zoom}
                  theme={theme}
                  results={selected.results}
                />

                {/* Right: details */}
                <div style={{ padding: '28px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Name + tagline + tools */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h2 style={{
                      fontFamily: 'Space Grotesk', fontSize: 'clamp(17px, 1.8vw, 24px)',
                      fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0,
                    }}>{selected.name}</h2>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--accent)', margin: 0, fontStyle: 'italic' }}>
                      {selected.tagline}
                    </p>
                    {/* Tools under name */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
                      {selected.tools.map((tool, idx) => (
                        <span key={idx} style={{
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          padding: '4px 10px', borderRadius: 100,
                          fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)',
                        }}>{tool}</span>
                      ))}
                    </div>
                  </div>

                  {/* The Problem */}
                  <div>
                    <span style={{
                      display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--text-tertiary)', marginBottom: 8,
                    }}>The Problem</span>
                    <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                      {selected.problem}
                    </p>
                  </div>

                  {/* The Solution */}
                  <div style={{
                    background: 'var(--accent-glow)', border: '1px solid rgba(62,198,138,0.18)',
                    borderRadius: 12, padding: '16px 18px',
                  }}>
                    <span style={{
                      display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--accent)', marginBottom: 8,
                    }}>The Solution</span>
                    <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                      {selected.solution}
                    </p>
                  </div>

                  {/* What This System Does */}
                  <div>
                    <span style={{
                      display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--text-tertiary)', marginBottom: 10,
                    }}>What This System Does</span>
                    <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selected.whatItDoes.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <ArrowRight size={13} color="var(--accent)" style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next button */}
            {navBtn(goNext, <ChevronRight size={22} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Process() {
  return (
    <section id="process" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>Process</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
            letterSpacing: '-0.02em',
          }}>
            Simple. No surprises.
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Connecting dashed line */}
          <div className="process-line" style={{
            position: 'absolute', top: 26,
            left: '16.67%', right: '16.67%',
            borderTop: '1.5px dashed var(--border)',
            zIndex: 0,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }} className="process-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="process-step-col" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0 32px', position: 'relative', zIndex: 1,
              }}>
                {/* Circle node */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(62,198,138,0.08)',
                  border: '1.5px solid rgba(62,198,138,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16,
                  color: 'var(--success)',
                  marginBottom: 24, flexShrink: 0,
                  boxShadow: '0 0 0 8px var(--bg)',
                }}>
                  {step.number}
                </div>

                {/* Duration badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(62,198,138,0.07)',
                  border: '1px solid rgba(62,198,138,0.2)',
                  borderRadius: 100, padding: '4px 12px',
                  fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                  color: 'var(--success)', marginBottom: 16,
                }}>
                  <Clock size={10} />
                  {step.duration}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 18,
                  color: 'var(--text-primary)', textAlign: 'center', marginBottom: 12,
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)',
                  lineHeight: 1.65, textAlign: 'center', marginBottom: 20,
                }}>
                  {step.description}
                </p>

                {/* Effort pill */}
                <div style={{
                  marginTop: 'auto',
                  fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 100, padding: '4px 12px',
                }}>
                  {step.effort}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total time summary */}
        <p style={{
          textAlign: 'center', marginTop: 56,
          fontFamily: 'Inter', fontSize: 14, color: 'var(--text-tertiary)',
        }}>
          Most projects complete in{' '}
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>4–8 weeks</span>
          {' '}end to end.
        </p>

      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: 'var(--section-padding) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--accent)', display: 'block', marginBottom: 12
          }}>Testimonials</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            What clients say.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(62,198,138,0.05)',
              border: '1.5px solid rgba(62,198,138,0.3)',
              borderRadius: 'var(--radius-card)', padding: 32,
              display: 'flex', flexDirection: 'column', gap: 24,
              boxShadow: '0 0 0 6px var(--bg)',
            }}>
              {/* Result stat */}
              <div style={{
                background: 'rgba(62,198,138,0.06)', border: '1px solid rgba(62,198,138,0.18)',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700,
                  fontSize: 'clamp(20px, 2vw, 28px)', lineHeight: 1,
                  color: 'var(--success)', letterSpacing: '-0.02em'
                }}>{t.stat}</div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
                  marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600
                }}>{t.statLabel}</div>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'Inter', fontSize: 15, color: 'var(--text-secondary)',
                lineHeight: 1.7, fontStyle: 'italic', margin: 0, flexGrow: 1
              }}>
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>{t.name}</div>
                <div style={{ fontFamily: 'Inter', color: 'var(--text-tertiary)', fontSize: 12, marginTop: 3 }}>{t.role}</div>
              </div>
            </div>
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
const CAL_API_KEY = 'cal_live_0cde9f4dd74692719b31be9b1b3e36e5';

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
  const [booking, setBooking]     = useState(false);
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

  const handleConfirm = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Please fill in your name and email.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Please enter a valid email address.'); return;
    }
    if (!selectedSlot) return;

    setFormError('');
    setBooking(true);

    try {
      const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch('https://api.cal.com/v2/bookings', {
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
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSubmitted(true);
      } else {
        setFormError('Something went wrong. Please try again or reach out directly.');
      }
    } catch {
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setBooking(false);
    }
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
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
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

                <button onClick={handleConfirm} disabled={booking} style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none',
                  background: 'var(--gradient)', color: '#fff',
                  fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
                  cursor: booking ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.01em', width: '100%',
                  transition: 'opacity 0.15s',
                  opacity: booking ? 0.85 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
                onMouseEnter={e => { if (!booking) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { if (!booking) (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  {booking ? (
                    <>
                      <motion.svg
                        width={18} height={18} viewBox="0 0 18 18"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        style={{ flexShrink: 0 }}
                      >
                        <circle cx={9} cy={9} r={7} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                        <path d="M9 2 A7 7 0 0 1 16 9" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
                      </motion.svg>
                      Booking…
                    </>
                  ) : 'Confirm Booking'}
                </button>

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
  const annualTimeSavings = dailySavings * 260;
  const annualCostSavings = annualTimeSavings * hourlyRate;

  const sliders = [
    { label: 'Manual tasks per day',    value: tasks,        display: `${tasks}`,         min: 1,  max: 50,  step: 1,  set: setTasks },
    { label: 'Minutes per task',        value: timePerTask,  display: `${timePerTask}m`,  min: 1,  max: 120, step: 1,  set: setTimePerTask },
    { label: 'Employee hourly rate',    value: hourlyRate,   display: `$${hourlyRate}`,   min: 1,  max: 200, step: 1,  set: setHourlyRate },
  ];

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
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Quantify your time leak.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch'
        }} className="two-col">

          {/* Sliders */}
          <div className="fade-init" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
            display: 'flex', flexDirection: 'column', gap: 32
          }}>
            {sliders.map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <label style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>
                    {s.label}
                  </label>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
                    {s.display}
                  </span>
                </div>
                <input
                  type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="fade-init" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)', padding: 'var(--card-padding)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32
          }}>
            <div>
              <span style={{
                fontFamily: 'Inter', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--success)', display: 'block', marginBottom: 24, opacity: 0.85
              }}>Results</span>

              <div style={{ display: 'flex', gap: 0 }}>
                {[
                  { value: `${Math.round(annualTimeSavings)} hrs`, label: 'Recovered annually' },
                  { value: `${Math.round(annualTimeSavings / 8)}d`, label: 'Full work days back' },
                  { value: `$${annualCostSavings.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`, label: 'Potential annual savings' },
                ].map((stat, i, arr) => (
                  <div key={i} style={{ flex: 1, paddingRight: i < arr.length - 1 ? 20 : 0, borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', paddingLeft: i > 0 ? 20 : 0 }}>
                    <div style={{
                      fontFamily: 'Space Grotesk', fontWeight: 700,
                      fontSize: 'clamp(22px, 2.5vw, 34px)', lineHeight: 1,
                      color: 'var(--success)', letterSpacing: '-0.02em'
                    }}>{stat.value}</div>
                    <div style={{
                      fontFamily: 'Inter', fontSize: 11, color: 'var(--text-tertiary)',
                      marginTop: 6, lineHeight: 1.4
                    }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            <p style={{
              fontFamily: 'Inter', fontSize: 13, color: 'var(--text-tertiary)',
              lineHeight: 1.6, margin: 0
            }}>
              Based on <strong style={{ color: 'var(--text-secondary)' }}>{tasks} tasks/day</strong> at <strong style={{ color: 'var(--text-secondary)' }}>{timePerTask} min each</strong> — automated away entirely.
            </p>
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
            lineHeight: 1.1, color: 'var(--success)', fontWeight: 600,
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

function ChatWidgetToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setCtaVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const show = () => { setShowHint(true); setTimeout(() => setShowHint(false), 4000); };
    const t1 = setTimeout(show, 5000);
    const interval = setInterval(show, 15000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  const handleToggle = () => {
    const n8nToggle = document.querySelector('.chat-window-toggle') as HTMLElement;
    if (n8nToggle) { n8nToggle.click(); setIsOpen(o => !o); }
  };

  // Inject animated robot icon into n8n chat header
  useEffect(() => {
    if (!isOpen) return;
    const inject = () => {
      const header = document.querySelector('.chat-layout .chat-header');
      if (!header || header.querySelector('.ar-bot-header-icon')) return;

      const h1 = header.querySelector('h1');
      const p  = header.querySelector('p');
      const chatHeading = h1 ? (h1.closest('.chat-heading') as HTMLElement | null) || h1.parentElement : null;

      if (h1) h1.classList.add('ar-title-anim');
      if (p)  p.classList.add('ar-subtitle-anim');

      // Icon (right side, vertically centered)
      const iconWrap = document.createElement('div');
      iconWrap.className = 'ar-bot-header-icon';
      iconWrap.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="7" width="16" height="12" rx="4" fill="rgba(62,198,138,0.12)" stroke="#3EC68A" stroke-width="1.2"/>
          <circle class="ar-eye-l" cx="9" cy="12" r="2" fill="#3EC68A"/>
          <circle class="ar-eye-r" cx="15" cy="12" r="2" fill="#3EC68A"/>
          <circle cx="9.7" cy="11.3" r="0.65" fill="white"/>
          <circle cx="15.7" cy="11.3" r="0.65" fill="white"/>
          <path d="M9.5 15.5 Q12 17 14.5 15.5" stroke="#3EC68A" stroke-width="1.2" stroke-linecap="round" fill="none"/>
          <line x1="12" y1="7" x2="12" y2="4.5" stroke="#3EC68A" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="12" cy="3.5" r="1.2" fill="#3EC68A"/>
          <rect x="2" y="10.5" width="2" height="3" rx="1" fill="#3EC68A" opacity="0.55"/>
          <rect x="20" y="10.5" width="2" height="3" rx="1" fill="#3EC68A" opacity="0.55"/>
        </svg>
      `;

      // Text column: heading div (h1 + close btn) stacked over subtitle p
      const textCol = document.createElement('div');
      textCol.className = 'ar-header-text-col';
      if (chatHeading) textCol.appendChild(chatHeading);
      else if (h1) textCol.appendChild(h1);
      if (p) textCol.appendChild(p);

      // Main row: text col left, icon right (vertically centered)
      const mainRow = document.createElement('div');
      mainRow.className = 'ar-header-main-row';
      mainRow.appendChild(textCol);
      mainRow.appendChild(iconWrap);

      header.appendChild(mainRow);
    };
    const t = setTimeout(inject, 250);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const wrapper = document.querySelector('.chat-window-wrapper');
      const target = e.target as Node;
      if (wrapper && !wrapper.contains(target)) {
        const n8nToggle = document.querySelector('.chat-window-toggle') as HTMLElement;
        if (n8nToggle) n8nToggle.click();
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const bottom = ctaVisible ? 88 : 24;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const right = isMobile ? 16 : 24;

  return (
    <div style={{
      position: 'fixed', bottom, right, zIndex: 10001,
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'bottom 0.3s ease',
    }}>
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 14, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 14, scale: 0.88 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20, padding: '9px 16px',
              color: 'var(--text-primary)', fontSize: 13,
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap', pointerEvents: 'none',
            }}
          >
            Ask Ar anything ✨
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        animate={!isOpen ? {
          boxShadow: [
            '0 4px 18px rgba(62,198,138,0.35)',
            '0 4px 30px rgba(62,198,138,0.65)',
            '0 4px 18px rgba(62,198,138,0.35)',
          ],
        } : { boxShadow: '0 4px 18px rgba(62,198,138,0.35)' }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          background: '#3EC68A', border: 'none',
          borderRadius: isOpen ? '50%' : 99,
          width: isOpen ? 54 : 'auto', height: 54,
          padding: isOpen ? 0 : '0 20px 0 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 9, cursor: 'pointer',
          transition: 'border-radius 0.25s ease, width 0.25s ease, padding 0.25s ease',
          flexShrink: 0,
        }}
      >
        {isOpen ? (
          <X size={20} color="white" strokeWidth={2.5} />
        ) : (
          <>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="7" width="16" height="12" rx="4" fill="rgba(255,255,255,0.95)" />
                <circle cx="9" cy="12" r="2" fill="#3EC68A" />
                <circle cx="15" cy="12" r="2" fill="#3EC68A" />
                <circle cx="9.7" cy="11.3" r="0.65" fill="white" />
                <circle cx="15.7" cy="11.3" r="0.65" fill="white" />
                <path d="M9.5 15.5 Q12 17 14.5 15.5" stroke="#3EC68A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <line x1="12" y1="7" x2="12" y2="4.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="3.5" r="1.2" fill="rgba(255,255,255,0.9)" />
                <rect x="2" y="10.5" width="2" height="3" rx="1" fill="rgba(255,255,255,0.7)" />
                <rect x="20" y="10.5" width="2" height="3" rx="1" fill="rgba(255,255,255,0.7)" />
              </svg>
            </motion.div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: 'white', letterSpacing: '0.02em' }}>
              Ar
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}

function StickyBookCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
          className="sticky-cta"
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 200,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px',
            background: '#3EC68A',
            border: 'none', borderRadius: 99,
            color: '#fff', fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.01em',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          <CalendarDays size={15} />
          Book a Call
        </motion.button>
      )}
    </AnimatePresence>
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

  // n8n chat widget + injected brand styles
  useEffect(() => {
    createChat({
      webhookUrl: 'https://n8n.srv1598153.hstgr.cloud/webhook/d69e43cb-64ab-489f-8600-d7056651df41/chat',
      initialMessages: [
        "Hi! I'm Ar, Renthel's AI Assistant 👋",
        "What's your name and email so Renthel can follow up with you?",
      ],
      i18n: {
        en: {
          title: 'Ar',
          subtitle: "Renthel's AI Assistant",
          footer: '',
          getStarted: 'Start a conversation',
          inputPlaceholder: 'Ask me anything…',
          closeButtonTooltip: 'Close chat',
        },
      },
    });

    const chatStyle = document.createElement('style');
    chatStyle.id = 'n8n-chat-brand';
    chatStyle.textContent = `
      :root {
        --chat--color--primary: #3EC68A !important;
        --chat--color--primary-shade-50: #35b07a !important;
        --chat--color--primary--shade-100: #2d9a6b !important;
        --chat--color--secondary: #3EC68A !important;
        --chat--color-secondary-shade-50: #35b07a !important;
        --chat--color-white: #F2F2F3 !important;
        --chat--color-light: #0F1014 !important;
        --chat--color-light-shade-50: #13141A !important;
        --chat--color-light-shade-100: rgba(255,255,255,0.08) !important;
        --chat--color-medium: rgba(255,255,255,0.06) !important;
        --chat--color-dark: #F2F2F3 !important;
        --chat--color-typing: #3EC68A !important;
        --chat--border-radius: 12px !important;
        --chat--font-family: 'Inter', -apple-system, sans-serif !important;
        --chat--window--width: 380px !important;
        --chat--window--height: 560px !important;
        --chat--window--border: 1px solid rgba(255,255,255,0.07) !important;
        --chat--window--border-radius: 14px !important;
        --chat--header--background: #0F1014 !important;
        --chat--header--color: #F2F2F3 !important;
        --chat--header--border-bottom: 1px solid rgba(255,255,255,0.07) !important;
        --chat--heading--font-size: 1.05em !important;
        --chat--subtitle--font-size: 0.78em !important;
        --chat--body--background: #08090C !important;
        --chat--message--bot--background: #13141A !important;
        --chat--message--bot--color: #F2F2F3 !important;
        --chat--message--bot--border: 1px solid rgba(255,255,255,0.07) !important;
        --chat--message--user--background: #3EC68A !important;
        --chat--message--user--color: #ffffff !important;
        --chat--message--border-radius: 10px !important;
        --chat--message--font-size: 0.875rem !important;
        --chat--input--background: #0F1014 !important;
        --chat--input--text-color: #F2F2F3 !important;
        --chat--input--container--background: #13141A !important;
        --chat--input--container--border: 1px solid rgba(255,255,255,0.07) !important;
        --chat--input--container--border-radius: 10px !important;
        --chat--input--container--padding: 8px !important;
        --chat--input--send--button--color: #3EC68A !important;
        --chat--input--send--button--background: transparent !important;
        --chat--input--send--button--background-hover: rgba(62,198,138,0.12) !important;
        --chat--input--send--button--color-hover: #3EC68A !important;
        --chat--footer--background: #0F1014 !important;
        --chat--footer--color: #6B6F7A !important;
        --chat--footer--border-top: 1px solid rgba(255,255,255,0.07) !important;
        --chat--toggle--background: #3EC68A !important;
        --chat--toggle--hover--background: #35b07a !important;
        --chat--toggle--active--background: #2d9a6b !important;
        --chat--toggle--color: #ffffff !important;
        --chat--toggle--size: 54px !important;
        --chat--message--actions--color: #3EC68A !important;
        --chat--close--button--color-hover: #3EC68A !important;
      }
      .chat-window {
        box-shadow: 0 24px 64px rgba(0,0,0,0.7) !important;
        font-family: 'Inter', -apple-system, sans-serif !important;
      }
      /* hide n8n's default toggle — replaced by ChatWidgetToggle */
      .chat-window-toggle { display: none !important; }
      /* position window above our custom button (bottom 24px + height 54px + 14px gap) */
      .chat-window-wrapper { bottom: 92px !important; right: 24px !important; }
      /* ── header layout ── */
      .chat-layout .chat-header {
        padding: 14px 16px !important;
        gap: 0 !important;
      }
      /* main row: text left, icon right, both vertically centered */
      .ar-header-main-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        gap: 10px !important;
      }
      /* text column: heading (h1 + close btn) stacked tight over subtitle */
      .ar-header-text-col {
        flex: 1 !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 1px !important;
      }
      .chat-layout .chat-header .chat-heading {
        margin: 0 !important;
        padding: 0 !important;
      }
      .chat-layout .chat-header h1 {
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif !important;
        margin: 0 !important;
        line-height: 1.25 !important;
      }
      .chat-layout .chat-header p {
        color: #6B6F7A !important;
        font-family: 'Inter', sans-serif !important;
        margin: 0 !important;
        line-height: 1.25 !important;
      }
      /* ── message area spacing ── */
      .chat-messages-list {
        padding: 12px 12px !important;
        gap: 8px !important;
      }
      .chat-message {
        margin-bottom: 0 !important;
      }
      /* ── input area spacing ── */
      .chat-inputs {
        padding: 10px 12px !important;
      }
      .chat-inputs textarea {
        color: #F2F2F3 !important;
        background: transparent !important;
      }
      .chat-inputs textarea::placeholder {
        color: #6B6F7A !important;
      }
      .chat-message.chat-message-from-bot {
        font-family: 'Inter', sans-serif !important;
      }
      .chat-message.chat-message-from-user {
        font-family: 'Inter', sans-serif !important;
      }
      .chat-powered-by { display: none !important; }
      /* lift chat above sticky Book a Call button */
      body.sticky-cta-visible .chat-window-wrapper {
        bottom: 156px !important;
      }

      /* ── light mode overrides ── */
      body.light-mode {
        --chat--color-white: #111827 !important;
        --chat--color-light: #FFFFFF !important;
        --chat--color-light-shade-50: #F3F4F6 !important;
        --chat--color-light-shade-100: rgba(0,0,0,0.08) !important;
        --chat--color-medium: rgba(0,0,0,0.06) !important;
        --chat--color-dark: #111827 !important;
        --chat--window--border: 1px solid rgba(0,0,0,0.08) !important;
        --chat--header--background: #FFFFFF !important;
        --chat--header--color: #111827 !important;
        --chat--header--border-bottom: 1px solid rgba(0,0,0,0.08) !important;
        --chat--body--background: #F9FAFB !important;
        --chat--message--bot--background: #F3F4F6 !important;
        --chat--message--bot--color: #111827 !important;
        --chat--message--bot--border: 1px solid rgba(0,0,0,0.07) !important;
        --chat--input--background: #FFFFFF !important;
        --chat--input--text-color: #111827 !important;
        --chat--input--container--background: #F3F4F6 !important;
        --chat--input--container--border: 1px solid rgba(0,0,0,0.08) !important;
        --chat--footer--background: #FFFFFF !important;
        --chat--footer--color: #6B7280 !important;
        --chat--footer--border-top: 1px solid rgba(0,0,0,0.08) !important;
      }
      body.light-mode .chat-window {
        box-shadow: 0 24px 64px rgba(0,0,0,0.12) !important;
      }
      body.light-mode .chat-inputs textarea {
        color: #111827 !important;
      }
      body.light-mode .chat-inputs textarea::placeholder {
        color: #9CA3AF !important;
      }
      body.light-mode .chat-layout .chat-header p {
        color: #6B7280 !important;
        margin: 0 !important;
      }

      /* ── animated robot icon in chat header ── */
      @keyframes ar-header-float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-5px); }
      }
      @keyframes ar-blink {
        0%, 88%, 100% { transform: scaleY(1); }
        93%           { transform: scaleY(0.08); }
      }
      @keyframes ar-title-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.7; }
      }
      @keyframes ar-shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .ar-bot-header-icon {
        animation: ar-header-float 3s ease-in-out infinite;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .ar-eye-l {
        transform-origin: 9px 12px;
        animation: ar-blink 5s ease-in-out infinite;
      }
      .ar-eye-r {
        transform-origin: 15px 12px;
        animation: ar-blink 5s ease-in-out infinite 0.18s;
      }
      h1.ar-title-anim {
        animation: ar-title-pulse 3s ease-in-out infinite;
      }
      p.ar-subtitle-anim {
        background: linear-gradient(90deg, #6B6F7A 0%, #3EC68A 50%, #6B6F7A 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: ar-shimmer 4s linear infinite;
      }

      /* ── mobile: full-width chat window ── */
      @media (max-width: 480px) {
        .chat-window-wrapper {
          right: 0 !important;
          left: 0 !important;
          bottom: 86px !important;
          padding: 0 10px !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
        body.sticky-cta-visible .chat-window-wrapper {
          bottom: 150px !important;
        }
        .chat-window {
          width: 100% !important;
          max-width: 100% !important;
          height: calc(100dvh - 140px) !important;
          max-height: 580px !important;
          border-radius: 12px !important;
        }
        /* header a bit more compact on small screens */
        .chat-layout .chat-header {
          padding: 12px 14px !important;
        }
        .ar-bot-header-icon svg {
          width: 40px !important;
          height: 40px !important;
        }
      }
    `;
    document.head.appendChild(chatStyle);
    return () => {
      const el = document.getElementById('n8n-chat-brand');
      if (el) el.remove();
    };
  }, []);

  // Sync sticky-cta-visible class for chat widget positioning
  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle('sticky-cta-visible', window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

      /* ── Hero Book a Call — snake border glow ── */
      @keyframes hero-snake-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
      }

      /* outer container — just holds layers in place */
      .hero-book-call-outer {
        position: relative;
        display: inline-block;
        flex-shrink: 0;
      }

      /* blurred glow layer — slightly oversized, not clipped → the "halo" */
      .hero-book-call-glow-bg {
        position: absolute;
        inset: -5px;
        border-radius: 14px;
        overflow: hidden;
        z-index: 0;
      }
      .hero-book-call-glow-bg::before {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        width: 300%; height: 300%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 344deg,
          rgba(62,198,138,0.35) 350deg,
          rgba(168,245,210,0.5) 355deg,
          rgba(62,198,138,0.35) 360deg
        );
        animation: hero-snake-spin 3.5s linear infinite;
        filter: blur(7px);
        opacity: 0.7;
      }

      /* clip layer — overflow hidden so snake shows only at border */
      .hero-book-call-clip {
        position: relative;
        z-index: 1;
        border-radius: 10px;
        padding: 2px;
        overflow: hidden;
      }

      /* the sharp snake arc that travels around the border */
      .hero-book-call-snake {
        position: absolute;
        top: 50%; left: 50%;
        width: 300%; height: 300%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 346deg,
          #3EC68A 352deg,
          #d4fcea 356deg,
          #3EC68A 359deg,
          transparent 360deg
        );
        animation: hero-snake-spin 3.5s linear infinite;
        z-index: 0;
      }

      .hero-book-call-btn {
        position: relative;
        z-index: 1;
        background: #3EC68A;
        color: #fff;
        border: none;
        font-family: Inter, sans-serif;
        font-weight: 600;
        font-size: 15px;
        padding: 13px 28px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 150ms;
        display: block;
        white-space: nowrap;
      }

      .hero-book-call-btn:hover {
        background: #35b07a;
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

      .marquee-logo {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #f6f7f8 0%, #bdbfc1 50%, #f6f7f8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        white-space: nowrap;
        letter-spacing: -0.02em;
        opacity: 0.8;
      }
      .light-mode .marquee-logo {
        background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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

      /* ── hide desktop nav links + theme toggle on mobile, show hamburger ── */
      @media (min-width: 769px) {
        .nav-mobile-controls { display: none !important; }
      }
      @media (max-width: 768px) {
        .nav-links { display: none !important; }
      }

      @media (max-width: 1100px) {
        .hero-side-diagram { display: none; }
      }

      @media (max-width: 1024px) {
        .case-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .automation-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }

      @media (max-width: 900px) and (min-width: 641px) {
        .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
      }

      @media (max-width: 768px) {
        :root { --section-padding: 72px; --card-padding: 20px; }

        /* Grids → single column */
        .two-col, .three-col { grid-template-columns: 1fr !important; }
        .automation-grid { grid-template-columns: 1fr !important; }
        .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-grid > div:first-child { justify-content: center !important; align-items: center !important; text-align: center; }
        .about-grid > div:first-child img { max-width: 260px; width: 100%; }
        .about-grid > div:first-child > div { margin: 0 auto; }
        .calendar-grid { grid-template-columns: 1fr !important; }
        .workflow-fifth { max-width: 100% !important; }

        /* Footer */
        .footer-inner { flex-direction: column; text-align: center; align-items: center; gap: 12px; }

        /* Hero stats: stack vertically */
        .stats-row { flex-direction: column; gap: 0; }
        .stat-divider { display: none !important; }
        .stats-row > div { padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--border); width: 100%; }
        .stats-row > div:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }

        /* Results banner */
        .results-banner { flex-direction: column !important; gap: 12px !important; }
        .results-sep { display: none !important; }

        /* Workflows coverflow */
        .coverflow-stage {
          transform: scale(0.65) !important;
          transform-origin: center top !important;
          margin-bottom: -161px !important;
        }

        /* Case studies coverflow */
        .cs-coverflow-stage {
          transform: scale(0.58) !important;
          transform-origin: center top !important;
          margin-bottom: -244px !important;
        }

        /* Case study card inner layout */
        .case-grid { grid-template-columns: 1fr !important; gap: 32px !important; }

        /* Process steps less padding */
        .process-step-col { padding: 0 12px !important; }
      }

      @media (max-width: 640px) {
        :root { --section-padding: 60px; }

        /* Calendar form */
        .cal-step1-grid { grid-template-columns: 1fr !important; }
        .cal-step1-grid > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        .cal-form-grid { grid-template-columns: 1fr !important; }

        /* Testimonials */
        .testimonials-grid { grid-template-columns: 1fr !important; }

        /* Automation grid */
        .automation-grid { grid-template-columns: 1fr !important; }
      }

      @media (max-width: 720px) {
        .process-grid { grid-template-columns: 1fr !important; gap: 40px; }
        .process-line { display: none; }
      }

      @media (max-width: 540px) {
        /* Coverflow tighter */
        .coverflow-stage {
          transform: scale(0.46) !important;
          transform-origin: center top !important;
          margin-bottom: -248px !important;
        }
        .cs-coverflow-stage {
          transform: scale(0.42) !important;
          transform-origin: center top !important;
          margin-bottom: -337px !important;
        }

        /* FAQ 1-column */
        .faq-row { flex-wrap: wrap !important; justify-content: center !important; }
        .faq-row > div { width: 100% !important; }

        /* Sticky CTA smaller on small screens */
        .sticky-cta { bottom: 16px !important; right: 16px !important; font-size: 13px !important; padding: 10px 18px !important; }
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
      <StickyBookCTA />
      <ChatWidgetToggle />
      <Background theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <LogoMarquee theme={theme} />
        <About />
        <TechStack theme={theme} />
        <CaseStudies theme={theme} />
        <AutomationShowcase theme={theme} />
        <ROICalculator />
        <Process />
        <Testimonials />
        <GoogleCalendar />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
