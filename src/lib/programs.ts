import progBsed from "@/assets/prog-bsed.jpg";
import progBeed from "@/assets/prog-beed.jpg";
import progIt from "@/assets/prog-it.jpg";
import progBusiness from "@/assets/prog-business.jpg";
import progHospitality from "@/assets/prog-hospitality.jpg";
import progAct from "@/assets/prog-act.jpg";
import year1 from "@/assets/year-1.jpg";
import year2 from "@/assets/year-2.jpg";
import year3 from "@/assets/year-3.jpg";
import year4 from "@/assets/year-4.jpg";

export const yearImages = [year1, year2, year3, year4];

export type YearPlan = {
  year: string;
  title: string;
  focus: string;
  subjects: string[];
  image: string;
  alt: string;
};

export type Program = {
  slug: string;
  title: string;
  desc: string;
  tag: string;
  image: string;
  alt: string;
  duration: string;
  majors: string[];
  careers: string[];
  highlight: string;
  years: YearPlan[];
};

function withImages(
  items: Omit<YearPlan, "image" | "alt">[],
  program: string,
): YearPlan[] {
  return items.map((y, i) => ({
    ...y,
    image: yearImages[i] ?? yearImages[yearImages.length - 1]!,
    alt: `${program} students during ${y.year} at Kolehiyo ng Heneral Santos`,
  }));
}

export const programs: Program[] = [
  {
    slug: "bsed",
    title: "Bachelor of Secondary Education",
    desc: "Major in English, Filipino, Mathematics, and Science. Shape the next generation of educators.",
    tag: "Education",
    image: progBsed,
    alt: "Education students in a classroom discussion at Kolehiyo ng Heneral Santos",
    duration: "4 years (8 semesters)",
    majors: ["English", "Filipino", "Mathematics", "Science"],
    careers: ["Junior/Senior High School Teacher", "Curriculum Writer", "Academic Coordinator"],
    highlight: "Includes 1 semester of supervised student teaching in partner public schools and LET review.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "Foundations of teaching",
          focus: "General education plus an introduction to the teaching profession and child development.",
          subjects: ["Purposive Communication", "Understanding the Self", "The Teaching Profession", "Mathematics in the Modern World", "Filipino sa Iba't Ibang Disiplina"],
        },
        {
          year: "Second Year",
          title: "Learning principles & major subjects",
          focus: "Educational psychology and the start of your chosen major coursework.",
          subjects: ["Facilitating Learner-Centered Teaching", "Assessment in Learning 1", "The Teacher and the Community", "Major Subjects 1–2", "Field Study 1 (Observation)"],
        },
        {
          year: "Third Year",
          title: "Methods & classroom practice",
          focus: "Teaching strategies, materials development, and deeper major specialization.",
          subjects: ["Technology for Teaching and Learning", "Curriculum Development", "Assessment in Learning 2", "Advanced Major Subjects", "Field Study 2 (Participation)"],
        },
        {
          year: "Fourth Year",
          title: "Student teaching & licensure prep",
          focus: "One full semester of supervised teaching plus intensive LET review.",
          subjects: ["Practice Teaching (In-Campus & Off-Campus)", "Teaching Internship Portfolio", "Research in Education", "LET Comprehensive Review"],
        },
      ],
      "Bachelor of Secondary Education",
    ),
  },
  {
    slug: "beed",
    title: "Bachelor of Elementary Education",
    desc: "Foundational teacher training for early-grade instruction across the core learning areas.",
    tag: "Education",
    image: progBeed,
    alt: "Elementary education students practicing classroom teaching",
    duration: "4 years (8 semesters)",
    majors: ["Generalist", "Early Childhood Education", "Special Needs Education"],
    careers: ["Elementary Teacher", "Daycare/Preschool Head", "Learning Support Specialist"],
    highlight: "Field study starts as early as second year, with hands-on practice in Calumpang schools.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "General education core",
          focus: "Language, math, and science foundations with an introduction to elementary teaching.",
          subjects: ["Purposive Communication", "Science, Technology and Society", "Child and Adolescent Development", "Foundations of Special and Inclusive Education"],
        },
        {
          year: "Second Year",
          title: "Content & early field study",
          focus: "Content courses for the elementary learning areas with school observation.",
          subjects: ["Teaching Math in the Primary Grades", "Teaching Science in Elementary", "Edukasyong Pantahanan at Pangkabuhayan", "Field Study 1 (Calumpang partner schools)"],
        },
        {
          year: "Third Year",
          title: "Strategies & assessment",
          focus: "Instructional planning, materials making, and classroom assessment.",
          subjects: ["Teaching Literacy in the Elementary Grades", "Assessment in Learning 1 & 2", "Technology for Teaching and Learning", "Field Study 2 (Participation)"],
        },
        {
          year: "Fourth Year",
          title: "Practice teaching & research",
          focus: "Full-time practicum in partner elementary schools plus an action research study.",
          subjects: ["Practice Teaching", "Action Research", "Teaching Internship Portfolio", "LET Review"],
        },
      ],
      "Bachelor of Elementary Education",
    ),
  },
  {
    slug: "bsit",
    title: "BS in Information Technology",
    desc: "Programming, networking, and systems management for the digital economy of SOCCSKSARGEN.",
    tag: "Technology",
    image: progIt,
    alt: "Information technology students working on computers in the campus laboratory",
    duration: "4 years (8 semesters)",
    majors: ["Web & Mobile Development", "Network Administration", "Database Systems"],
    careers: ["Software Developer", "Network Engineer", "IT Support Specialist", "Systems Analyst"],
    highlight: "486 hours of industry internship plus preparation for global IT certifications.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "Computing fundamentals",
          focus: "Programming logic, computer basics, and general education subjects.",
          subjects: ["Introduction to Computing", "Computer Programming 1 & 2", "Discrete Mathematics", "Purposive Communication"],
        },
        {
          year: "Second Year",
          title: "Core IT systems",
          focus: "Data structures, databases, and networking foundations.",
          subjects: ["Data Structures and Algorithms", "Database Management Systems", "Data Communications and Networking 1", "Object-Oriented Programming"],
        },
        {
          year: "Third Year",
          title: "Specialization tracks",
          focus: "Web/mobile development, network administration, or database systems, plus systems analysis.",
          subjects: ["Web Systems and Technologies", "Mobile Application Development", "Network Administration", "Information Assurance and Security", "Systems Integration and Architecture"],
        },
        {
          year: "Fourth Year",
          title: "Capstone & internship",
          focus: "Capstone project defense and 486 hours of supervised industry internship.",
          subjects: ["Capstone Project 1 & 2", "IT Practicum (486 hours)", "IT Certification Review", "Professional Ethics in IT"],
        },
      ],
      "BS in Information Technology",
    ),
  },
  {
    slug: "bsba",
    title: "BS in Business Administration",
    desc: "Management, marketing, and finance tracks that build tomorrow's local entrepreneurs.",
    tag: "Business",
    image: progBusiness,
    alt: "Business administration students in a group presentation",
    duration: "4 years (8 semesters)",
    majors: ["Marketing Management", "Financial Management", "Human Resource Management"],
    careers: ["Business Owner", "Marketing Officer", "HR Associate", "Bank Operations Staff"],
    highlight: "Capstone business plan competition judged by GenSan entrepreneurs and industry leaders.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "Business foundations",
          focus: "Accounting basics, economics, and general education.",
          subjects: ["Fundamentals of Accounting", "Basic Microeconomics", "Business Mathematics", "Purposive Communication"],
        },
        {
          year: "Second Year",
          title: "Core management",
          focus: "Operations, marketing, and finance principles across all tracks.",
          subjects: ["Principles of Management", "Marketing Management", "Business Law and Regulations", "Human Resource Management"],
        },
        {
          year: "Third Year",
          title: "Major specialization",
          focus: "Marketing, financial, or HR management track subjects with local case studies.",
          subjects: ["Strategic Management", "Financial Management", "Consumer Behavior / Compensation Management", "Entrepreneurial Management"],
        },
        {
          year: "Fourth Year",
          title: "Business plan & practicum",
          focus: "Capstone business plan competition and 600 hours of company practicum.",
          subjects: ["Business Research / Feasibility Study", "Capstone Business Plan", "Business Practicum", "Professional Ethics"],
        },
      ],
      "BS in Business Administration",
    ),
  },
  {
    slug: "bshm",
    title: "BS in Hospitality Management",
    desc: "Hotel, restaurant, and tourism operations training anchored on GenSan's thriving industry.",
    tag: "Hospitality",
    image: progHospitality,
    alt: "Hospitality management students in uniform during hotel and restaurant training",
    duration: "4 years (8 semesters)",
    majors: ["Hotel Operations", "Food & Beverage Services", "Tourism & Events"],
    careers: ["Hotel Supervisor", "Restaurant Manager", "Cruise Ship Crew", "Events Organizer"],
    highlight: "On-campus training kitchen and mock hotel rooms, plus local and overseas practicum options.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "Service industry basics",
          focus: "Introduction to tourism and hospitality with core service skills.",
          subjects: ["Macro Perspective of Tourism and Hospitality", "Risk, Crisis and Safety Management", "Kitchen Essentials and Basic Food Preparation", "Purposive Communication"],
        },
        {
          year: "Second Year",
          title: "Operations training",
          focus: "Front office, housekeeping, and food & beverage service in campus facilities.",
          subjects: ["Front Office Operations", "Housekeeping Operations", "Food and Beverage Service", "Quality Service Management"],
        },
        {
          year: "Third Year",
          title: "Advanced & events",
          focus: "Culinary arts, events planning, and hospitality supervision.",
          subjects: ["Culinary Arts and Bar Operations", "Events Management", "Tourism Planning and Development", "Legal Aspects in Hospitality"],
        },
        {
          year: "Fourth Year",
          title: "Practicum & capstone",
          focus: "Local or overseas practicum in hotels and restaurants plus a research capstone.",
          subjects: ["Hospitality Practicum (local/international)", "Research in Hospitality Management", "Entrepreneurship in Hospitality", "Professional Development"],
        },
      ],
      "BS in Hospitality Management",
    ),
  },
  {
    slug: "act",
    title: "Associate in Computer Technology",
    desc: "A two-year ladderized pathway into IT careers and further degree studies.",
    tag: "Technology",
    image: progAct,
    alt: "Computer technology students assembling and troubleshooting hardware",
    duration: "2 years (4 semesters), ladderized",
    majors: ["Computer Hardware Servicing", "Office Productivity", "Basic Programming"],
    careers: ["Computer Technician", "Encoder/Data Staff", "Junior IT Support"],
    highlight: "Credits fully transfer into the BS Information Technology program after graduation.",
    years: withImages(
      [
        {
          year: "First Year",
          title: "Hardware & software basics",
          focus: "Computer servicing, office productivity, and introductory programming.",
          subjects: ["Introduction to Computing", "Computer Hardware Servicing", "Office Productivity Tools", "Programming Fundamentals"],
        },
        {
          year: "Second Year",
          title: "Applied IT skills",
          focus: "Networking basics, web fundamentals, and on-the-job training.",
          subjects: ["Computer Networking Basics", "Web Page Development", "Database Fundamentals", "On-the-Job Training"],
        },
      ],
      "Associate in Computer Technology",
    ),
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
