'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Upload, Book, User, Info, Tag, Camera } from 'lucide-react';
import { createExchange } from '@/services/exchanges/exchanges';
import { getCategories } from '@/services/exchanges/category';
import { fileUpload } from '@/services/fileUpload';

// Type definitions matching your Mongoose schema
interface BoardInfo {
    university: string;
    branch: string;
    year: string;
}

interface Category {
    _id: string;
    name: string;
}

interface BookExchangeFormData {
    title: string;
    author: string;
    genre: string;
    description: string;
    image: string;
    board: BoardInfo;
    status: number;
    condition: number;
    category: string;
    purchaseDate: string;
    specification: SpecificationValue;
    specificationCategory: string;
}

interface FormErrors {
    [key: string]: string;
}

// Enum definitions matching your backend exactly
enum ExchangeStatus {
    ON_GOING = 400,
    COMPLETED = 401,
    OPEN = 402,
    PENDING = 403,
    ACCEPTED = 404,
    DECLINED = 405,
    REQUEST = 406
}

enum BookCondition {
    NEW = 1200,
    USED = 1201,
    OLD = 1202,
    GOOD = 1203,
    EXCELLENT = 1204
}

// Hierarchical specification structure
const SPECIFICATIONS = {
    SCIENCE: {
        MATHS: 500,
        PHYSICS: 501,
        CHEMISTRY: 502
    },
    ARTS: {
        DANCE: 600,
        MUSIC: 601,
        POETRY: 602,
        HISTORY: 603,
        LITERATURE: 604
    },
    COMMERCE: {
        ACCOUNTING: 700,
        MARKETING: 701,
        FINANCE: 702,
        ECONOMICS: 703,
        MANAGEMENT: 704,
        LAW: 705
    },
    LAW: {
        CRIMINAL_LAW: 800,
        CIVIL_LAW: 801,
        ADMINISTRATIVE_LAW: 802
    },
    TECHNOLOGY: {
        COMPUTER: 900,
        ELECTRONICS: 901,
        MECHANICAL: 902,
        ELECTRICAL: 903,
        CHEMICAL: 904,
        BIOLOGICAL: 905
    },
    MEDICAL: {
        SURGERY: 1000,
        PATHOLOGY: 1001,
        PHARMACY: 1002,
        DENTISTRY: 1003,
        RADIOLOGY: 1004,
        OPHTHALMOLOGY: 1005,
        OTOLOGY: 1006
    },
    OTHERS: {
        OTHERS: 1100,
        NOVEL: 1101,
        POETRY: 1102,
        BIOGRAPHY: 1103
    }
} as const;

type SpecificationValue =
    | 500 | 501 | 502  // SCIENCE
    | 600 | 601 | 602 | 603 | 604  // ARTS
    | 700 | 701 | 702 | 703 | 704 | 705  // COMMERCE
    | 800 | 801 | 802  // LAW
    | 900 | 901 | 902 | 903 | 904 | 905  // TECHNOLOGY
    | 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006  // MEDICAL
    | 1100 | 1101 | 1102 | 1103;  // OTHERS

const BookExchangeForm: React.FC = () => {
    const [formData, setFormData] = useState<BookExchangeFormData>({
        title: '',
        author: '',
        genre: '',
        description: '',
        image: '',
        board: {
            university: '',
            branch: '',
            year: ''
        },
        status: ExchangeStatus.ON_GOING,
        condition: BookCondition.NEW,
        category: '',
        purchaseDate: '',
        specification: SPECIFICATIONS.OTHERS.OTHERS,
        specificationCategory: 'OTHERS'
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Mock categories - replace with actual API call
    const [categories, setCategories] = useState<Category[]>([
        // { _id: '1', name: 'Literature & Fiction' },
        // { _id: '2', name: 'Academic Textbooks' },
        // { _id: '3', name: 'Science & Technology' },
        // { _id: '4', name: 'History & Biography' },
        // { _id: '5', name: 'Arts & Humanities' },
        // { _id: '6', name: 'Business & Economics' },
        // { _id: '7', name: 'Health & Medicine' },
        // { _id: '8', name: 'Children & Young Adult' }
    ]);

    const universities: string[] = [
        'Delhi University',
        'Jawaharlal Nehru University',
        'Mumbai University',
        'Bangalore University',
        'Chennai University',
        'Kolkata University',
        'Pune University',
        'Hyderabad University'
    ];

    const branches: string[] = [
        'Computer Science',
        'Information Technology',
        'Electronics & Communication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Business Administration',
        'Commerce',
        'Arts',
        'Science'
    ];

    const years: string[] = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post Graduate'];

    const conditionLabels: Record<BookCondition, string> = {
        [BookCondition.NEW]: 'New',
        [BookCondition.USED]: 'Used',
        [BookCondition.OLD]: 'Old',
        [BookCondition.GOOD]: 'Good',
        [BookCondition.EXCELLENT]: 'Excellent'
    };
    const statusLabels: Record<ExchangeStatus, string> = {
        [ExchangeStatus.ON_GOING]: 'On Going',
        [ExchangeStatus.COMPLETED]: 'Completed',
        [ExchangeStatus.OPEN]: 'Open',
        [ExchangeStatus.PENDING]: 'Pending',
        [ExchangeStatus.ACCEPTED]: 'Accepted',
        [ExchangeStatus.DECLINED]: 'Declined',
        [ExchangeStatus.REQUEST]: 'Request'
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getCategories();

                setCategories((prev) => [
                    ...prev,
                    ...data.categories.map((item: any) => ({
                        _id: item._id,
                        name: item.name,
                    })),
                ]);
                // console.log('category', data)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                board: {
                    ...prev.board,
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'condition' || name === 'specification' || name === 'status'
                    ? parseInt(value, 10)
                    : value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file'
                }));
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size must be less than 5MB'
                }));
                return;
            }

            // In a real app, you'd upload to a server/cloud storage
            const res = await fileUpload(file)
            setFormData((prev) => ({
                ...prev,
                image: res.data.url
            }))
            // const reader = new FileReader();
            // reader.onload = (e: ProgressEvent<FileReader>) => {
            //     if (e.target?.result && typeof e.target.result === 'string') {
            //         setFormData(prev => ({
            //             ...prev,
            //             image: e.target!.result as string
            //         }));

            //         // Clear image error if exists
            //         setErrors(prev => {
            //             const { image, ...rest } = prev;
            //             return rest;
            //         });
            //     }
            // };
            // reader.readAsDataURL(file);


        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Book title is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (formData.author && formData.author.length > 100) {
            newErrors.author = 'Author name must be less than 100 characters';
        }

        if (formData.genre && formData.genre.length > 50) {
            newErrors.genre = 'Genre must be less than 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            const res = await createExchange(formData);

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Prepare data for API (remove empty strings, format dates)
            const submitData = {
                ...formData,
                purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null,
                // Remove empty board fields
                board: {
                    university: formData.board.university || undefined,
                    branch: formData.board.branch || undefined,
                    year: formData.board.year || undefined
                }
            };

            console.log('Form data to submit:', submitData);

            alert('Book listed for exchange successfully!');

            // Reset form
            setFormData({
                title: '',
                author: '',
                genre: '',
                description: '',
                image: '',
                board: {
                    university: '',
                    branch: '',
                    year: ''
                },
                status: ExchangeStatus.ON_GOING,
                condition: BookCondition.NEW,
                category: '',
                purchaseDate: '',
                specification: SPECIFICATIONS.ARTS.DANCE,
                specificationCategory: 'ARTS'
            });

        } catch (error: unknown) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex items-center space-x-3">
                            <Book className="text-white" size={32} />
                            <div>
                                <h1 className="text-3xl font-bold text-white">List Your Book for Exchange</h1>
                                <p className="text-blue-100">Share your books with fellow students</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 dark:bg-gray-800 dark:text-white dark:bg-black space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                <Info className="mr-3 text-blue-600" size={24} />
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Book Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter book title"
                                        maxLength={200}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter author name"
                                        maxLength={100}
                                    />
                                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Genre
                                    </label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.genre ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="e.g., Fiction, Science, History"
                                        maxLength={50}
                                    />
                                    {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select a category</option>

                                        {categories.map((category: Category, index:number) => (
                                            <option key={index.toString()} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Describe the book's content, condition, or any special notes..."
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                    <p className="text-gray-500 text-sm ml-auto">{formData.description.length}/500</p>
                                </div>
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold dark:text-white text-gray-800 flex items-center">
                                <Tag className="mr-3 text-blue-600" size={24} />
                                Book Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        {Object.entries(conditionLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Specification
                                    </label>
                                    <select
                                        name="specification"
                                        value={formData.specification}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        {Object.entries(SPECIFICATIONS).map(([category, specs]) => (
                                            Object.entries(specs).map(([specName, specValue]) => (
                                                <option key={specValue} value={specValue}>{`${category} - ${specName}`}</option>
                                            ))
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Purchase Date
                                    </label>
                                    <input
                                        type="date"
                                        name="purchaseDate"
                                        value={formData.purchaseDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                <User className="mr-3 text-blue-600" size={24} />
                                Academic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        University
                                    </label>
                                    <select
                                        name="board.university"
                                        value={formData.board.university}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select University</option>
                                        {universities.map((uni: string) => (
                                            <option key={uni} value={uni}>{uni}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Branch/Course
                                    </label>
                                    <select
                                        name="board.branch"
                                        value={formData.board.branch}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map((branch: string) => (
                                            <option key={branch} value={branch}>{branch}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-gray-100 mb-2">
                                        Year
                                    </label>
                                    <select
                                        name="board.year"
                                        value={formData.board.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((year: string) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold dark:text-white text-gray-800 flex items-center">
                                <Camera className="mr-3 text-blue-600" size={24} />
                                Book Image
                            </h2>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="text-center">
                                        {formData.image ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={formData.image}
                                                    alt="Book preview"
                                                    className="mx-auto h-48 w-32 object-cover rounded-lg shadow-md"
                                                />
                                                <p className="text-sm text-gray-600">Click to change image</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="mx-auto text-gray-400" size={48} />
                                                <div>
                                                    <p className="text-lg font-medium text-gray-700">Upload book image</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                {errors.image && <p className="text-red-500 text-sm mt-2 text-center">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Listing Book...</span>
                                    </>
                                ) : (
                                    <>
                                        <Book size={20} />
                                        <span>List Book for Exchange</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default BookExchangeForm;