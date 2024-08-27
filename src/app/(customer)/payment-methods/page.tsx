'use client'

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddCardModal from '../../../components/AddCardModal';

interface Card {
    id: number;
    number: string;
    name: string;
    cvc: string;
    expiry: string;
    isDefault: boolean;
}

const PaymentMethods: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([
        { id: 1, number: '2736 3286 8332 2138', name: '258', cvc: '258', expiry: 'October 2026', isDefault: true },
        { id: 2, number: '2736 3286 8332 2138', name: '258', cvc: '258', expiry: 'October 2026', isDefault: false },
        { id: 3, number: '2736 3286 8332 2138', name: '258', cvc: '258', expiry: 'October 2026', isDefault: false },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSetDefault = (id: number) => {
        setCards(cards.map(card => ({
            ...card,
            isDefault: card.id === id
        })));
    };

    const handleDeleteCard = (id: number) => {
        setCards(cards.filter(card => card.id !== id));
    };

    const handleAddNewCard = (newCard: Omit<Card, 'id' | 'isDefault'>) => {
        setCards([...cards, { ...newCard, id: cards.length + 1, isDefault: false }]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Payment Methods</h1>
            <p className="mb-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>

            <div className="space-y-4">
                {cards.map((card) => (
                    <div key={card.id} className="bg-gray-100 p-4 rounded-lg flex items-center group">
                        <div className="flex items-center space-x-4 w-1/3">
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                            <div>
                                <p className="text-sm text-gray-500">Card Number</p>
                                <p>{card.number}</p>
                            </div>
                        </div>
                        <div className="w-1/6">
                            <p className="text-sm text-gray-500">Name On Card</p>
                            <p>{card.name}</p>
                        </div>
                        <div className="w-1/6">
                            <p className="text-sm text-gray-500">CVC</p>
                            <p>{card.cvc}</p>
                        </div>
                        <div className="w-1/6">
                            <p className="text-sm text-gray-500">Expiry Date</p>
                            <p>{card.expiry}</p>
                        </div>
                        <div className="w-1/6 flex flex-col items-end space-y-2">
                            {card.isDefault ? (
                                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">Default</span>
                            ) : (
                                <button
                                    onClick={() => handleSetDefault(card.id)}
                                    className="text-blue-500 hover:underline text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    Set as Default
                                </button>
                            )}
                            <button onClick={() => handleDeleteCard(card.id)}>
                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300"
            >
                Add New Card
            </button>

            <AddCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddCard={handleAddNewCard}
            />
        </div>
    );
};

export default PaymentMethods;
