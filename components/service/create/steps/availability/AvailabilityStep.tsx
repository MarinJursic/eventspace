import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { IServiceClientState } from '@/types/service.types';
import { recurrenceRules, weekdays } from './ServiceAvailabilityValues';

export default function AvailabilityStep (
    { service, setService }
    : {service: IServiceClientState, setService: Dispatch<SetStateAction<IServiceClientState>>}
) {
    const [weekday, setWeekday] = React.useState<string>('');
    const [recurrenceRule, setRecurrenceRule] = React.useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

    const handleAddBlockedWeekday = () => {
        if (weekday && recurrenceRule && service.availabilityRules) {
            const newBlockedWeekday = {
                weekday,
                recurrenceRule,
            };

            setService({
                ...service,
                availabilityRules: {
                    ...service.availabilityRules,
                    blockedWeekdays: [
                        ...service.availabilityRules.blockedWeekdays,
                        newBlockedWeekday,
                    ],
                },
            });

            setWeekday('');
        }
    };

    const handleRemoveBlockedWeekday = (index: number) => {
        if(!service.availabilityRules) return;
        setService({
            ...service,
            availabilityRules: {
                ...service.availabilityRules,
                blockedWeekdays: service.availabilityRules.blockedWeekdays.filter((_, i) => i !== index),
            },
        });
    };

    if(!service.availabilityRules) return <></>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-8">
                <h1 className='font-bold text-3xl pb-2'>Availability</h1>

                <div>
                    <h3 className="text-lg font-medium mb-4">Block Recurring Days</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Select value={weekday} onValueChange={setWeekday}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a weekday" />
                                </SelectTrigger>
                                <SelectContent>
                                    {weekdays.map((day) => (
                                        <SelectItem key={day.id} value={day.id}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={recurrenceRule} onValueChange={(value: any) => setRecurrenceRule(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select recurrence" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recurrenceRules.map((rule) => (
                                        <SelectItem key={rule.value} value={rule.value}>
                                            {rule.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleAddBlockedWeekday} disabled={!weekday || !recurrenceRule} className="w-full">
                                Add Blocked Weekday
                            </Button>
                        </div>

                        {
                            service.availabilityRules.blockedWeekdays.length === 0 
                            ?   <>
                                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                                        No recurring blocks set. Your service is available every day of the week.
                                    </div>
                                </>
                            :   <>
                                    <div className="space-y-2">
                                        <p className="font-medium text-sm">Currently Blocked Weekdays:</p>
                                        {service.availabilityRules.blockedWeekdays.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 bg-muted rounded-md"
                                            >
                                                <div>
                                                    <span className="capitalize font-medium">{item.weekday}</span>
                                                    <span className="text-sm text-muted-foreground ml-2">
                                                        ({item.recurrenceRule})
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveBlockedWeekday(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};