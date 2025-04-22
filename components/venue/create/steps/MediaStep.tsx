import { useState, useCallback, Dispatch, SetStateAction, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, X } from 'lucide-react';
import { IVenueClientState } from '@/types/venue.types';

export default function MediaStep(
    { venue, setVenue }
    : {venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>>}
) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);

            files.forEach(file => {
                const url = URL.createObjectURL(file);

                const newImage = {
                    url,
                    alt: `Image of ${venue.name || 'venue'}`,
                    caption: `${file.name}`,
                };

                setVenue(prev => ({
                    ...prev,
                    images: [...prev.images, newImage],
                }));
            });
        }
    }, [venue.name, setVenue]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const url = URL.createObjectURL(file);

                const newImage = {
                    url,
                    alt: `Image of ${venue.name || 'venue'}`,
                    caption: `${file.name}`,
                };

                setVenue(prev => ({
                    ...prev,
                    images: [...prev.images, newImage],
                }));
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setVenue({
            ...venue,
            images: venue.images.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl pb-5'>Media</h1>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={
                    `border-2 border-dashed rounded-lg p-10 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'} 
                    flex flex-col items-center justify-center`
                }
            >
                <ImagePlus size={50} className="text-muted-foreground mb-4" />
                <p className="text-center font-medium text-lg mb-2">Drag and drop images here</p>
                <p className="text-center text-sm text-muted-foreground mb-4">or</p>

                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-base font-medium flex items-center">
                        <Upload className="mr-2 h-5 w-5" /> Upload Images
                    </div>
                    <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect}/>
                </label>
            </div>

            {venue.images.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Uploaded Images ({venue.images.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {venue.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img src={image.url} alt={image.alt} className="w-full h-24 object-cover rounded-md border-2 border-gray-800"/>
                                <Button size="sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7" 
                                        onClick={() => handleRemoveImage(index)} variant="destructive"
                                >
                                    <X/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};