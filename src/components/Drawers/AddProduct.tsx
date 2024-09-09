'use client'

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface User {
    userId: number;
    // Add other user properties as needed
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock_quantity: number;
    category_id: number;
    brand_id: number;
}

interface AddProductProps {
    onProductAdded?: () => void;
    editingProduct?: Product | null;
}

export default function AddProduct({ onProductAdded, editingProduct }: AddProductProps) {
    const { user } = useAuth() as { user: User | null };
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        brand_id: '',
        stock_quantity: ''
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    console.log(editingProduct);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        if (editingProduct) {
            setProduct({
                name: editingProduct.name,
                price: editingProduct.price.toString(),
                description: editingProduct.description,
                category_id: editingProduct.category_id.toString(),
                brand_id: editingProduct.brand_id.toString(),
                stock_quantity: editingProduct.stock_quantity.toString()
            });
            // If you have an image URL for the product, you can set the preview here
            // setPreview(editingProduct.imageUrl);
        }
    }, [editingProduct]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands');
            if (!response.ok) {
                throw new Error('Failed to fetch brands');
            }
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('description', product.description);
        formData.append('stock_quantity', product.stock_quantity);
        formData.append('category_id', product.category_id);
        formData.append('brand_id', product.brand_id);

        if (user && user.userId) {
            formData.append('seller_id', user.userId.toString());
        } else {
            setSubmitMessage('Error: User ID not available');
            setIsSubmitting(false);
            return;
        }

        if (image) {
            formData.append('image', image);
        }

        const url = editingProduct
            ? `/api/products/${editingProduct.id}`
            : '/api/products/add';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSubmitMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
                setProduct({ name: '', price: '', description: '', category_id: '', brand_id: '', stock_quantity: '' });
                setImage(null);
                setPreview(null);
                if (onProductAdded) {
                    onProductAdded();
                }
            } else {
                const error = await response.text();
                setSubmitMessage(`Failed to ${editingProduct ? 'update' : 'add'} product: ${error}`);
            }
        } catch (error) {
            setSubmitMessage(`An error occurred while ${editingProduct ? 'updating' : 'adding'} the product.`);
            console.error(`Error ${editingProduct ? 'updating' : 'adding'} product:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="stock_quantity" className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
                    <input
                        type="number"
                        id="stock_quantity"
                        name="stock_quantity"
                        value={product.stock_quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="category_id" className="block text-gray-700 font-bold mb-2">Category</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={product.category_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="brand_id" className="block text-gray-700 font-bold mb-2">Brand</label>
                    <select
                        id="brand_id"
                        name="brand_id"
                        value={product.brand_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Product Image</label>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                    >
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the image here ...</p> :
                                <p>Drag 'n' drop an image here, or click to select one</p>
                        }
                    </div>
                </div>

                {preview && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">Image Preview</h2>
                        <img
                            src={preview}
                            alt="Product preview"
                            className="w-full h-auto rounded-lg shadow-md"
                            style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? `${editingProduct ? 'Updating' : 'Adding'} Product...` : `${editingProduct ? 'Update' : 'Add'} Product`}
                </button>
                {submitMessage && (
                    <p className={`mt-4 ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
