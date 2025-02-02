import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Palette, Sliders, X } from 'lucide-react';
import { uploadProfileBanner } from '../lib/storage';

interface ProfileBannerProps {
  userId: string;
  currentBanner?: {
    type: 'image' | 'gradient';
    value: string;
    height?: number;
    overlay?: string;
  };
  onUpdate: (banner: { type: 'image' | 'gradient'; value: string; height?: number; overlay?: string; }) => void;
  editable?: boolean;
}

const PRESET_GRADIENTS = [
  'from-neon-blue via-neon-purple to-neon-pink',
  'from-accent-clay to-accent-ochre',
  'from-accent-sage to-accent-moss',
  'from-accent-rust via-accent-clay to-accent-ochre',
];

const OVERLAY_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'mesh', label: 'Mesh Pattern', class: 'bg-mesh' },
  { id: 'noise', label: 'Noise Texture', class: 'bg-noise' },
  { id: 'dark', label: 'Dark Overlay', class: 'bg-black/30' },
];

export function ProfileBanner({ userId, currentBanner, onUpdate, editable = false }: ProfileBannerProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(currentBanner?.type === 'gradient' ? currentBanner.value : PRESET_GRADIENTS[0]);
  const [bannerHeight, setBannerHeight] = useState(currentBanner?.height || 192); // default 12rem/192px
  const [selectedOverlay, setSelectedOverlay] = useState(currentBanner?.overlay || 'none');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProfileBanner(userId, file);
      onUpdate({
        type: 'image',
        value: url,
        height: bannerHeight,
        overlay: selectedOverlay !== 'none' ? selectedOverlay : undefined
      });
    } catch (error) {
      console.error('Failed to upload banner:', error);
    } finally {
      setUploading(false);
      setIsCustomizing(false);
    }
  }, [userId, bannerHeight, selectedOverlay]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleGradientSelect = (gradient: string) => {
    setSelectedGradient(gradient);
    onUpdate({
      type: 'gradient',
      value: gradient,
      height: bannerHeight,
      overlay: selectedOverlay !== 'none' ? selectedOverlay : undefined
    });
  };

  const handleHeightChange = (height: number) => {
    setBannerHeight(height);
    onUpdate({
      type: currentBanner?.type || 'gradient',
      value: currentBanner?.value || selectedGradient,
      height,
      overlay: selectedOverlay !== 'none' ? selectedOverlay : undefined
    });
  };

  const handleOverlayChange = (overlay: string) => {
    setSelectedOverlay(overlay);
    onUpdate({
      type: currentBanner?.type || 'gradient',
      value: currentBanner?.value || selectedGradient,
      height: bannerHeight,
      overlay: overlay !== 'none' ? overlay : undefined
    });
  };

  return (
    <div className="relative">
      {/* Banner Display */}
      <div 
        className="relative overflow-hidden rounded-t-lg transition-all duration-300"
        style={{ height: `${bannerHeight}px` }}
      >
        {currentBanner?.type === 'image' ? (
          <img 
            src={currentBanner.value}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${currentBanner?.value || selectedGradient}`} />
        )}
        
        {/* Overlay */}
        {currentBanner?.overlay && (
          <div className={`absolute inset-0 ${OVERLAY_OPTIONS.find(o => o.id === currentBanner.overlay)?.class}`} />
        )}

        {/* Customize Button */}
        {editable && (
          <button
            onClick={() => setIsCustomizing(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm 
                     text-gray-900 rounded-lg shadow-lg hover:bg-white 
                     flex items-center gap-2 transition-all duration-300"
          >
            <Palette className="h-4 w-4" />
            Customize Banner
          </button>
        )}
      </div>

      {/* Customization Modal */}
      {isCustomizing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Customize Banner</h3>
                <button 
                  onClick={() => setIsCustomizing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Upload Image
                  </h4>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                              transition-all duration-300
                              ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                        Uploading...
                      </div>
                    ) : isDragActive ? (
                      <p>Drop the image here</p>
                    ) : (
                      <p>Drag & drop an image here, or click to select one</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">Max size: 5MB</p>
                  </div>
                </div>

                {/* Gradient Presets */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Gradient Presets
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_GRADIENTS.map((gradient) => (
                      <button
                        key={gradient}
                        onClick={() => handleGradientSelect(gradient)}
                        className={`h-20 rounded-lg transition-all duration-300 
                                  ${gradient === selectedGradient ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-gray-300'}`}
                      >
                        <div className={`w-full h-full rounded-lg bg-gradient-to-r ${gradient}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height Adjustment */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    Banner Height
                  </h4>
                  <input
                    type="range"
                    min="120"
                    max="400"
                    value={bannerHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Compact</span>
                    <span>Tall</span>
                  </div>
                </div>

                {/* Overlay Options */}
                <div>
                  <h4 className="font-medium mb-2">Overlay Effect</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {OVERLAY_OPTIONS.map((overlay) => (
                      <button
                        key={overlay.id}
                        onClick={() => handleOverlayChange(overlay.id)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300
                                  ${overlay.id === selectedOverlay 
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                    : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        {overlay.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}