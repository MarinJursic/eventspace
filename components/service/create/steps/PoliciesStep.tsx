import React, { Dispatch, SetStateAction, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { IServiceClientState } from '@/types/service.types';

export default function PoliciesStep(
    { service, setService }
    : {service: IServiceClientState, setService: Dispatch<SetStateAction<IServiceClientState>>}
) {
    const [policyName, setPolicyName] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');

    const handleAddPolicy = () => {
        if (!service.policies) return;

        if (policyName && policyDescription) {
            setService({
                ...service,
                policies: {
                    ...service.policies,
                    listOfPolicies: [
                        ...service.policies.listOfPolicies,
                        { name: policyName, description: policyDescription },
                    ],
                },
            });
            setPolicyName('');
            setPolicyDescription('');
        }
    };

    const handleRemovePolicy = (index: number) => {
        if (!service.policies) return;

        setService({
            ...service,
            policies: {
                ...service.policies,
                listOfPolicies: service.policies.listOfPolicies.filter((_, i) => i !== index),
            },
        });
    };

    if (!service.policies) return;

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
                        <Textarea id="description" placeholder="Describe your service in detail" value={policyDescription} 
                                  className="mt-3 h-32 resize-none" onChange={(e) => { setPolicyDescription(e.target.value)}}
                        />
                    </div>

                    <Button onClick={handleAddPolicy} disabled={!policyName || !policyDescription} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Policy
                    </Button>
                </div>

                { (
                    <div className="space-y-2">
                        {service.policies?.listOfPolicies.map((policy, index) => (
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
        </div>
    );
};