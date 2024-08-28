'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have an AuthContext

export default function AddProduct() {
    const { user } = useAuth(); // Get the current user from AuthContext
    const [product, setProduct] = useState({ name: '', price: '', description: '', category_id: '', brand_id: '' });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

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
        formData.append('seller_id', user?.id.toString() || ''); // Assuming user.id exists
        formData.append('category_id', product.category_id);
        formData.append('brand_id', product.brand_id);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch('/api/products/add', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSubmitMessage('Product added successfully!');
                setProduct({ name: '', price: '', description: '', category_id: '', brand_id: '' });
                setImage(null);
                setPreview(null);
            } else {
                const error = await response.text();
                setSubmitMessage(`Failed to add product: ${error}`);
            }
        } catch (error) {
            setSubmitMessage('An error occurred while adding the product.');
            console.error('Error adding product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
            <div className="flex gap-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex-1">
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
                            {/* Add your category options here */}
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
                            {/* Add your brand options here */}
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Product...' : 'Add Product'}
                    </button>
                    {submitMessage && (
                        <p className={`mt-4 ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {submitMessage}
                        </p>
                    )}
                </form>
                <div className="w-1/3 self-start">
                    {preview && (
                        <div className="sticky top-6">
                            <h2 className="text-xl font-bold mb-2">Image Preview</h2>
                            <img
                                src={preview}
                                alt="Product preview"
                                className="w-full h-auto rounded-lg shadow-md"
                                style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
