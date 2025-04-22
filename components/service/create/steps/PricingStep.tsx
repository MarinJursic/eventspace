import React, { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Euro } from 'lucide-react';
import { IServiceClientState } from '@/types/service.types';

export default function PricingStep(
    { service, setService }
    : {service: IServiceClientState, setService: Dispatch<SetStateAction<IServiceClientState>>}
) {
    const handleBasePriceChange = (value: string) => {
        const price = parseFloat(value);
        setService({
            ...service,
            price: {
                ...service.price,
                basePrice: isNaN(price) ? 0 : price,
            },
        });
    };

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl'>Pricing</h1>
            <div>
                <p className="text-muted-foreground mb-6">
                    Set the base price for your service. Additional fees may apply based on services selected by clients.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="basePrice" className="text-base">
                        Base Price <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                        This is the base price per day for your service.
                    </p>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Euro className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="basePrice"
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={service.price.basePrice === 0 ? '' : service.price.basePrice}
                            onChange={(e) => handleBasePriceChange(e.target.value)}
                            className="pl-10 text-xl font-medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};