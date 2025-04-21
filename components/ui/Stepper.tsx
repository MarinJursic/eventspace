import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
    steps: { label: string; description: string }[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="w-full py-4 overflow-x-auto">
            <div className="flex min-w-max">
                {steps.map((step, index) => (
                    <React.Fragment key={step.label}>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    if (index < currentStep && onStepClick) {
                                        onStepClick(index);
                                    }
                                }}
                                className={cn(
                                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                                    currentStep === index
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : index < currentStep
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-gray-300 bg-white text-gray-500",
                                    index < currentStep && "cursor-pointer hover:bg-primary/90"
                                )}
                            >
                                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "h-0.5 w-10 flex-1",
                                        index < currentStep ? "bg-primary" : "bg-gray-200"
                                    )}
                                />
                            )}
                        </div>

                        <div
                            className={cn(
                                "ml-2 flex flex-col justify-center mb-5 mr-8",
                                index < currentStep ? "text-gray-900" : "text-gray-500"
                            )}
                        >
                            <span className="text-sm font-medium">{step.label}</span>
                            <span className="text-xs hidden sm:block">{step.description}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};