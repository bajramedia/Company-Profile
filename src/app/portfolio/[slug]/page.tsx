import { Suspense } from 'react';
import PortfolioDetailClient from './PortfolioDetailClient';

// Tambah type untuk generateMetadata jika diperlukan nanti
export interface PortfolioDetailPageProps {
    params: {
        slug: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function PortfolioDetailPage({ params, searchParams }: PortfolioDetailPageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PortfolioDetailClient slug={params.slug} />
        </Suspense>
    );
} 