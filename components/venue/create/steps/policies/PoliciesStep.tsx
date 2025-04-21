import React, { Dispatch, SetStateAction, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { IVenueClientState } from '@/types/venue.types';
import { bannedServiceValues } from './VenuePolicyValues';

export default function PoliciesStep(
    { venue, setVenue }
    : {venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>>}
) {
    const [policyName, setPolicyName] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');

    const handleAddPolicy = () => {
        if (!venue.policies) return;
        if (policyName && policyDescription) {
            setVenue({
                ...venue,
                policies: {
                    ...venue.policies,
                    listOfPolicies: [
                        ...venue.policies.listOfPolicies,
                        { name: policyName, description: policyDescription },
                    ],
                },
            });
            setPolicyName('');
            setPolicyDescription('');
        }
    };

    const handleRemovePolicy = (index: number) => {
        if(!venue.policies) return;
        setVenue({
            ...venue,
            policies: {
                ...venue.policies,
                listOfPolicies: venue.policies.listOfPolicies.filter((_, i) => i !== index),
            },
        });
    };

    const handleBannedServiceToggle = (serviceId: string, checked: boolean) => {
        if(!venue.policies) return;

        if (checked) {
            setVenue({
                ...venue,
                policies: {
                    ...venue.policies,
                    bannedServices: [...venue.policies.bannedServices, serviceId],
                },
            });
        } else {
            setVenue({
                ...venue,
                policies: {
                    ...venue.policies,
                    bannedServices: venue.policies.bannedServices.filter((id) => id !== serviceId),  
                },
            });
        }
    };

    if(!venue.policies) return <></>;

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h1 className='font-bold text-3xl pb-2'>Policies</h1>

                <h3 className="text-lg font-semibold">Custom Policies</h3>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="policyName">Policy Name</Label>
                        <Input id="policyName" placeholder="e.g., Noise Restrictions" value={policyName} 
                               onChange={(e) => setPolicyName(e.target.value)} className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="policyDescription">Policy Description</Label>
                        <Textarea id="description" placeholder="Describe your venue in detail" value={policyDescription} 
                                  className="mt-3 h-32 resize-none" onChange={(e) => { setPolicyDescription(e.target.value)}}
                        />
                    </div>

                    <Button onClick={handleAddPolicy} disabled={!policyName || !policyDescription} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Policy
                    </Button>
                </div>

                {venue.policies.listOfPolicies.length > 0 && (
                    <div className="space-y-2">
                        {venue.policies.listOfPolicies.map((policy, index) => (
                            <Card key={index}>
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{policy.name}</h4>
                                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" onClick={() => handleRemovePolicy(index)} className="h-8 w-8">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Banned Services</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {bannedServiceValues.map((service) => (
                        <div key={service._id} 
                             onClick={() => {
                                handleBannedServiceToggle(
                                    service._id, 
                                    !venue.policies?.bannedServices.includes(service._id)
                                );
                             }} 
                             className={`
                                p-4 border rounded-lg cursor-pointer transition-colors flex justify-center
                                ${venue.policies?.bannedServices.includes(service._id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                            `}
                        >
                            <span className="font-medium">{service.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};