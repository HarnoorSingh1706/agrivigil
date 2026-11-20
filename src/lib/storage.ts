import fs from "fs";
import path from "path";

export interface LeadSubmission {
  id: string;
  createdAt: string;
  role: "farmer" | "fpo" | "enterprise" | "research";
  name: string;
  phone: string;
  village: string;
  state: string;
  crop: string;
  acres?: string;
  language: string;
  email?: string;
  message?: string;
  source: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

// In-memory fallback if file system write fails in some environments
let memoryLeads: LeadSubmission[] = [
  {
    id: "sample-lead-1",
    createdAt: "2026-11-16T08:00:00.000Z",
    role: "farmer",
    name: "Gurpreet Singh (Sample)",
    phone: "9876543210",
    village: "Moga District",
    state: "Punjab",
    crop: "Cotton & Basmati",
    acres: "12",
    language: "pa",
    message: "Interested in acoustic sensor for bollworm monitoring",
    source: "Pilot Form",
  },
  {
    id: "sample-lead-2",
    createdAt: "2026-11-15T08:00:00.000Z",
    role: "fpo",
    name: "Rajesh Kumar (Sample FPO)",
    phone: "9812345678",
    village: "Nagpur Rural",
    state: "Maharashtra",
    crop: "Cotton & Soybean",
    acres: "250",
    language: "hi",
    message: "We have 40 member farmers eager to participate in trials.",
    source: "Pilot Form",
  }
];

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(memoryLeads, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not access data file, falling back to memory:", err);
  }
}

export function getLeads(): LeadSubmission[] {
  ensureDataFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading leads file:", err);
  }
  return memoryLeads;
}

export function saveLead(lead: Omit<LeadSubmission, "id" | "createdAt">): LeadSubmission {
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const current = getLeads();
  current.unshift(newLead);
  memoryLeads = current;

  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Error persisting lead to disk:", err);
  }

  return newLead;
}
