"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import { PortfolioForm } from '@/components';

export default function NewPortfolioPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data untuk categories dan tags - nanti akan dimuat dari API
    const categories = [
        { id: '1', name: 'Web Development', slug: 'web-development', icon: '🌐', color: '#3B82F6' },
        { id: '2', name: 'Mobile Apps', slug: 'mobile-apps', icon: '📱', color: '#10B981' },
        { id: '3', name: 'UI/UX Design', slug: 'uiux-design', icon: '🎨', color: '#8B5CF6' },
        { id: '4', name: 'Digital Marketing', slug: 'digital-marketing', icon: '📈', color: '#F59E0B' }
    ];

    const tags = [
        { id: '1', name: 'React', slug: 'react', color: '#61DAFB' },
        { id: '2', name: 'Next.js', slug: 'nextjs', color: '#000000' },
        { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
        { id: '4', name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4' },
        { id: '5', name: 'Node.js', slug: 'nodejs', color: '#339933' },
        { id: '6', name: 'React Native', slug: 'react-native', color: '#61DAFB' },
        { id: '7', name: 'Figma', slug: 'figma', color: '#F24E1E' },
        { id: '8', name: 'Adobe XD', slug: 'adobe-xd', color: '#FF61F6' }
    ];

    const handleSubmit = async (portfolioData: any) => {
        setIsSubmitting(true);

        try {
            // Di sini akan ditambahkan API call untuk menyimpan portfolio
            console.log('Portfolio data to save:', portfolioData);

            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect ke halaman admin portfolio setelah berhasil
            router.push('/admin/portfolio');
        } catch (error) {
            console.error('Error saving portfolio:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/portfolio');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tambah Portfolio Baru
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Buat portfolio baru untuk menampilkan project Anda
                    </p>
                </div>
                <Link href="/admin/portfolio">
                    <Button variant="outline" size="md">
                        <span className="mr-2">←</span>
                        Kembali
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <PortfolioForm
                    categories={categories}
                    tags={tags}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                    isEditing={false}
                />
            </div>
        </div>
    );
} 