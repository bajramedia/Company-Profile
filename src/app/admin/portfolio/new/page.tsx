"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import { PortfolioForm } from '@/components';

export default function NewPortfolioPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Updated categories dengan ID yang benar dari database
    const categories = [
        { id: 'cmcaw04wy0o0wh9phekq4k3b', name: 'Web Development', slug: 'web-development', icon: '🌐', color: '#3B82F6' },
        { id: 'cmcaw04wc0o0xh9p6qzku6jdg', name: 'Mobile Apps', slug: 'mobile-apps', icon: '📱', color: '#10B981' },
        { id: 'cmcaw04wy0o0yh9p81ku6jdg', name: 'UI/UX Design', slug: 'uiux-design', icon: '🎨', color: '#8B5CF6' },
        { id: 'cmcaw04wy0o0zh9p6lmxny7h', name: 'Digital Marketing', slug: 'digital-marketing', icon: '📈', color: '#F59E0B' },
        { id: '5', name: 'Game Development', slug: 'game-development', icon: '🎮', color: '#EF4444' }
    ];

    const tags = [
        { id: 'cmcaw04yq0013h9pgun9kwasq', name: 'React', slug: 'react', color: '#61DAFB' },
        { id: 'cmcaw04ym0010h9pgm9pg6gs7', name: 'Next.js', slug: 'nextjs', color: '#000000' },
        { id: 'cmcaw04ys0011h9pgy277svo', name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
        { id: 'cmcaw04ya0012h9pgvs0pstyq', name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4' },
        { id: 'cmcaw04yw0014h9pgcz5a83zs', name: 'React Native', slug: 'react-native', color: '#61DAFB' },
        { id: 'cmcaw04z60015h9pg75unmmr', name: 'Figma', slug: 'figma', color: '#F24E1E' },
        { id: 'cmcaw04zb0016h9pgpfaa9c', name: 'Prisma', slug: 'prisma', color: '#2D3748' },
        { id: 'cmcaw050k0017h9pg5bz9yIuj', name: 'Framer Motion', slug: 'framer-motion', color: '#0055FF' }
    ];

    const handleSubmit = async (portfolioData: any) => {
        setIsSubmitting(true);
        setError('');

        try {
            console.log('📝 Sending portfolio data:', portfolioData);

            // Real API call ke admin portfolio endpoint
            const response = await fetch('/api/admin/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(portfolioData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create portfolio');
            }

            console.log('✅ Portfolio created successfully:', result);

            // Redirect ke halaman admin portfolio setelah berhasil
            router.push('/admin/portfolio');
        } catch (error) {
            console.error('❌ Error saving portfolio:', error);
            setError(error instanceof Error ? error.message : 'Failed to save portfolio');
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

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                        ❌ {error}
                    </p>
                </div>
            )}

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