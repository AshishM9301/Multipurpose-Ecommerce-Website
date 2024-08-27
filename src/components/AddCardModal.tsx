import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CardDetails {
    number: string;
    name: string;
    cvc: string;
    expiry: string;
    type: string;
}

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCard: (card: CardDetails) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        number: '',
        name: '',
        cvc: '',
        expiry: '',
        type: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        switch (name) {
            case 'number':
                newValue = value.replace(/\D/g, '').slice(0, 16);
                break;
            case 'cvc':
                newValue = value.replace(/\D/g, '').slice(0, 3);
                break;
            case 'expiry':
                newValue = value
                    .replace(/\D/g, '')
                    .slice(0, 4)
                    .replace(/(\d{2})(\d{2})/, '$1/$2');
                break;
        }

        setCardDetails(prev => ({ ...prev, [name]: newValue }));
    };

    useEffect(() => {
        const detectCardType = (number: string) => {
            const patterns = {
                visa: /^4/,
                mastercard: /^5[1-5]/,
                amex: /^3[47]/,
                discover: /^6(?:011|5)/,
            };

            for (const [type, pattern] of Object.entries(patterns)) {
                if (pattern.test(number)) {
                    return type;
                }
            }
            return '';
        };

        const type = detectCardType(cardDetails.number);
        setCardDetails(prev => ({ ...prev, type }));
    }, [cardDetails.number]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddCard(cardDetails);
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "block w-full rounded-full border-gray-300 px-4 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Card</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="number"
                                name="number"
                                value={cardDetails.number}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input
                                type="text"
                                id="cvc"
                                name="cvc"
                                value={cardDetails.cvc}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={handleChange}
                                placeholder="MM/YYYY"
                                className={inputClasses}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Card
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCardModal;
