import Link from 'next/link';
import { Product } from '@prisma/client';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link href={`/product/${product.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </div>
        </Link>
    );
};

export default ProductCard;