import { NextResponse } from 'next/server';

const dummyContent = {
  hero: {
    id: 1,
    title: "Tentang Bajramedia",
    content: "Kami adalah tim kreatif yang berdedikasi untuk memberikan solusi digital terbaik untuk bisnis Anda. Dengan pengalaman lebih dari 5 tahun, kami telah membantu ratusan bisnis berkembang di era digital.",
    section: "hero",
    language: "id"
  },
  story: {
    id: 2,
    title: "Cerita Kami",
    content: "Bajramedia didirikan pada tahun 2019 dengan visi untuk membantu bisnis berkembang di era digital. Kami menggabungkan kreativitas dan teknologi untuk menciptakan solusi yang inovatif. Setiap proyek yang kami kerjakan adalah hasil dari dedikasi dan passion tim kami untuk memberikan yang terbaik.",
    section: "story",
    language: "id",
    image: "/images/about/story.jpg"
  },
  mission: {
    id: 3,
    title: "Misi Kami",
    content: "Memberikan layanan digital terbaik dengan standar internasional untuk membantu bisnis berkembang di era digital. Kami berkomitmen untuk selalu berinovasi dan mengikuti perkembangan teknologi terbaru.",
    section: "mission",
    language: "id"
  },
  vision: {
    id: 4,
    title: "Visi Kami",
    content: "Menjadi mitra terpercaya dalam transformasi digital untuk bisnis di Indonesia dan Asia Tenggara. Kami ingin menjadi bagian dari kesuksesan setiap klien kami.",
    section: "vision",
    language: "id"
  },
  team: {
    id: 5,
    title: "Tim Kami",
    content: "Bertemu dengan tim profesional kami yang siap membantu mewujudkan visi digital Anda. Setiap anggota tim kami memiliki keahlian dan pengalaman yang luas di bidangnya.",
    section: "team",
    language: "id"
  },
  partners: {
    id: 6,
    title: "Partner Kami",
    content: "Kami bangga telah berkolaborasi dengan berbagai perusahaan dan organisasi terkemuka. Bersama-sama, kami menciptakan solusi digital yang inovatif.",
    section: "partners",
    language: "id"
  },
  cta: {
    id: 7,
    title: "Mari Berkolaborasi",
    content: "Punya ide proyek? Mari diskusikan bersama tim kami dan wujudkan visi digital Anda.",
    section: "cta",
    language: "id"
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'id';

  try {
    // Di sini nantinya bisa ditambahkan logic untuk mengambil data dari database
    // Untuk sementara kita gunakan dummy data
    const content = Object.values(dummyContent).map(item => ({
      ...item,
      language: language
    }));

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 