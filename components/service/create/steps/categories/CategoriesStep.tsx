import { serviceCategoryValues } from './ServiceCategoryValues';
import React, { Dispatch, SetStateAction } from 'react';
import { IServiceClientState } from '@/types/service.types';

export default function CategoriesStep(
    { service, setService }
    : { service: IServiceClientState, setService: Dispatch<SetStateAction<IServiceClientState>> }
) {

    const handleCategorySelect = (selectedCategory: string) => {
        setService((prevService: IServiceClientState): IServiceClientState => {
            if (prevService.category === selectedCategory) {
                return prevService;
            }

            return {
                ...prevService,
                category: selectedCategory,
            };
        });
    };

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl'>Category</h1>

            <p className="text-muted-foreground mb-4">
                Select the category that best describes your service. This helps potential clients find your space more easily.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {serviceCategoryValues.map((category) => (
                    <div
                        key={category.id}
                        className={`
                            p-4 border rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center gap-3
                            ${service.category === category._id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                        `}
                        onClick={() => handleCategorySelect(category._id)}
                    >
                        <div className={`
                            p-2 rounded-full
                            ${service.category === category.id ? 'bg-primary/20' : 'bg-muted'}
                        `}>
                            {category.icon}
                        </div>
                        <span className="font-medium">{category.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};