import { ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import ProductsLayout from '@/components/Layout/ProductLayout';

const categories = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'];
const priceRanges = ['$20.00 - $50.00', '$20.00 - $50.00', '$20.00 - $50.00', '$20.00 - $50.00'];

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <ProductsLayout>
            {children}
        </ProductsLayout>

    );
}
