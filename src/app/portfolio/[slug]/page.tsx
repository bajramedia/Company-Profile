import { Suspense } from 'react';
import { Metadata } from 'next';
import PortfolioDetailClient from './PortfolioDetailClient';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioDetailPage({ params, searchParams }: Props) {
    const { slug } = await params;
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PortfolioDetailClient slug={slug} />
        </Suspense>
    );
} 