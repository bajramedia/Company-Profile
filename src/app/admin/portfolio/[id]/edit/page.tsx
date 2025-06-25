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