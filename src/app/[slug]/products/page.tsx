'use client'

import { useState, useEffect } from 'react';
import AddProduct from '@/components/Drawers/AddProduct';
import { Drawer } from '@/components/Drawer';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Image from 'next/image';
import { Switch } from '@headlessui/react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    description: string;
    category_id: number;
    brand_id: number;
    image_path: string;
    is_enabled: boolean; // New field
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsDrawerOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsDrawerOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                const response = await fetch(`/api/products/${productToDelete.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchProducts(); // Refresh the product list
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                } else {
                    console.error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh the product list after adding or editing a product
    };

    const handleToggleProduct = async (product: Product) => {
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_enabled: !product.is_enabled }),
            });
            if (response.ok) {
                fetchProducts(); // Refresh the product list
            } else {
                console.error('Failed to toggle product');
            }
        } catch (error) {
            console.error('Error toggling product:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add Product
                </button>
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Image
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Enabled
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <div className="flex-shrink-0 h-20 w-20">
                                    <Image
                                        src={product.image_path || '/placeholder-image.jpg'}
                                        alt={product.name}
                                        width={80}
                                        height={80}
                                        className="object-cover rounded-md"
                                        style={{ objectFit: 'cover', width: 80, height: 80 }}
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                ${Number(product.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {product.stock_quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <Switch
                                    checked={product.is_enabled}
                                    onChange={() => handleToggleProduct(product)}
                                    className={`${product.is_enabled ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full border border-gray-300`}
                                >
                                    <span className="sr-only">Enable/Disable product</span>
                                    <span
                                        className={`${product.is_enabled ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform bg-white rounded-full border border-gray-300`}
                                    />
                                </Switch>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
                <AddProduct onProductAdded={handleDrawerClose} editingProduct={editingProduct} />
            </Drawer>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={productToDelete?.name || ''}
            />
        </div>
    );
}
