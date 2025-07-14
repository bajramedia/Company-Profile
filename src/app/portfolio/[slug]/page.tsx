import { Suspense } from 'react';
import PortfolioDetailClient from './PortfolioDetailClient';

interface PortfolioDetailPageProps {
    params: {
        slug: string;
    };
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PortfolioDetailClient slug={params.slug} />
        </Suspense>
    );
} 