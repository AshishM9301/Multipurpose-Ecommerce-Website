import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

interface Address {
    id?: number;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    isDefault?: false,
}

interface AddressFormProps {
    initialData?: Address;
    onSubmit: (formData: Address) => void;
    showDefaultOption?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ initialData, onSubmit, showDefaultOption = false }) => {
    const [formData, setFormData] = useState<Address>({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        isDefault: false,
    });
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [pincodeError, setPincodeError] = useState<string | null>(null);


    useEffect(() => {
        setCountries(Country.getAllCountries());
        if (initialData) {
            setFormData(initialData);
            const countryStates = State.getStatesOfCountry(initialData.country);
            setStates(countryStates);
        } else {
            getUserLocation();
        }
    }, [initialData]);

    useEffect(() => {
        if (formData.country) {
            const countryStates = State.getStatesOfCountry(formData.country);
            setStates(countryStates);
        }
    }, [formData.country]);




    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                        .then(response => response.json())
                        .then(data => {
                            setFormData(prev => ({
                                ...prev,
                                country: data.countryCode,
                                state: data.principalSubdivision,
                                city: data.city,
                            }));
                        })
                        .catch(error => console.error('Error fetching location data:', error));
                },
                (error) => console.error('Error getting user location:', error)
            );
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (name === 'postal_code') {
            setPincodeError(null);
        }
    };

    const validatePincode = async () => {
        const isValid = await checkPincodeValidity(formData.postal_code, formData.state, formData.country);
        if (!isValid) {
            setPincodeError('Invalid pincode for the selected state and country');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validatePincode();
        if (isValid) {
            onSubmit(formData);
        }
    };

    const inputClasses = "block w-full rounded-full mt-2 border border-gray-300 px-4 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>
            <div>
                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    value={formData.address_line2 || ''}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>
            <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>
            <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
                {pincodeError && <p className="mt-2 text-sm text-red-600">{pincodeError}</p>}
            </div>

            {showDefaultOption && (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Set as default address
                    </label>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? 'Update Address' : 'Add Address'}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;

function checkPincodeValidity(postal_code: string, state: string, country: string) {
    return true;
}