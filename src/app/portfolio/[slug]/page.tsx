import { Suspense } from 'react';
import { Metadata } from 'next';
import PortfolioDetailClient from './PortfolioDetailClient';

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PortfolioDetailPage({ params, searchParams }: Props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PortfolioDetailClient slug={params.slug} />
        </Suspense>
    );
} 