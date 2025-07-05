// Data dummy untuk fallback ketika API gagal
export interface DummyPortfolioItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  images?: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  categoryIcon?: string;
  published: boolean;
  featured: boolean;
  client_name?: string;
  project_url?: string;
  technologies?: string;
  date?: string;
  views?: number;
}

export interface DummyBlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  published: boolean;
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  views?: number;
  readTime?: number;
  tags?: string[];
}

export interface DummyPortfolioCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

// Data dummy untuk Portfolio
export const dummyPortfolioItems: DummyPortfolioItem[] = [
  {
    id: 1,
    slug: 'web-development-ecommerce',
    title: 'E-Commerce Platform Development',
    excerpt: 'Modern e-commerce platform dengan fitur lengkap, payment gateway, dan dashboard admin yang user-friendly.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'E-commerce homepage' },
      { url: '/images/placeholder.jpg', alt: 'Product catalog' }
    ]),
    categoryId: 1,
    categoryName: 'Web Development',
    categorySlug: 'web-development',
    categoryIcon: '🌐',
    published: true,
    featured: true,
    client_name: 'PT Digital Commerce',
    project_url: 'https://example.com',
    technologies: 'React, Node.js, PostgreSQL, Stripe',
    date: '2024-01-15',
    views: 245
  },
  {
    id: 2,
    slug: 'mobile-app-fintech',
    title: 'FinTech Mobile Application',
    excerpt: 'Aplikasi mobile untuk layanan finansial dengan keamanan tinggi dan user interface yang intuitif.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'Mobile app dashboard' },
      { url: '/images/placeholder.jpg', alt: 'Transaction history' }
    ]),
    categoryId: 2,
    categoryName: 'Mobile App',
    categorySlug: 'mobile-app',
    categoryIcon: '📱',
    published: true,
    featured: true,
    client_name: 'FinTech Solutions',
    project_url: 'https://play.google.com/store/apps/details?id=com.example.fintech',
    technologies: 'React Native, Firebase, Stripe API',
    date: '2024-02-10',
    views: 189
  },
  {
    id: 3,
    slug: 'corporate-website-redesign',
    title: 'Corporate Website Redesign',
    excerpt: 'Redesign website corporate dengan fokus pada user experience dan optimasi SEO untuk meningkatkan konversi.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'Corporate homepage' },
      { url: '/images/placeholder.jpg', alt: 'About us page' }
    ]),
    categoryId: 3,
    categoryName: 'UI/UX Design',
    categorySlug: 'ui-ux-design',
    categoryIcon: '🎨',
    published: true,
    featured: false,
    client_name: 'PT Corporate Indonesia',
    project_url: 'https://corporate-example.com',
    technologies: 'Next.js, Tailwind CSS, Framer Motion',
    date: '2024-03-05',
    views: 156
  },
  {
    id: 4,
    slug: 'inventory-management-system',
    title: 'Inventory Management System',
    excerpt: 'Sistem manajemen inventori dengan real-time tracking, automated alerts, dan comprehensive reporting.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'Dashboard overview' },
      { url: '/images/placeholder.jpg', alt: 'Inventory tracking' }
    ]),
    categoryId: 4,
    categoryName: 'System Development',
    categorySlug: 'system-development',
    categoryIcon: '⚙️',
    published: true,
    featured: false,
    client_name: 'Manufacturing Corp',
    project_url: '#',
    technologies: 'Laravel, Vue.js, MySQL, Redis',
    date: '2024-01-20',
    views: 98
  },
  {
    id: 5,
    slug: 'digital-marketing-campaign',
    title: 'Digital Marketing Campaign',
    excerpt: 'Kampanye digital marketing yang komprehensif dengan strategi multi-channel dan analytics yang mendalam.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'Campaign dashboard' },
      { url: '/images/placeholder.jpg', alt: 'Analytics report' }
    ]),
    categoryId: 5,
    categoryName: 'Digital Marketing',
    categorySlug: 'digital-marketing',
    categoryIcon: '📊',
    published: true,
    featured: false,
    client_name: 'Startup Indonesia',
    project_url: '#',
    technologies: 'Google Ads, Facebook Ads, Analytics',
    date: '2024-02-28',
    views: 134
  },
  {
    id: 6,
    slug: 'game-development-mobile',
    title: 'Mobile Game Development',
    excerpt: 'Pengembangan game mobile dengan gameplay yang engaging dan monetization strategy yang efektif.',
    featured_image: '/images/placeholder.jpg',
    images: JSON.stringify([
      { url: '/images/placeholder.jpg', alt: 'Game screenshot' },
      { url: '/images/placeholder.jpg', alt: 'Character design' }
    ]),
    categoryId: 6,
    categoryName: 'Game Development',
    categorySlug: 'game-development',
    categoryIcon: '🎮',
    published: true,
    featured: false,
    client_name: 'Game Studio',
    project_url: '#',
    technologies: 'Unity, C#, Firebase',
    date: '2024-03-15',
    views: 287
  }
];

// Data dummy untuk Portfolio Categories
export const dummyPortfolioCategories: DummyPortfolioCategory[] = [
  { id: 1, name: 'Web Development', slug: 'web-development', icon: '🌐' },
  { id: 2, name: 'Mobile App', slug: 'mobile-app', icon: '📱' },
  { id: 3, name: 'UI/UX Design', slug: 'ui-ux-design', icon: '🎨' },
  { id: 4, name: 'System Development', slug: 'system-development', icon: '⚙️' },
  { id: 5, name: 'Digital Marketing', slug: 'digital-marketing', icon: '📊' },
  { id: 6, name: 'Game Development', slug: 'game-development', icon: '🎮' }
];

// Data dummy untuk Blog Posts
export const dummyBlogPosts: DummyBlogPost[] = [
  {
    id: '1',
    title: 'Tren Web Development 2024: Yang Perlu Kamu Ketahui',
    content: `<p>Industri web development terus berkembang dengan pesat di tahun 2024. Berikut adalah tren-tren terbaru yang perlu kamu ketahui:</p>
    
    <h2>1. AI-Powered Development</h2>
    <p>Penggunaan artificial intelligence dalam web development semakin meluas. Dari code generation hingga automated testing, AI membantu developer menjadi lebih produktif.</p>
    
    <h2>2. Progressive Web Apps (PWA)</h2>
    <p>PWA terus menjadi pilihan utama untuk memberikan pengalaman mobile yang optimal dengan performa yang mendekati native app.</p>
    
    <h2>3. Edge Computing</h2>
    <p>Komputasi edge memberikan performa yang lebih baik dengan mengurangi latency dan meningkatkan user experience secara keseluruhan.</p>`,
    excerpt: 'Simak tren web development terbaru di 2024 yang wajib diketahui oleh developer modern. Mulai dari AI-powered development hingga edge computing.',
    slug: 'tren-web-development-2024',
    featuredImage: '/images/placeholder.jpg',
    published: true,
    featured: true,
    date: '2024-03-20',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    author: {
      id: '1',
      name: 'Tata Bajramedia',
      email: 'tata@bajramedia.com',
      avatar: '/images/team/admin-avatar.jpg',
      bio: 'Senior Full Stack Developer with 5+ years experience in modern web technologies'
    },
    category: {
      id: '1',
      name: 'Web Development',
      slug: 'web-development'
    },
    views: 1247,
    readTime: 8,
    tags: ['web development', 'technology', 'trends', '2024']
  },
  {
    id: '2',
    title: 'Panduan Lengkap UI/UX Design untuk Pemula',
    content: `<p>UI/UX design adalah bidang yang sangat penting dalam pengembangan produk digital. Berikut panduan lengkap untuk memulai karir di bidang ini:</p>
    
    <h2>Apa itu UI/UX Design?</h2>
    <p>UI (User Interface) adalah tampilan visual yang dilihat user, sedangkan UX (User Experience) adalah keseluruhan pengalaman user saat menggunakan produk.</p>
    
    <h2>Tools yang Perlu Dipelajari</h2>
    <ul>
      <li>Figma - untuk wireframing dan prototyping</li>
      <li>Adobe XD - alternatif untuk design sistem</li>
      <li>Sketch - khusus untuk macOS users</li>
    </ul>
    
    <h2>Prinsip Dasar Design</h2>
    <p>Pelajari prinsip-prinsip dasar seperti hierarchy, contrast, balance, dan consistency untuk menciptakan design yang efektif.</p>`,
    excerpt: 'Pelajari dasar-dasar UI/UX design mulai dari pengertian, tools yang digunakan, hingga prinsip-prinsip fundamental yang perlu dikuasai.',
    slug: 'panduan-ui-ux-design-pemula',
    featuredImage: '/images/placeholder.jpg',
    published: true,
    featured: true,
    date: '2024-03-18',
    createdAt: '2024-03-18T09:00:00Z',
    updatedAt: '2024-03-18T09:00:00Z',
    author: {
      id: '2',
      name: 'Designer Bajramedia',
      email: 'designer@bajramedia.com',
      avatar: '/images/team/writer-avatar.jpg',
      bio: 'Creative UI/UX Designer passionate about creating intuitive and beautiful digital experiences'
    },
    category: {
      id: '2',
      name: 'UI/UX Design',
      slug: 'ui-ux-design'
    },
    views: 892,
    readTime: 6,
    tags: ['ui/ux', 'design', 'tutorial', 'beginner']
  },
  {
    id: '3',
    title: 'Strategi Digital Marketing yang Efektif di Era Digital',
    content: `<p>Digital marketing menjadi kunci sukses bisnis di era digital. Berikut strategi yang terbukti efektif:</p>
    
    <h2>1. Content Marketing</h2>
    <p>Buat konten yang valuable dan konsisten untuk membangun trust dengan audience.</p>
    
    <h2>2. Social Media Marketing</h2>
    <p>Manfaatkan platform media sosial yang tepat sesuai dengan target audience bisnis kamu.</p>
    
    <h2>3. SEO dan SEM</h2>
    <p>Optimasi website untuk search engine dan gunakan paid advertising untuk hasil yang lebih cepat.</p>
    
    <h2>4. Email Marketing</h2>
    <p>Bangun hubungan jangka panjang dengan customer melalui email marketing yang personal.</p>`,
    excerpt: 'Temukan strategi digital marketing yang efektif untuk mengembangkan bisnis di era digital. Dari content marketing hingga SEO optimization.',
    slug: 'strategi-digital-marketing-efektif',
    featuredImage: '/images/placeholder.jpg',
    published: true,
    featured: false,
    date: '2024-03-15',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    author: {
      id: '3',
      name: 'Marketing Bajramedia',
      email: 'marketing@bajramedia.com',
      avatar: '/images/team/default-avatar.jpg',
      bio: 'Digital Marketing Specialist with expertise in SEO, SEM, and social media marketing'
    },
    category: {
      id: '3',
      name: 'Digital Marketing',
      slug: 'digital-marketing'
    },
    views: 654,
    readTime: 7,
    tags: ['digital marketing', 'strategy', 'business', 'growth']
  }
];

// Helper function untuk mendapatkan data dummy
export const getFallbackData = () => {
  console.log('🔄 API connection failed, using fallback dummy data');
  return {
    portfolioItems: dummyPortfolioItems,
    portfolioCategories: dummyPortfolioCategories,
    blogPosts: dummyBlogPosts
  };
};

// Helper function untuk format portfolio data
export const formatPortfolioForDisplay = (items: DummyPortfolioItem[]) => {
  return items.map(item => ({
    ...item,
    images: item.images ? JSON.parse(item.images) : [],
    featured: item.featured || false,
    published: item.published || false,
    viewCount: item.views || 0
  }));
};

// Helper function untuk format blog data
export const formatBlogForDisplay = (posts: DummyBlogPost[]) => {
  return posts.map(post => ({
    ...post,
    views: post.views || 0,
    readTime: post.readTime || 5,
    tags: post.tags || []
  }));
}; 