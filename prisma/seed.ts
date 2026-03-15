import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed jobs from the original jobs.json content
  const jobs = [
    {
      slug: "dachdecker-spengler",
      titleDe: "Dachdecker/Spengler (m/w/d)",
      titleEn: "Roofer/Metalworker (m/f/d)",
      isApprenticeship: false,
      sortOrder: 0,
      tasksDe: [
        "Steil- und Flachdacheindeckung und -sanierung",
        "Dachfenster-, Abdichtungs- und Dämmungsarbeiten",
        "Reparatur- und Wartungsarbeiten",
        "Zusammenarbeit im Team mit Spenglern und Glasern",
      ],
      tasksEn: [
        "Pitched and flat roof installation and renovation",
        "Skylight, sealing and insulation work",
        "Repair and maintenance work",
        "Team collaboration with metalworkers and glaziers",
      ],
      requirementsDe: [
        "Abgeschlossene Lehre als Dachdecker oder vergleichbare Qualifikation",
        "Handwerkliches Geschick und technisches Verständnis",
        "Zuverlässige, selbstständige und sorgfältige Arbeitsweise",
        "Teamfähigkeit und Motivation",
      ],
      requirementsEn: [
        "Completed roofing apprenticeship or comparable qualification",
        "Craft skills and technical understanding",
        "Reliable, independent and careful work approach",
        "Team capability and motivation",
      ],
      benefitsDe: [
        "Sicherer Arbeitsplatz in einem etablierten Meisterbetrieb",
        "Faire Entlohnung und langfristige Perspektiven",
        "Eingespieltes Team mit kollegialem Arbeitsklima",
        "Moderne Ausrüstung und vielfältige Projekte im Raum Saalfelden",
        "Weiterbildungsmöglichkeiten",
      ],
      benefitsEn: [
        "Secure employment in an established master craftsman workshop",
        "Fair compensation and long-term perspectives",
        "Established team with collegial workplace culture",
        "Modern equipment and diverse projects in the Saalfelden area",
        "Professional development opportunities",
      ],
    },
    {
      slug: "schwarzdecker",
      titleDe: "Schwarzdecker (m/w/d)",
      titleEn: "Flat Roof Specialist (m/f/d)",
      isApprenticeship: false,
      sortOrder: 1,
      tasksDe: [
        "Flachdacheindeckung und Abdichtung mit Bitumen oder Kunststoffbahnen",
        "Dachsanierung und Instandhaltung",
        "Aufbereitung und Verarbeitung von Dämmmaterialien",
        "Sicheres Arbeiten auf dem Dach nach Sicherheitsrichtlinien",
      ],
      tasksEn: [
        "Flat roof installation and sealing with bitumen or plastic sheeting",
        "Roof renovation and maintenance",
        "Preparation and processing of insulation materials",
        "Safe roof work following safety guidelines",
      ],
      requirementsDe: [
        "Abgeschlossene Lehre als Schwarzdecker, Dachdecker oder vergleichbare Ausbildung",
        "Handwerkliches Geschick und Verantwortungsbewusstsein",
        "Selbstständige und zuverlässige Arbeitsweise",
        "Teamfähigkeit und Freude am Beruf",
      ],
      requirementsEn: [
        "Completed flat roof specialist, roofer or comparable apprenticeship",
        "Craft skills and responsibility",
        "Independent and reliable work approach",
        "Team capability and job enthusiasm",
      ],
      benefitsDe: [
        "Sicherer Arbeitsplatz in einem familiengeführten Meisterbetrieb",
        "Leistungsgerechte Entlohnung und langfristige Perspektive",
        "Modernes Werkzeug und qualitativ hochwertige Arbeitskleidung",
        "Starkes Team mit fairem, kollegialem Miteinander",
        "Projekte im Pinzgau, in Tirol, der Stadt Salzburg und in Oberbayern",
      ],
      benefitsEn: [
        "Secure employment in a family-run master craftsman workshop",
        "Performance-based compensation and long-term perspective",
        "Modern tools and quality work clothing",
        "Strong team with fair, collegial collaboration",
        "Projects across Pinzgau, Tyrol, Salzburg city and Upper Bavaria",
      ],
    },
    {
      slug: "lehrstelle-dachdecker-spengler",
      titleDe: "Lehrstelle als Dachdecker/Spengler (m/w/d)",
      titleEn: "Apprenticeship – Roofer/Metalworker (m/f/d)",
      isApprenticeship: true,
      sortOrder: 2,
      durationDe: "4-jährige Doppellehre",
      durationEn: "4-year dual apprenticeship",
      tasksDe: [
        "Fundierte Ausbildung in zwei anerkannten Lehrberufen",
        "Praxisnahes Arbeiten an Dächern, Fassaden und in der Metallverarbeitung",
        "Mitarbeit bei Neubau-, Sanierungs- und Reparaturprojekten",
        "Begleitung durch erfahrene Teammitglieder",
        "Abwechslungsreiche Projekte im Pinzgau, in Tirol, der Stadt Salzburg und in Oberbayern",
      ],
      tasksEn: [
        "Foundational training in two recognized apprenticeship professions",
        "Hands-on work on roofs, facades and metalwork",
        "Participation in new construction, renovation and repair projects",
        "Support from experienced team members",
        "Diverse projects across Pinzgau, Tyrol, Salzburg city and Upper Bavaria",
      ],
      requirementsDe: [
        "Interesse an handwerklicher Arbeit und Arbeit im Freien",
        "Technisches Verständnis und handwerkliches Geschick",
        "Verlässlichkeit, Motivation und Teamgeist",
        "Körperliche Fitness und Freude an Herausforderungen",
      ],
      requirementsEn: [
        "Interest in crafts and outdoor work",
        "Technical understanding and craft skills",
        "Reliability, motivation and teamwork",
        "Physical fitness and enthusiasm for challenges",
      ],
      benefitsDe: [
        "Spannende Lehre mit Zukunftsperspektive und Aufstiegschancen",
        "Tolles Team und familiäre Arbeitsatmosphäre",
        "Faire Entlohnung lt. KV inkl. Lehrlingsprämien",
        "Gute Übernahmechancen nach erfolgreich abgelegter Lehrabschlussprüfung",
      ],
      benefitsEn: [
        "Exciting apprenticeship with future prospects and advancement opportunities",
        "Great team and familial work atmosphere",
        "Fair compensation per collective agreement including apprentice bonuses",
        "Strong chances of employment following successful apprenticeship exam",
      ],
    },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    });
  }

  console.log(`Seeded ${jobs.length} jobs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
