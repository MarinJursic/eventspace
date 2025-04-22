import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const ServiceHelpBox: React.FC = () => {
    return (
        <div className="bg-secondary/30 border border-secondary/50 p-4 rounded-lg text-center">
            <Info className="w-5 h-5 mx-auto mb-2 text-primary" />
            <h4 className="font-medium text-sm mb-1">Need assistance?</h4>
            <p className="text-xs text-muted-foreground mb-3">
                Our event specialists can help with questions.
            </p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Contact Support Clicked!')}> {/* Replace alert with actual action */}
                Contact Support
            </Button>
        </div>
    );
};

export default ServiceHelpBox;