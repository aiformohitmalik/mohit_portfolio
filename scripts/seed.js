/**
 * Seed Script — Populates MongoDB with hierarchical RAG knowledge base
 * 
 * Run: node scripts/seed.js
 * 
 * Creates:
 *   - 1 Profile (L1) — always injected as context breadcrumb
 *   - 8 Sections (L2) — coarse search targets
 *   - ~21 Chunks (L3) — fine-grained details
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from server/.env
dotenv.config({ path: join(__dirname, '../server/.env') });

// Import models
import Profile from '../server/models/Profile.js';
import Section from '../server/models/Section.js';
import Chunk from '../server/models/Chunk.js';

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ No MONGODB_URI found in environment. Cannot seed.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB.');

  // ── Drop existing collections (safe to re-run) ─────────────────────────
  console.log('🗑️  Clearing existing RAG collections...');
  await Profile.deleteMany({});
  await Section.deleteMany({});
  await Chunk.deleteMany({});

  // ══════════════════════════════════════════════════════════════════════════
  // L1 — PROFILE (1 document, always injected)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📝 Seeding Profile (L1)...');
  const profile = await Profile.create({
    level: 1,
    category: 'profile',
    summary:
      'Mohit Malik is a Physical AI Engineer and Robotic Simulation Engineer with 2+ years at EDAG PS India specializing in BIW plant simulations, digital twin development using NVIDIA Omniverse (OpenUSD), and robotic OLP using Siemens Process Simulate. He is also the Founder and Ex-CTO of Ground Rebotics Pvt. Ltd., a deep-tech startup incubated at AIC IIT Delhi that raised ₹16 Lakhs in government funding. He holds a B.Tech in Mechanical Engineering with University Gold Medal from GJUS&T Hisar. He is currently based in Gurgaon/Rohtak, Haryana, India.',
    keywords: [
      'Mohit Malik', 'Physical AI', 'robotic simulation', 'digital twin',
      'NVIDIA Omniverse', 'OpenUSD', 'Siemens Process Simulate', 'BIW',
      'EDAG', 'Ground Rebotics', 'startup', 'IIT Delhi', 'gold medal',
      'mechanical engineering', 'OLP', 'Gaussian Splatting',
    ],
  });
  console.log(`   ✅ Profile created: ${profile._id}`);

  // ══════════════════════════════════════════════════════════════════════════
  // L2 — SECTIONS (8 documents)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📝 Seeding Sections (L2)...');

  const experienceSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'experience',
    title: 'Professional Experience',
    summary:
      'Mohit has 2+ years at EDAG PS India as a Robotic Simulation Engineer, working on BIW plant automation to BMW standards and digital twin development using NVIDIA Omniverse. Before that, he founded and served as CTO of Ground Rebotics Pvt. Ltd. for 3 years at AIC IIT Delhi.',
    keywords: [
      'EDAG', 'robotic simulation', 'BIW', 'BMW', 'digital twin',
      'Omniverse', 'Ground Rebotics', 'CTO', 'founder', 'startup',
      'experience', 'work', 'career', 'job', 'employment',
    ],
  });

  const skillsSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'skills',
    title: 'Technical Skills',
    summary:
      'Mohit\'s skill domains span Simulation & OLP (Siemens Process Simulate, path planning), Digital Twin & Omniverse (NVIDIA Kit, OpenUSD, Gaussian Splatting), CAD & Mechanical Design (SolidWorks, CATIA, Fusion 360), Additive Manufacturing (FDM, SLA, SLS), IoT & Embedded Systems (Arduino, LoRa, PLC), and Programming & AI Tools (Python, MATLAB, UiPath RPA).',
    keywords: [
      'skills', 'simulation', 'OLP', 'CAD', 'SolidWorks', 'CATIA',
      'digital twin', 'Omniverse', 'Python', 'MATLAB', 'IoT', 'Arduino',
      'additive manufacturing', '3D printing', 'programming', 'tools',
      'Gaussian Splatting', 'RPA', 'PLC', 'LoRa',
    ],
  });

  const projectsSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'projects',
    title: 'Startup Projects (Ground Rebotics)',
    summary:
      'At Ground Rebotics, Mohit led two major projects: GVIC (Smart Canal Irrigation System funded under NIDHI PRAYAS with up to ₹10 Lakhs, incubated at AIC IIT Delhi) and SWAN (Water Quality Telemetry device funded under RUSA 2.0 with up to ₹6 Lakhs). Both focused on IoT-based smart agriculture solutions.',
    keywords: [
      'GVIC', 'SWAN', 'project', 'Ground Rebotics', 'startup',
      'irrigation', 'water quality', 'IoT', 'NIDHI PRAYAS', 'RUSA',
      'agriculture', 'telemetry', 'LoRa', 'funding',
    ],
  });

  const educationSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'education',
    title: 'Education',
    summary:
      'Mohit holds a B.Tech. (Honours) in Mechanical Engineering from GJUS&T Hisar (2020-2024), graduating as University Gold Medallist and the first student in the Mechanical Department to achieve a B.Tech. Honours degree. He completed intermediate schooling at H.D. Public School, Rohtak (CBSE) and matriculation at S.G.S.A.M.N.E.M. School, Indore (CBSE).',
    keywords: [
      'education', 'degree', 'B.Tech', 'mechanical engineering',
      'gold medal', 'university', 'GJUST', 'honours', 'college',
      'school', 'CBSE', 'academic',
    ],
  });

  const leadershipSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'leadership',
    title: 'Leadership & Extracurricular',
    summary:
      'Mohit founded iConnect, the Entrepreneurship & Innovation Society at GJUS&T Hisar, growing it to 60+ members and hosting the university\'s first Techfest with 2000+ attendees. He also served in the NCC (3rd HR Battalion) earning C-Certificate with Alpha Grade and Best Cadet award, and competed in state-level Karate championships representing Haryana.',
    keywords: [
      'iConnect', 'leadership', 'founder', 'entrepreneurship', 'Techfest',
      'NCC', 'karate', 'extracurricular', 'society', 'mentor',
      'Student of the Year', 'campus', 'sports',
    ],
  });

  const internshipsSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'internships',
    title: 'Internships & Training',
    summary:
      'Mohit completed internships at Exobot Dynamics (bionic hand design at AIC IIT Delhi), PNT Robotics (mechanical CAD design), and MSME Technology Centres (CAD-CAM training with CNC programming and SolidWorks). He also completed a Management Development Programme at MSME DFO Karnal covering digital marketing.',
    keywords: [
      'internship', 'Exobot Dynamics', 'PNT Robotics', 'MSME', 'CNC',
      'SolidWorks', 'training', 'bionic hand', 'CAD-CAM', 'design',
      'mechanical design', 'intern',
    ],
  });

  const certificationsSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'certifications',
    title: 'Certifications & Courses',
    summary:
      'Mohit holds NPTEL Stars designation with 9 NPTEL courses from IITs (including All India Rank 5 in Fundamental & Conceptual Design from IIT Madras). Industry certifications include HackerRank Python Problem Solving, AI Mastermind Programme, UiPath RPA Developer, and MATLAB/Simulink from MathWorks.',
    keywords: [
      'NPTEL', 'certification', 'course', 'HackerRank', 'UiPath',
      'MATLAB', 'AI', 'Python', 'robotics', 'SWAYAM', 'IIT',
      'training', 'certificate', 'NPTEL Stars',
    ],
  });

  const contactSection = await Section.create({
    level: 2,
    parentId: profile._id,
    category: 'contact',
    title: 'Contact Information',
    summary:
      'Mohit can be reached via email at mohitkumarmalik100@gmail.com or phone at +91 92534 67437. His LinkedIn is linkedin.com/in/mohit--malik. He is based in Rohtak/Gurgaon, Haryana, India and is open to opportunities in Physical AI, digital twin development, and robotic simulation.',
    keywords: [
      'contact', 'email', 'phone', 'LinkedIn', 'hire', 'reach',
      'connect', 'available', 'location', 'opportunity',
    ],
  });

  console.log(`   ✅ 8 Sections created.`);

  // ══════════════════════════════════════════════════════════════════════════
  // L3 — CHUNKS (~21 documents)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📝 Seeding Chunks (L3)...');

  const chunks = [
    // ── Experience chunks (3) ─────────────────────────────────────────────
    {
      parentId: experienceSection._id,
      category: 'experience',
      text: 'At EDAG PS India (Jan 2026 – Present), Mohit works on Digital Twin & Omniverse Development: developing Python-based Omniverse Kit extensions for interactive real-time digital twin environments, building USD-based modular workflows for complex virtual plant integration, and implementing Gaussian Splatting pipelines for high-fidelity 3D reconstruction and immersive industrial visualization. Technologies: NVIDIA Omniverse, OpenUSD, Gaussian Splatting, Python, Digital Twin, Virtual Plants.',
      keywords: ['EDAG', 'digital twin', 'Omniverse', 'OpenUSD', 'Gaussian Splatting', 'Python', 'Kit extensions', 'virtual plant'],
    },
    {
      parentId: experienceSection._id,
      category: 'experience',
      text: 'At EDAG PS India (Jun 2024 – Jan 2026), Mohit worked on BIW Plant Automation following BMW standards: designing Body in White production cells including custom fixtures, frames, and full plant layouts for automotive manufacturing. He performed advanced robotic path simulations using Siemens Process Simulate to optimize cycle times and validate collision-free runs. He developed, tested, and validated Offline Programming (OLP) configurations with optimized, collision-safe robot path planning. Technologies: Siemens Process Simulate, OLP & Path Planning, BIW Validation, BMW Standards, Fixture Design.',
      keywords: ['EDAG', 'BIW', 'BMW', 'robotic simulation', 'Process Simulate', 'OLP', 'path planning', 'fixture', 'automotive'],
    },
    {
      parentId: experienceSection._id,
      category: 'experience',
      text: 'At Ground Rebotics Pvt. Ltd. (Jan 2021 – Jun 2024), Mohit served as Founder and CTO, based at AIC IIT Delhi. He built a deep-tech startup in smart agriculture and IoT, scaling from a university lab into IIT Delhi incubation. He led cross-functional teams, secured ₹16 Lakhs in government funding (NIDHI PRAYAS + RUSA 2.0), and pitched at 10+ national startup stages including IIT Roorkee, IIT Kharagpur, IIT Jodhpur, IIT Mandi, and NIT Kurukshetra. He won 5 first prizes and multiple finalist positions at national competitions. Technologies: Team Leadership, Government Grants, FDM 3D Printing, IoT Systems, Product Strategy.',
      keywords: ['Ground Rebotics', 'founder', 'CTO', 'startup', 'IIT Delhi', 'funding', 'smart agriculture', 'IoT', 'pitching', 'awards'],
    },

    // ── Skills chunks (6) ─────────────────────────────────────────────────
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'Simulation & OLP (Advanced): Siemens Process Simulate (4/5), OLP & Path Planning (4/5), BIW Validation (4/5), DELMIA (2/5). These are Mohit\'s primary professional daily-driver tools at EDAG for robotic simulation and offline programming.',
      keywords: ['simulation', 'OLP', 'Process Simulate', 'BIW', 'DELMIA', 'path planning', 'robotic'],
    },
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'Digital Twin & Omniverse (Advanced): NVIDIA Omniverse Kit (3/5), OpenUSD Workflows (3/5), Gaussian Splatting (3/5), Python for Omniverse (3/5). This is Mohit\'s current key R&D domain at EDAG for digital twin development.',
      keywords: ['digital twin', 'Omniverse', 'OpenUSD', 'Gaussian Splatting', 'NVIDIA', 'Python'],
    },
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'CAD & Mechanical Design (Advanced): SolidWorks 3D & Assembly (4/5), CATIA 2D Drafting (3/5), Fusion 360 (3/5), Siemens UG NX (2/5), AutoCAD (2/5). Core structural and assembly foundations from B.Tech and startups.',
      keywords: ['CAD', 'SolidWorks', 'CATIA', 'Fusion 360', 'NX', 'AutoCAD', 'mechanical design', 'assembly'],
    },
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'IoT & Embedded Systems (Proficient): Arduino Microcontrollers (3/5), LoRa LPWAN Protocol (3/5), IoT Sensor Integrations (3/5), PLC Concepts Siemens TIA (2/5), ENCO WinNC Sinumerik CNC (3/5). Hardware-software integration developed for the Ground Rebotics agricultural startup.',
      keywords: ['IoT', 'Arduino', 'LoRa', 'PLC', 'CNC', 'embedded', 'sensors', 'microcontroller'],
    },
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'Programming & AI Tools (Familiar): Python Programming (3/5), MATLAB / Simulink (2/5), UiPath Robotic Process Automation (2/5), ANSYS Workbench (2/5). Scripting, numeric analysis, and process automation tools.',
      keywords: ['Python', 'MATLAB', 'Simulink', 'UiPath', 'RPA', 'ANSYS', 'programming', 'AI'],
    },
    {
      parentId: skillsSection._id,
      category: 'skills',
      text: 'Additive Manufacturing (Proficient): FDM with Ultimaker S5 (4/5), SLA/DLP/SLS Prototyping (3/5), Thermoplastic Material Testing of 50+ materials (3/5). Hands-on research and prototyping with high-precision setups. Mohit performed a systematic FDM accuracy study across PLA, Tough PLA, TPU 95A, and ABS.',
      keywords: ['additive manufacturing', '3D printing', 'FDM', 'SLA', 'SLS', 'Ultimaker', 'prototyping', 'thermoplastic'],
    },

    // ── Projects chunks (2) ───────────────────────────────────────────────
    {
      parentId: projectsSection._id,
      category: 'projects',
      text: 'GVIC — Smart Canal Irrigation System (2024): A LoRa-based low-power flood irrigation system designed to automate and optimize water distribution for canal-based farming. Funded under NIDHI PRAYAS with up to ₹10 Lakhs. Incubated at AIC IIT Delhi for field validation. Uses IoT telemetry for real-time monitoring and control of irrigation gates.',
      keywords: ['GVIC', 'irrigation', 'LoRa', 'NIDHI PRAYAS', 'IIT Delhi', 'agriculture', 'IoT', 'canal'],
    },
    {
      parentId: projectsSection._id,
      category: 'projects',
      text: 'SWAN — Water Quality Telemetry (2022-2023): An IoT-enabled telemetry floating device for real-time water quality tracking in aquaculture environments. Funded under RUSA 2.0 with up to ₹6 Lakhs. Recognized across multiple national green-tech frameworks. Uses sensor arrays for pH, dissolved oxygen, turbidity, and temperature monitoring.',
      keywords: ['SWAN', 'water quality', 'telemetry', 'RUSA', 'aquaculture', 'IoT', 'sensor', 'green-tech'],
    },

    // ── Education chunks (2) ──────────────────────────────────────────────
    {
      parentId: educationSection._id,
      category: 'education',
      text: 'B.Tech. Mechanical Engineering (Honours) from Guru Jambheshwar University of Science & Technology (GJUS&T), Hisar, Haryana (2020-2024). NBA Accredited Course. Awarded University Gold Medal — graduated top of the 2020-2024 Mechanical engineering cohort. First student in the Mechanical Department to achieve a B.Tech. Honours degree, maintaining the highest academic rank throughout.',
      keywords: ['B.Tech', 'mechanical engineering', 'gold medal', 'GJUST', 'honours', 'university', 'NBA', 'academic'],
    },
    {
      parentId: educationSection._id,
      category: 'education',
      text: 'Schooling: Intermediate (Class XII) at H.D. Public School, Rohtak, Haryana (CBSE, 2019-2020). Matriculation (Class X) at S.G.S.A.M.N.E.M. School, Indore, Madhya Pradesh (CBSE, 2017-2018).',
      keywords: ['school', 'CBSE', 'intermediate', 'matriculation', 'Rohtak', 'Indore'],
    },

    // ── Leadership chunks (2) ─────────────────────────────────────────────
    {
      parentId: leadershipSection._id,
      category: 'leadership',
      text: 'Mohit founded iConnect — the Entrepreneurship & Innovation Society at GJUS&T Hisar in October 2023. Within 4 months, it grew to 60+ members with 14 core team members. Hosted the university\'s first Techfest with 10+ events and 2000+ external attendees. Integrated the Smart India Hackathon (SIH) internal selection process. The organization was merged with the pre-existing Entrepreneurship Club to become the official innovation body of GJUS&T. Mohit now serves as mentor after stepping down from active captaincy.',
      keywords: ['iConnect', 'founder', 'entrepreneurship', 'Techfest', 'SIH', 'GJUST', 'innovation', 'society', 'leadership', 'mentor'],
    },
    {
      parentId: leadershipSection._id,
      category: 'leadership',
      text: 'NCC & Athletics: Mohit served in the 3rd HR Battalion NCC (2021-2024), earning the C-Certificate with Alpha Grade (highest military training marks) and Best Cadet award at Annual Training Camp-199. Won 1st Prize in Weapon Proficiency at ATC-110. He represented Haryana State at regional and state-level karate championships (2021-2024). Awarded Student of the Year at Udaan Fest 2022, GJUS&T. Earned Cult Ninja Consistency Recognition from Cult.fit (2025-Present).',
      keywords: ['NCC', 'karate', 'sports', 'military', 'cadet', 'athlete', 'fitness', 'awards', 'Student of the Year'],
    },

    // ── Internships chunks (3) ────────────────────────────────────────────
    {
      parentId: internshipsSection._id,
      category: 'internships',
      text: 'Design and Research Intern at Exobot Dynamics Pvt. Ltd., AIC IIT Delhi (Jun-Jul 2023): Resolved critical mechanical tolerance issues in a bionic hand\'s PIP joint, engineering precision fit down to 0.01mm. Performed static & dynamic FEA analysis and iterated complex geometric designs for functional optimization.',
      keywords: ['Exobot Dynamics', 'bionic hand', 'IIT Delhi', 'FEA', 'tolerance', 'mechanical design', 'intern'],
    },
    {
      parentId: internshipsSection._id,
      category: 'internships',
      text: 'CAD-CAM Training at MSME Technology Centre, Rohtak (Sep-Nov 2023): Completed 200-hour professional training in CNC programming using Sinumerik EMCO WinNC with 20+ unique programs. Gained hands-on exposure to turning, milling, drilling, boring, grooving, and engraving. Management Development Programme at MSME DFO Karnal (Nov-Dec 2022): Government-certified training in digital marketing and online business growth.',
      keywords: ['MSME', 'CNC', 'CAD-CAM', 'Sinumerik', 'machining', 'training', 'digital marketing'],
    },
    {
      parentId: internshipsSection._id,
      category: 'internships',
      text: 'Mechanical Design Internship at PNT Robotics, Maharashtra (Jul-Aug 2022): Delivered detailed 3D CAD designs and mechanical interaction models using SolidWorks. SolidWorks Training at MSME Technology Centre, Rohtak (Jul-Aug 2022): Modeled 50+ parametric engineering parts and detail assemblies with efficient drafting workflows.',
      keywords: ['PNT Robotics', 'SolidWorks', 'mechanical design', 'CAD', 'parametric', 'intern'],
    },

    // ── Certifications chunks (2) ─────────────────────────────────────────
    {
      parentId: certificationsSection._id,
      category: 'certifications',
      text: 'NPTEL Stars designation from Ministry of Education, Govt. of India. Completed 9 NPTEL/SWAYAM courses from premier IITs: Robotics (IIT Kharagpur), Advanced Robotics (IIT Kanpur), German-I (IIT Madras), Fundamental & Conceptual Design with All India Rank 5 (IIT Madras), Programming and DSA in Python (IIT Bombay), Understanding Incubation and Entrepreneurship (IIT Bombay), Introduction to IoT (IIT Kharagpur), The Joy of Computing using Python (IIT Ropar), Fundamentals of AI (IIT Guwahati).',
      keywords: ['NPTEL', 'SWAYAM', 'IIT', 'robotics', 'Python', 'AI', 'IoT', 'certification', 'NPTEL Stars', 'rank'],
    },
    {
      parentId: certificationsSection._id,
      category: 'certifications',
      text: 'Industry Certifications: Problem Solving using Python from HackerRank (Dec 2025), AI Mastermind Programme from Outskill (Sep 2025), Barclays LifeSkills Recruitment Training from GTT Foundation (Oct 2023), MATLAB and Simulink Onramp from MathWorks (Aug 2023), Python with DSA from YBI Foundation (Jul 2023), RPA Developer from UiPath (May 2023), Aptitude Training from TIME Institute (Jan 2023). LinkedIn Learning: Negotiating with Chris Voss, Leadership Mindsets, Time Management, AI in Project Management.',
      keywords: ['HackerRank', 'UiPath', 'RPA', 'MATLAB', 'AI', 'Python', 'certification', 'Barclays', 'LinkedIn Learning'],
    },

    // ── Contact chunk (1) ─────────────────────────────────────────────────
    {
      parentId: contactSection._id,
      category: 'contact',
      text: 'Contact Mohit Malik: Email mohitkumarmalik100@gmail.com, Phone +91 92534 67437, LinkedIn linkedin.com/in/mohit--malik. Location: Rohtak / Gurgaon, Haryana, India. Mohit is open to opportunities in Physical AI engineering, digital twin development, robotic simulation, and Industry 5.0 roles. He can also be reached through the portfolio contact form.',
      keywords: ['contact', 'email', 'phone', 'LinkedIn', 'hire', 'opportunity', 'location', 'available'],
    },
  ];

  const createdChunks = await Chunk.insertMany(chunks);
  console.log(`   ✅ ${createdChunks.length} Chunks created.`);

  // ── Verify counts ───────────────────────────────────────────────────────
  const profileCount = await Profile.countDocuments();
  const sectionCount = await Section.countDocuments();
  const chunkCount = await Chunk.countDocuments();

  console.log('\n═══════════════════════════════════════════');
  console.log(`📊 Seed Complete:`);
  console.log(`   Profiles (L1): ${profileCount}`);
  console.log(`   Sections (L2): ${sectionCount}`);
  console.log(`   Chunks   (L3): ${chunkCount}`);
  console.log(`   Total documents: ${profileCount + sectionCount + chunkCount}`);
  console.log('═══════════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed script failed:', err);
  process.exit(1);
});
