import { NextResponse } from 'next/server';

const dummyTeam = [
  {
    id: 1,
    name: "Putra Pratama",
    role: "CEO & Founder",
    roleId: "CEO & Founder",
    bio: "With over 10 years of experience in digital industry",
    bioId: "Dengan pengalaman lebih dari 10 tahun di industri digital",
    image: "/images/team/ceo.jpg",
    social: {
      linkedin: "https://linkedin.com/in/putrapratama",
      instagram: "https://instagram.com/putrapratama"
    }
  },
  {
    id: 2,
    name: "Dewi Sari",
    role: "Creative Director",
    roleId: "Direktur Kreatif",
    bio: "Expert in UI/UX design and branding strategy",
    bioId: "Ahli dalam desain UI/UX dan strategi branding",
    image: "/images/team/creative-director.jpg",
    social: {
      linkedin: "https://linkedin.com/in/dewisari",
      instagram: "https://instagram.com/dewisari"
    }
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Technical Lead",
    roleId: "Lead Teknikal",
    bio: "Full-stack developer with 8 years of experience",
    bioId: "Developer full-stack dengan pengalaman 8 tahun",
    image: "/images/team/tech-lead.jpg",
    social: {
      github: "https://github.com/budisantoso",
      linkedin: "https://linkedin.com/in/budisantoso"
    }
  },
  {
    id: 4,
    name: "Rina Wijaya",
    role: "Marketing Manager",
    roleId: "Manajer Marketing",
    bio: "Digital marketing specialist with proven track record",
    bioId: "Spesialis marketing digital dengan rekam jejak yang terbukti",
    image: "/images/team/marketing-manager.jpg",
    social: {
      linkedin: "https://linkedin.com/in/rinawijaya",
      instagram: "https://instagram.com/rinawijaya"
    }
  }
];

export async function GET() {
  try {
    // Di sini nantinya bisa ditambahkan logic untuk mengambil data dari database
    // Untuk sementara kita gunakan dummy data
    return NextResponse.json(dummyTeam);
  } catch (error) {
    console.error('Error fetching team data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
} 