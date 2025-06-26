"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import { PortfolioForm } from '@/components';

export default function EditPortfolioPage() {
    const router = useRouter();
    const params = useParams();
    const portfolioId = params?.id as string;

    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Updated categories dengan ID yang benar dari database portfoliocategory
    const categories = [
        { id: 'cmcaw04wy0o0wh9phekq4k3b', name: 'Web Development', slug: 'web-development', icon: '🌐', color: '#3B82F6' },
        { id: 'cmcaw04wc0o0xh9p6qzku6jdg', name: 'Mobile Apps', slug: 'mobile-apps', icon: '📱', color: '#10B981' },
        { id: 'cmcaw04wy0o0yh9p81ku6jdg', name: 'UI/UX Design', slug: 'uiux-design', icon: '🎨', color: '#8B5CF6' },
        { id: 'cmcaw04wy0o0zh9p6lmxny7h', name: 'Digital Marketing', slug: 'digital-marketing', icon: '📈', color: '#F59E0B' },
        { id: '5', name: 'Game Development', slug: 'game-development', icon: '🎮', color: '#EF4444' }
    ];

    // Updated tags dengan ID yang benar dari database portfoliotag
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

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                // API call akan ditambahkan di sini
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockData = {
                    id: portfolioId,
                    title: 'Sample Portfolio',
                    description: 'Sample description',
                    clientName: 'Sample Client',
                    category: 'Web Development'
                };

                setPortfolioData(mockData);
            } catch (error) {
                console.error('Error loading portfolio:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (portfolioId) {
            loadPortfolioData();
        }
    }, [portfolioId]);

    const handleSubmit = async (updatedData: any) => {
        setIsSubmitting(true);

        try {
            console.log('Updating portfolio:', { id: portfolioId, ...updatedData });
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/admin/portfolio');
        } catch (error) {
            console.error('Error updating portfolio:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/portfolio');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Loading...
                </h1>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit Portfolio
                    </h1>
                </div>
                <Link href="/admin/portfolio">
                    <Button variant="outline" size="md">
                        Kembali
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <PortfolioForm
                    initialData={portfolioData}
                    categories={categories}
                    tags={tags}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                    isEditing={true}
                />
            </div>
        </div>
    );
} 