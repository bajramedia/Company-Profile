import { NextResponse } from 'next/server';

const dummyPartners = [
  {
    id: 1,
    name: "TechCorp Solutions",
    nameId: "TechCorp Solutions",
    logo: "/images/partners/techcorp.png",
    website: "https://techcorp.com"
  },
  {
    id: 2,
    name: "Digital Innovators",
    nameId: "Digital Innovators",
    logo: "/images/partners/digital-innovators.png",
    website: "https://digitalinnovators.com"
  },
  {
    id: 3,
    name: "Creative Studio",
    nameId: "Creative Studio",
    logo: "/images/partners/creative-studio.png",
    website: "https://creativestudio.com"
  },
  {
    id: 4,
    name: "Global Connect",
    nameId: "Global Connect",
    logo: "/images/partners/global-connect.png",
    website: "https://globalconnect.com"
  }
];

export async function GET() {
  try {
    // Di sini nantinya bisa ditambahkan logic untuk mengambil data dari database
    // Untuk sementara kita gunakan dummy data
    return NextResponse.json(dummyPartners);
  } catch (error) {
    console.error('Error fetching partners data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners data' },
      { status: 500 }
    );
  }
} 
