import progBsed from "@/assets/prog-bsed.jpg";
import progBeed from "@/assets/prog-beed.jpg";
import progIt from "@/assets/prog-it.jpg";
import progBusiness from "@/assets/prog-business.jpg";
import progHospitality from "@/assets/prog-hospitality.jpg";
import progAct from "@/assets/prog-act.jpg";

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
};

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
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
