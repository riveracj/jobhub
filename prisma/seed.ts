import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const password = bcrypt.hashSync("password123", 12);

const employers = [
  { name: "Sarah Chen", company: "TechNova Solutions", email: "sarah@technova.com", location: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  { name: "Marcus Johnson", company: "GreenLeaf Enterprises", email: "marcus@greenleaf.com", location: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  { name: "Priya Patel", company: "DataCraft Analytics", email: "priya@datacraft.com", location: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  { name: "James Wilson", company: "BuildRight Construction", email: "james@buildright.com", location: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  { name: "Emily Rodriguez", company: "Verdant Landscaping", email: "emily@verdant.com", location: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { name: "David Kim", company: "CloudPeak Software", email: "david@cloudpeak.com", location: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { name: "Amara Okafor", company: "BrightPath Education", email: "amara@brightpath.com", location: "Atlanta, GA", lat: 33.7490, lng: -84.3880 },
  { name: "Liam O'Brien", company: "HarborSide Logistics", email: "liam@harborside.com", location: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  { name: "Sophia Martinez", company: "FreshBite Eateries", email: "sophia@freshbite.com", location: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { name: "Noah Williams", company: "IronForge Manufacturing", email: "noah@ironforge.com", location: "Detroit, MI", lat: 42.3314, lng: -83.0458 },
  { name: "Olivia Thompson", company: "Coastal Realty Group", email: "olivia@coastalrealty.com", location: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  { name: "Ethan Brown", company: "Quantum IT Services", email: "ethan@quantumit.com", location: "Raleigh, NC", lat: 35.7796, lng: -78.6382 },
  { name: "Isabella Garcia", company: "Blossom Wellness", email: "isabella@blossomwellness.com", location: "Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
  { name: "Aiden Johnson", company: "Summit Security", email: "aiden@summitsecurity.com", location: "Salt Lake City, UT", lat: 40.7608, lng: -111.8910 },
  { name: "Mia Anderson", company: "Starlight Media", email: "mia@starlightmedia.com", location: "Nashville, TN", lat: 36.1627, lng: -86.7816 },
  { name: "Lucas Taylor", company: "EcoHome Builders", email: "lucas@ecohome.com", location: "Minneapolis, MN", lat: 44.9778, lng: -93.2650 },
  { name: "Charlotte Lee", company: "Pinnacle Financial", email: "charlotte@pinnaclefin.com", location: "Charlotte, NC", lat: 35.2271, lng: -80.8431 },
  { name: "Benjamin White", company: "Redwood Creative Agency", email: "ben@redwoodcreative.com", location: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  { name: "Amelia Harris", company: "SilverOak Healthcare", email: "amelia@silveroak.com", location: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { name: "Henry Clark", company: "Titan Delivery Services", email: "henry@titan-delivery.com", location: "Dallas, TX", lat: 32.7767, lng: -96.7970 },
  { name: "Evelyn Lewis", company: "Crystal Clear Cleaning", email: "evelyn@crystalclear.com", location: "Tampa, FL", lat: 27.9506, lng: -82.4572 },
  { name: "Daniel Walker", company: "Atlas Property Management", email: "daniel@atlaspm.com", location: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { name: "Harper Hall", company: "Golden State Auto Repair", email: "harper@goldenstateauto.com", location: "Sacramento, CA", lat: 38.5816, lng: -121.4944 },
  { name: "Alexander Young", company: "NovaTech Solutions", email: "alex@novatech.com", location: "New York, NY", lat: 40.7128, lng: -74.0060 },
  { name: "Abigail Scott", company: "Magnolia Pet Care", email: "abigail@magnoliapet.com", location: "Houston, TX", lat: 29.7604, lng: -95.3698 },
];

const jobTemplates = [
  { title: "Senior Software Engineer", type: "full-time", salary: "$130K - $170K", tags: "React,Node.js,TypeScript,Python" },
  { title: "Junior Web Developer", type: "full-time", salary: "$55K - $75K", tags: "HTML,CSS,JavaScript,React" },
  { title: "Part-Time Barista", type: "part-time", salary: "$16 - $20/hr", tags: "Customer Service,Food Handling" },
  { title: "Marketing Coordinator", type: "full-time", salary: "$50K - $65K", tags: "Social Media,Content,SEO" },
  { title: "Delivery Driver", type: "part-time", salary: "$18 - $25/hr", tags: "Driver's License,Local Knowledge" },
  { title: "Graphic Designer", type: "contract", salary: "$40 - $60/hr", tags: "Figma,Photoshop,Illustrator" },
  { title: "Registered Nurse", type: "full-time", salary: "$75K - $95K", tags: "RN License,CPR,BLS" },
  { title: "Customer Support Specialist", type: "full-time", salary: "$40K - $52K", tags: "Communication,Zendesk,CRM" },
  { title: "Construction Laborer", type: "full-time", salary: "$22 - $28/hr", tags: "OSHA,Heavy Lifting" },
  { title: "Data Analyst", type: "full-time", salary: "$70K - $90K", tags: "SQL,Python,Tableau,Excel" },
  { title: "Freelance Photographer", type: "freelance", salary: "$50 - $100/hr", tags: "Photography,Lightroom,Photoshop" },
  { title: "Office Manager", type: "full-time", salary: "$48K - $58K", tags: "Administrative,QuickBooks,Scheduling" },
  { title: "Warehouse Associate", type: "full-time", salary: "$17 - $22/hr", tags: "Forklift,Inventory,Packing" },
  { title: "Social Media Manager", type: "contract", salary: "$35 - $50/hr", tags: "Instagram,TikTok,Analytics" },
  { title: "Electrician Apprentice", type: "full-time", salary: "$20 - $28/hr", tags: "Electrical,Hand Tools,Safety" },
  { title: "Content Writer", type: "freelance", salary: "$30 - $45/hr", tags: "Writing,SEO,WordPress" },
  { title: "HVAC Technician", type: "full-time", salary: "$50K - $70K", tags: "HVAC,EPA Certification,Maintenance" },
  { title: "Accountant", type: "full-time", salary: "$60K - $80K", tags: "QuickBooks,GAAP,CPA" },
  { title: "Dog Walker / Pet Sitter", type: "part-time", salary: "$15 - $20/hr", tags: "Pet Care,First Aid,Flexible" },
  { title: "IT Support Specialist", type: "full-time", salary: "$45K - $60K", tags: "Windows,Networking,Troubleshooting" },
  { title: "Landscaper / Gardener", type: "full-time", salary: "$18 - $24/hr", tags: "Landscaping,Lawn Care,Mowing" },
  { title: "UX / UI Designer", type: "full-time", salary: "$85K - $110K", tags: "Figma,Framer,User Research" },
  { title: "Sales Associate", type: "part-time", salary: "$14 - $18/hr", tags: "Retail,POS,Merchandising" },
  { title: "Plumber", type: "full-time", salary: "$55K - $75K", tags: "Plumbing,Pipe Fitting,Blueprints" },
  { title: "Project Manager", type: "full-time", salary: "$90K - $120K", tags: "Agile,JIRA,Scrum,PMP" },
];

const seekerNames = [
  "Alice Foster", "Bob Simmons", "Clara Jensen", "Daniel Reyes", "Elena Vargas",
  "Felix Nguyen", "Grace Kim", "Hank Patterson", "Iris Chen", "Jake Morrison",
  "Kara Douglas", "Leo Franklin", "Maya Singh", "Nathan Cole", "Olive Ramsey",
  "Quinn Harper", "Rosa Mendez", "Sam Peterson", "Tina Blackwell", "Victor Stone",
  "Wendy Chang", "Xander Fox", "Yara Hassan", "Zion Brooks", "Aria Patel",
  "Blake Cooper", "Cora Mitchell", "Dylan Foster", "Eva Johansson", "Finn Murphy",
  "Gia Robinson", "Hugo Silva", "Ivy Torres", "Jasper Kim", "Kai Yamamoto",
  "Luna Rodriguez", "Miles Chen", "Nora Walsh", "Oscar Diaz", "Penelope Gray",
  "Quincy Adams", "Riley Thompson", "Sage Williams", "Toby Nelson", "Uma Patel",
];

const descriptions = [
  "We're looking for a motivated individual to join our growing team. Competitive pay and great benefits included.",
  "Join a dynamic workplace where your skills will be valued. Training provided for the right candidate.",
  "Seeking a reliable team player for an exciting opportunity with room for advancement.",
  "Immediate opening for a skilled professional. Must be detail-oriented and able to work independently.",
  "Great opportunity to grow with an established local business. We value our employees and it shows.",
  "Looking for someone who takes pride in their work. Flexible schedule and supportive environment.",
  "Become part of a company that puts people first. Full benefits package available.",
  "We need a self-starter who can hit the ground running. Experience preferred but not required.",
  "Join a fast-paced environment where no two days are the same. If you love a challenge, apply today.",
  "Excellent opportunity for career growth. We promote from within and invest in our people.",
  "Do you have what it takes? Join our team and make a difference in your community.",
  "Looking for a positive and energetic person to add to our growing family. Apply now!",
  "We offer competitive wages, flexible hours, and a great work culture. Come see why people love working here.",
  "Immediate hire for the right candidate. Must have reliable transportation and good communication skills.",
  "Join a team that values hard work and dedication. Growth opportunities for high performers.",
];

const generatedJobs = [];

for (let i = 0; i < employers.length; i++) {
  const emp = employers[i];
  const numJobs = 2 + Math.floor(Math.random() * 3);

  for (let j = 0; j < numJobs; j++) {
    const tmpl = jobTemplates[(i * 3 + j) % jobTemplates.length];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    generatedJobs.push({
      title: tmpl.title,
      description: `${desc}\n\nAbout us:\n${emp.company} is a trusted name in the ${emp.location} area. We're committed to excellence and providing great service to our community.\n\nResponsibilities:\n• Perform daily tasks as assigned\n• Work collaboratively with team members\n• Maintain a clean and safe workspace\n• Provide excellent customer service\n\nRequirements:\n• Reliable and punctual\n• Strong work ethic\n• Ability to work flexible hours\n• Excellent communication skills\n\n${emp.company} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.`,
      location: emp.location,
      lat: emp.lat,
      lng: emp.lng,
      radius: 25 + Math.floor(Math.random() * 50),
      tags: tmpl.tags,
      type: tmpl.type,
      salary: tmpl.salary,
      employerIdx: i,
    });
  }
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating 25 employers...");
  const createdEmployers = [];
  for (const emp of employers) {
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        name: emp.name,
        password,
        role: "employer",
        company: emp.company,
        location: emp.location,
        lat: emp.lat,
        lng: emp.lng,
        verified: true,
      },
    });
    createdEmployers.push(user);
  }
  console.log(`Created ${createdEmployers.length} employers`);

  console.log("Creating jobs...");
  let jobCount = 0;
  for (const gj of generatedJobs) {
    await prisma.job.create({
      data: {
        title: gj.title,
        description: gj.description,
        location: gj.location,
        lat: gj.lat,
        lng: gj.lng,
        radius: gj.radius,
        tags: gj.tags,
        type: gj.type,
        salary: gj.salary,
        status: Math.random() > 0.1 ? "active" : "closed",
        employerId: createdEmployers[gj.employerIdx].id,
      },
    });
    jobCount++;
  }
  console.log(`Created ${jobCount} jobs`);

  console.log("Creating job seekers...");
  const createdSeekers = [];
  for (const name of seekerNames) {
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`;
    const skills = ["Customer Service", "Communication", "Microsoft Office", "Teamwork", "Time Management", "Problem Solving", "Leadership", "Sales", "Data Entry", "Social Media", "Writing", "Research", "Cooking", "Cleaning", "Driving", "Cash Handling", "Inventory", "Forklift", "CPR Certified", "Bilingual", "QuickBooks", "Excel", "Python", "JavaScript", "Graphic Design", "Photography", "Project Management", "Public Speaking"];
    const selectedSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4)).join(", ");
    const locations = ["San Francisco, CA", "Portland, OR", "Austin, TX", "Denver, CO", "Miami, FL", "Seattle, WA", "Atlanta, GA", "Boston, MA", "Los Angeles, CA", "Detroit, MI", "San Diego, CA", "Raleigh, NC", "Phoenix, AZ", "Minneapolis, MN", "Chicago, IL", "Dallas, TX", "New York, NY", "Houston, TX", "Philadelphia, PA", "Nashville, TN"];
    const bioOptions = [
      "Hardworking professional looking for my next challenge.",
      "Recent graduate eager to start my career. Quick learner.",
      "Experienced professional with 5+ years in customer-facing roles.",
      "Reliable and detail-oriented individual seeking stable employment.",
      "Creative thinker with a background in design and technology.",
      "Team player with strong organizational skills.",
      "Career changer with transferable skills and a hunger to learn.",
      "Skilled tradesperson with hands-on experience.",
    ];

    const seeker = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role: "seeker",
        skills: selectedSkills,
        location: locations[Math.floor(Math.random() * locations.length)],
        bio: bioOptions[Math.floor(Math.random() * bioOptions.length)],
        lat: 30 + Math.random() * 15,
        lng: -100 + Math.random() * 30,
      },
    });
    createdSeekers.push(seeker);
  }
  console.log(`Created ${seekerNames.length} job seekers`);

  console.log("Creating sample applications...");
  const activeJobs = await prisma.job.findMany({ where: { status: "active" } });
  let appCount = 0;
  for (let i = 0; i < activeJobs.length && i < createdSeekers.length; i++) {
    const seeker = createdSeekers[i];
    const job = activeJobs[i % activeJobs.length];
    const existing = await prisma.application.findUnique({
      where: { seekerId_jobId: { seekerId: seeker.id, jobId: job.id } },
    });
    if (!existing) {
      const statuses = ["pending", "pending", "pending", "reviewed", "accepted"];
      await prisma.application.create({
        data: {
          seekerId: seeker.id,
          jobId: job.id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        },
      });
      appCount++;
    }
  }
  console.log(`Created ${appCount} applications`);

  console.log("Creating sample messages...");
  let msgCount = 0;
  for (let i = 0; i < 20; i++) {
    const employer = createdEmployers[i % createdEmployers.length];
    const seeker = createdSeekers[i % createdSeekers.length];
    const messageContents = [
      "Hi, thanks for applying! When are you available for an interview?",
      "Thanks for getting back to me. I'm available next week anytime.",
      "We'd love to schedule a call to discuss the position further.",
      "Sounds great! How does Wednesday at 2pm work for you?",
      "Perfect, I'll send you a calendar invite. Looking forward to chatting!",
    ];
    await prisma.message.create({
      data: {
        content: messageContents[i % messageContents.length],
        senderId: i % 2 === 0 ? employer.id : seeker.id,
        receiverId: i % 2 === 0 ? seeker.id : employer.id,
        read: i < 15,
        createdAt: new Date(Date.now() - (20 - i) * 3600000),
      },
    });
    msgCount++;
  }
  console.log(`Created ${msgCount} messages`);

  console.log("\n✅ Seed complete!");
  console.log(`   ${createdEmployers.length} employers`);
  console.log(`   ${jobCount} jobs`);
  console.log(`   ${seekerNames.length} job seekers`);
  console.log(`   ${appCount} applications`);
  console.log(`   ${msgCount} messages`);
  console.log("\n📧 Login credentials (all users): password123");
  console.log("   Employer example: sarah@technova.com");
  console.log("   Seeker example: alice.foster@email.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
