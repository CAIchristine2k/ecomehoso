import React, {useState, useRef, useEffect} from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  Heart,
  ShoppingBag,
  Shirt,
  Users,
} from 'lucide-react';
import {useConfig} from '~/utils/themeContext';
import {AuthPrompt} from '~/components/AuthPrompt';

/*
 * AI Photo Generator using KlingAI's V2 model
 * Enhanced capabilities:
 * - Using V2 model for superior image quality and face preservation
 * - Enhanced face reference capabilities with image_reference='face'
 * - Better prompt understanding and scene generation
 * - V2's built-in quality optimization (no manual fidelity parameter needed)
 */

interface AITask {
  taskId: string;
  status: 'submitted' | 'processing' | 'succeed' | 'failed';
  resultUrl?: string;
  error?: string;
  localStorageKey?: string;     // Legacy: Key for retrieving from localStorage
  originalUrl?: string;         // Original cloud URL as fallback
  storageReference?: string;    // Smart storage reference (storageType://key)
  storageType?: 'localStorage' | 'indexedDB' | 'cloudinary'; // Type of storage used
  cloudinaryUrl?: string;       // Direct Cloudinary URL if available
}

interface APIResponse {
  taskId: string;
  status: string;
  message?: string;
  resultUrl?: string;
  error?: string;
}

// Simplified customer data interface to avoid assumptions about the metafield structure
interface CustomerData {
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    // Metafields structure matching CustomerDetailsQuery
    metafields?: Array<{
      id: string;
      namespace: string;
      key: string;
      value: string;
      type: string;
    }>;
  };
}

// Shopify GraphQL metafield structure
interface ShopifyMetafieldEdge {
  node: {
    namespace?: string;
    key?: string;
    value?: string;
    [key: string]: any;
  };
}

interface UsageInfo {
  currentUsage: number;
  limit: number;
  resetDate: Date;
  canGenerate: boolean;
}

interface PresetImage {
  id: string;
  name: string;
  description: string;
  imagePath: string;
}

export default function AIPhotoGenerator() {
  try {
    console.log('=========== RENDERING AI PHOTO GENERATOR ===========');
    const config = useConfig();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [currentTask, setCurrentTask] = useState<AITask | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string>('');
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [selectedPose, setSelectedPose] = useState<string>('training');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Preset influencer images for fans to use
    const presetImages: PresetImage[] = [
      {
        id: 'celebrity-style',
        name: 'Celebrity Style',
        description: 'Photo with Sugar Shane Mosley',
        imagePath: '/images/preset/celebrity-style.png',
      },
      {
        id: 'meet-greet',
        name: 'Meet & Greet',
        description: 'Photo with Sugar Shane Mosley',
        imagePath: '/images/preset/meet-greet.png',
      },
      {
        id: 'fan-love',
        name: 'Fan Love',
        description: 'Show your support with a heart gesture',
        imagePath: '/images/preset/fan-love.png',
      },
      {
        id: 'boxing-ring',
        name: 'Boxing Ring',
        description: 'Face off in the boxing ring',
        imagePath: '/images/preset/boxing-ring.png',
      },
      {
        id: 'championship',
        name: 'Championship',
        description: 'Celebrate a title win together',
        imagePath: '/images/preset/championship.png',
      },
      {
        id: 'training-session',
        name: 'Training Session',
        description: 'Get coached by Sugar Shane',
        imagePath: '/images/preset/training-session.png',
      },
      {
        id: 'red-carpet',
        name: 'Red Carpet',
        description: 'Attend a gala event together',
        imagePath: '/images/preset/red-carpet.png',
      },
      {
        id: 'autograph',
        name: 'Autograph',
        description: 'Get a virtual autograph',
        imagePath: '/images/preset/autograph.png',
      },
      {
        id: 'shane-special',
        name: 'Shane Special',
        description: 'Special pose with Sugar Shane Mosley',
        imagePath: '/images/preset/shane1.jpg',
      },
    ];

    if (!config.showAIMediaGeneration || !config.aiMediaGeneration) {
      return (
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            Feature not available
          </h2>
          <a
            href="/"
            className="text-primary hover:underline mt-4 inline-block"
          >
            Return to homepage
          </a>
        </div>
      );
    }

    const {aiMediaGeneration} = config;

    // Check authentication on component mount
    useEffect(() => {
      // Comment out auth check for testing
      /* 
      if (aiMediaGeneration.requiresAuth) {
        checkAuth();
      }
      */

      // Set default usage info for testing
      setUsageInfo({
        currentUsage: 0,
        limit: aiMediaGeneration.usageLimit,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        canGenerate: true,
      });
    }, []);

    const checkAuth = async () => {
      console.log('=========== CHECKING AUTH ===========');
      // Comment out auth check for testing - always allow access
      setShowAuthPrompt(false);
      return;

      setIsLoadingAuth(true);
      try {
        const response = await fetch('/api/ai-media-generation/auth');
        console.log('Auth response status:', response.status);

        if (!response.ok) {
          console.error('Auth API returned error status:', response.status);
          setShowAuthPrompt(true);
          setIsLoadingAuth(false);
          return;
        }

        // Parse response data
        let data: any;
        try {
          const textResponse = await response.text();
          console.log('Raw response text:', textResponse);
          data = JSON.parse(textResponse);
          console.log('Parsed customer data:', data);
        } catch (parseError) {
          console.error('Failed to parse auth response:', parseError);
          setShowAuthPrompt(true);
          setIsLoadingAuth(false);
          return;
        }

        // Check if we have customer data
        if (!data || !data.customer) {
          console.log('No customer data in response');
          setShowAuthPrompt(true);
          setIsLoadingAuth(false);
          return;
        }

        // Store customer data
        setCustomerData(data);

        // Get usage info with completely different approach
        const usageInfo = extractUsageInfo(data.customer, aiMediaGeneration);
        setUsageInfo(usageInfo);
      } catch (err) {
        console.error('Auth check failed:', err);
        setShowAuthPrompt(true);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    // A completely different approach to extract usage info that avoids any find() calls
    const extractUsageInfo = (
      customer: any,
      config: typeof aiMediaGeneration,
    ): UsageInfo => {
      console.log('=========== EXTRACTING USAGE INFO ===========');
      // Default values
      const defaultInfo: UsageInfo = {
        currentUsage: 0,
        limit: config.usageLimit,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        canGenerate: true, // Default to allowing generation
      };

      // If no customer, return defaults
      if (!customer) {
        console.log('No customer data, using defaults');
        return defaultInfo;
      }

      try {
        // Log the complete customer object
        console.log(
          'Complete customer object:',
          JSON.stringify(customer, null, 2),
        );

        // Handle case where metafields is undefined or null
        if (!customer.metafields) {
          console.log('No metafields property on customer');
          return defaultInfo;
        }

        console.log('Metafields type:', typeof customer.metafields);
        console.log('Is metafields array?', Array.isArray(customer.metafields));
        console.log(
          'Metafields length:',
          Array.isArray(customer.metafields)
            ? customer.metafields.length
            : 'not an array',
        );
        console.log(
          'Metafields raw data:',
          JSON.stringify(customer.metafields, null, 2),
        );

        // Extract usage information using direct property access
        let currentUsage = 0;
        let lastResetDate = new Date(0);

        // Completely avoid array methods like find() or filter()
        // Instead use for loop with index
        if (Array.isArray(customer.metafields)) {
          for (let i = 0; i < customer.metafields.length; i++) {
            const metafield = customer.metafields[i];

            // Verbose logging
            console.log(`Checking metafield at index ${i}:`, metafield);

            // Skip null/undefined entries
            if (!metafield) {
              console.log(
                `Metafield at index ${i} is null or undefined, skipping`,
              );
              continue;
            }

            // Log all properties
            console.log(`Metafield ${i} properties:`, Object.keys(metafield));
            console.log(`Metafield ${i} namespace:`, metafield.namespace);
            console.log(`Metafield ${i} key:`, metafield.key);
            console.log(`Metafield ${i} value:`, metafield.value);

            // Direct property access with type checking
            const namespace =
              typeof metafield.namespace === 'string'
                ? metafield.namespace
                : null;
            const key =
              typeof metafield.key === 'string' ? metafield.key : null;
            const value =
              typeof metafield.value === 'string' ? metafield.value : null;

            // Extract usage data with full type checking
            if (
              namespace === 'ai_generation' &&
              key === 'monthly_usage' &&
              value !== null
            ) {
              const parsedValue = parseInt(value);
              currentUsage = isNaN(parsedValue) ? 0 : parsedValue;
              console.log('Found usage value:', currentUsage);
            }

            // Extract reset date with full type checking
            if (
              namespace === 'ai_generation' &&
              key === 'last_reset' &&
              value !== null
            ) {
              try {
                lastResetDate = new Date(value);
                console.log('Found last reset date:', lastResetDate);
              } catch (error) {
                console.error(
                  'Invalid date format in last_reset metafield:',
                  value,
                );
              }
            }
          }
        } else if (
          customer.metafields &&
          typeof customer.metafields === 'object'
        ) {
          // Handle potential GraphQL connection structure
          console.log(
            'Metafields is not an array, checking for connection structure',
          );

          if (
            customer.metafields.edges &&
            Array.isArray(customer.metafields.edges)
          ) {
            console.log('Found edges array in metafields');

            // Process edges
            for (let i = 0; i < customer.metafields.edges.length; i++) {
              const edge = customer.metafields.edges[i];

              if (!edge || !edge.node) {
                console.log(`Edge at index ${i} is invalid, skipping`);
                continue;
              }

              const node = edge.node;
              console.log(`Processing edge ${i} node:`, node);

              // Direct property access with type checking
              const namespace =
                typeof node.namespace === 'string' ? node.namespace : null;
              const key = typeof node.key === 'string' ? node.key : null;
              const value = typeof node.value === 'string' ? node.value : null;

              // Extract data
              if (
                namespace === 'ai_generation' &&
                key === 'monthly_usage' &&
                value !== null
              ) {
                const parsedValue = parseInt(value);
                currentUsage = isNaN(parsedValue) ? 0 : parsedValue;
                console.log('Found usage value in edge:', currentUsage);
              }

              if (
                namespace === 'ai_generation' &&
                key === 'last_reset' &&
                value !== null
              ) {
                try {
                  lastResetDate = new Date(value);
                  console.log('Found last reset date in edge:', lastResetDate);
                } catch (error) {
                  console.error(
                    'Invalid date format in edge last_reset metafield:',
                    value,
                  );
                }
              }
            }
          } else if (
            customer.metafields.nodes &&
            Array.isArray(customer.metafields.nodes)
          ) {
            console.log('Found nodes array in metafields');

            // Process nodes
            for (let i = 0; i < customer.metafields.nodes.length; i++) {
              const node = customer.metafields.nodes[i];

              if (!node) {
                console.log(`Node at index ${i} is invalid, skipping`);
                continue;
              }

              console.log(`Processing node ${i}:`, node);

              // Direct property access with type checking
              const namespace =
                typeof node.namespace === 'string' ? node.namespace : null;
              const key = typeof node.key === 'string' ? node.key : null;
              const value = typeof node.value === 'string' ? node.value : null;

              // Extract data
              if (
                namespace === 'ai_generation' &&
                key === 'monthly_usage' &&
                value !== null
              ) {
                const parsedValue = parseInt(value);
                currentUsage = isNaN(parsedValue) ? 0 : parsedValue;
                console.log('Found usage value in node:', currentUsage);
              }

              if (
                namespace === 'ai_generation' &&
                key === 'last_reset' &&
                value !== null
              ) {
                try {
                  lastResetDate = new Date(value);
                  console.log('Found last reset date in node:', lastResetDate);
                } catch (error) {
                  console.error(
                    'Invalid date format in node last_reset metafield:',
                    value,
                  );
                }
              }
            }
          }
        }

        // Calculate next reset date
        const now = new Date();
        let nextResetDate = new Date(lastResetDate);

        console.log('Current date:', now);
        console.log('Last reset date:', lastResetDate);
        console.log('Next reset date before adjustment:', nextResetDate);

        // Apply reset period from config
        switch (config.resetPeriod) {
          case 'daily':
            nextResetDate.setDate(nextResetDate.getDate() + 1);
            break;
          case 'weekly':
            nextResetDate.setDate(nextResetDate.getDate() + 7);
            break;
          case 'monthly':
          default:
            nextResetDate.setMonth(nextResetDate.getMonth() + 1);
            break;
        }

        console.log('Next reset date after adjustment:', nextResetDate);

        // Check if reset is needed
        const needsReset = now >= nextResetDate;
        console.log('Needs reset:', needsReset);

        const actualUsage = needsReset ? 0 : currentUsage;
        console.log('Actual usage:', actualUsage);

        // Calculate new reset date if needed
        const resetDate = needsReset
          ? new Date(now.getTime() + getPeriodMilliseconds(config.resetPeriod))
          : nextResetDate;

        console.log('Final reset date:', resetDate);

        const result = {
          currentUsage: actualUsage,
          limit: config.usageLimit,
          resetDate: resetDate,
          canGenerate: actualUsage < config.usageLimit,
        };

        console.log('Final usage info:', result);
        return result;
      } catch (error) {
        console.error('Error processing usage info:', error);
        // On any error, default to allowing generation
        return {
          ...defaultInfo,
          canGenerate: true,
        };
      }
    };

    // Helper function to get milliseconds for a period
    const getPeriodMilliseconds = (period: string): number => {
      switch (period) {
        case 'daily':
          return 24 * 60 * 60 * 1000;
        case 'weekly':
          return 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
        default:
          return 30 * 24 * 60 * 60 * 1000;
      }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > aiMediaGeneration.maxFileSize * 1024 * 1024) {
        setError(
          `File size must be less than ${aiMediaGeneration.maxFileSize}MB`,
        );
        return;
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
        !fileExtension ||
        !aiMediaGeneration.allowedFormats.includes(fileExtension)
      ) {
        setError(
          `Only ${aiMediaGeneration.allowedFormats.join(', ')} files are allowed`,
        );
        return;
      }

      setError('');
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    };

    const handleGenerate = async () => {
      setIsGenerating(true);
      setCurrentTask(null);
      setError('');

      try {
        // Both preset and uploaded image are required
        if (!selectedFile) {
          throw new Error('Please upload your photo to continue');
        }

        if (!selectedPreset) {
          throw new Error('Please select a pose with Sugar Shane Mosley');
        }

        // Get user uploaded image as base64
        const userImageBase64 = await fileToBase64(selectedFile);

        // Get the preset image as base64
        const presetImage = presetImages.find(
          (preset) => preset.id === selectedPreset,
        );
        if (!presetImage) {
          throw new Error('Invalid preset selected');
        }

        // Determine which Shane Mosley image to use based on preset
        // Use shane1.jpg for specific presets, otherwise use the default influencer image
        let shaneImagePath = config.aiMediaGeneration.influencerReferenceImage;
        
        // Use shane1.jpg for these specific presets that should feature Shane prominently
        if (['shane-special', 'celebrity-style', 'meet-greet', 'boxing-ring'].includes(selectedPreset)) {
          shaneImagePath = '/images/preset/shane1.jpg'; // Use the specific Shane image
          console.log(`🥊 Using shane1.jpg for preset: ${selectedPreset}`);
        } else {
          console.log(`🥊 Using default influencer image for preset: ${selectedPreset}`);
        }
        
        // Load the Shane Mosley reference image
        const influencerImageBase64 = await loadImageAsBase64(shaneImagePath);

        // Map the selected preset to a pose
        let poseName = 'default';
        if (selectedPreset === 'celebrity-style') {
          poseName = 'training'; // Match existing pose name
        } else if (selectedPreset === 'meet-greet') {
          poseName = 'hugging'; // Match existing pose name
        } else if (selectedPreset === 'fan-love') {
          poseName = 'heart'; // Match existing pose name
        } else if (selectedPreset === 'boxing-ring') {
          poseName = 'boxing'; // New pose name
        } else if (selectedPreset === 'championship') {
          poseName = 'celebrating'; // New pose name
        } else if (selectedPreset === 'training-session') {
          poseName = 'coaching'; // New pose name
        } else if (selectedPreset === 'red-carpet') {
          poseName = 'formal'; // New pose name
        } else if (selectedPreset === 'autograph') {
          poseName = 'signing'; // New pose name
        } else if (selectedPreset === 'shane-special') {
          poseName = 'special'; // New pose name for shane1
        }

        // Create a specific prompt based on the selected pose
        // For V2 with image_reference='face', describe Shane's appearance clearly
        // V2 offers superior face preservation and scene understanding
        let prompt = '';
        if (selectedPreset === 'celebrity-style') {
          prompt = `A professional studio photograph showing two people training together in a gym setting, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, wearing boxing gloves), both in boxing poses side by side, gym equipment in background, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'meet-greet') {
          prompt = `A professional photograph of two people at a meet and greet event, one person (keeping their original face) meeting Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, friendly smile), both standing together and smiling, handshake or friendly pose, professional event lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'fan-love') {
          prompt = `A professional photograph of two people, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, charismatic smile), both making a heart gesture together with their hands, smiling and looking at camera, friendly atmosphere, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'boxing-ring') {
          prompt = `A professional photograph of two people in a boxing ring, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, wearing boxing gloves), standing together in the ring, boxing ropes visible, professional sports lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'championship') {
          prompt = `A professional photograph of two people celebrating together, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, victory expression), both holding a championship belt, confetti falling around them, victory celebration, arena background, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'training-session') {
          prompt = `A professional photograph of Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, coaching expression) coaching one person (keeping their original face) during a boxing training session, both visible in frame, showing boxing technique with focus mitts, gym equipment visible, training atmosphere, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'red-carpet') {
          prompt = `A professional photograph of one person (keeping their original face) with Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, elegant smile) at a formal gala event, both dressed in elegant attire, standing together on red carpet, step-and-repeat background, camera flashes, professional event lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'autograph') {
          prompt = `A professional photograph showing Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, focused expression) signing an autograph for one person (keeping their original face, looking excited), both visible in the shot, Shane signing boxing memorabilia, authentic setting, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        } else if (selectedPreset === 'shane-special') {
          prompt = `A professional photograph of two people, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, warm smile), standing together in a special pose, both smiling at camera, professional portrait style, excellent lighting, photorealistic, high detail, 4K, sharp focus`;
        } else {
          prompt = `A professional photograph of two people, one person (keeping their original face) and Sugar Shane Mosley (African American former professional boxer, athletic build, goatee, friendly expression), standing together and smiling, friendly pose, professional lighting, photorealistic, high detail, 4K, sharp focus`;
        }

        // Prepare data for API request - Use fan-together with V2 for superior quality
        const data = {
          // Core parameters required by the API
          model_name: 'kling-v2', // Use V2 model for superior face reference and image quality
          prompt: prompt, // Detailed prompt with Shane's physical description

          // Fan-together parameters with V2 enhanced capabilities
          image: userImageBase64, // User's photo as the primary image (face will be preserved)
          image_reference: 'face', // V2 parameter for superior face preservation

          // Optional parameters with appropriate values for V2 model
          aspect_ratio: '3:2', // Better for photos with two people standing side by side
          n: 1, // Generate a single image

          // Custom parameters for our API layer - Use fan-together with V2
          generationType: 'fan-together', // Use fan-together with V2's superior capabilities
          referenceImageUrl: `data:image/jpeg;base64,${influencerImageBase64}`, // Shane's image for reference
          userImageUrl: `data:image/jpeg;base64,${userImageBase64}`, // User's image as primary
          influencerImage: `data:image/jpeg;base64,${influencerImageBase64}`, // Shane's image for context
        };

        // Log the request parameters (with sensitive data truncated)
        console.log('🚀 AI Generation Request (Fan-Together V2):', {
          model: data.model_name,
          generationType: data.generationType,
          promptLength: data.prompt.length,
          aspectRatio: data.aspect_ratio,
          hasUserImage: !!data.userImageUrl,
          hasInfluencerImage: !!data.influencerImage,
          hasReferenceImage: !!data.referenceImageUrl,
          imageReference: data.image_reference,
          selectedPreset: selectedPreset,
          shaneImagePath: shaneImagePath,
        });

        // Create task
        console.log('🚀 Sending request to AI media generation API');
        const response = await fetch('/api/ai-media-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        // Parse the response
        const responseText = await response.text();
        console.log(`📡 API Response (${response.status}):`, responseText);

        let result: APIResponse;
        try {
          result = JSON.parse(responseText) as APIResponse;
        } catch (parseError) {
          console.error('❌ Failed to parse API response:', parseError);
          throw new Error(`Invalid API response: ${responseText}`);
        }

        if (!response.ok) {
          // Extract the error message from the response
          const errorMessage =
            result.message || 'Failed to create AI generation task';
          console.error('❌ AI generation error:', errorMessage);
          throw new Error(errorMessage);
        }

        // Start polling for results
        if (result.taskId) {
          setCurrentTask({
            taskId: result.taskId,
            status: result.status as AITask['status'],
            resultUrl: result.resultUrl,
            error: result.error,
          });
          pollTaskStatus(result.taskId);
        } else {
          throw new Error('Invalid response from AI generation API');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to generate image');
        setCurrentTask(null);
      } finally {
        setIsGenerating(false);
      }
    };

    // Helper function to load an image and convert to base64
    const loadImageAsBase64 = (imagePath: string): Promise<string> => {
      console.log(`🖼️ Loading image from path: ${imagePath}`);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle CORS if needed
        img.onload = () => {
          console.log(
            `✅ Image loaded successfully: ${img.width}x${img.height}`,
          );
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg');
          const base64 = dataURL.split(',')[1]; // Remove the prefix
          console.log(
            `✅ Image converted to base64: ${base64.substring(0, 20)}... (${base64.length} chars)`,
          );
          resolve(base64);
        };
        img.onerror = (error) => {
          console.error(`❌ Failed to load image from ${imagePath}:`, error);
          reject(new Error(`Failed to load preset image: ${imagePath}`));
        };
        img.src = imagePath;
      });
    };

    const pollTaskStatus = async (taskId: string) => {
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      const poll = async () => {
        try {
          console.log(
            `🔄 Polling task status (attempt ${attempts + 1}/${maxAttempts})...`,
          );
          const response = await fetch(`/api/ai-media-generation/${taskId}`);

          // Parse the response with better error handling
          const responseText = await response.text();
          console.log(
            `📡 Status API Response (${response.status}):`,
            responseText,
          );

          let result: APIResponse;
          try {
            result = JSON.parse(responseText) as APIResponse;
          } catch (parseError) {
            console.error(
              '❌ Failed to parse status API response:',
              parseError,
            );
            throw new Error(`Invalid status API response: ${responseText}`);
          }

          if (!response.ok) {
            throw new Error(result.message || 'Failed to check status');
          }

          console.log(`✅ Task status: ${result.status}`, result);

          setCurrentTask((prev) =>
            prev
              ? {
                  ...prev,
                  status: result.status as AITask['status'],
                  resultUrl: result.resultUrl,
                  error: result.error,
                }
              : null,
          );

          if (result.status === 'succeed' || result.status === 'failed') {
            setIsGenerating(false);
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Check every 5 seconds
          } else {
            setError('Generation timed out. Please try again.');
            setIsGenerating(false);
            setCurrentTask(null);
          }
        } catch (err) {
          console.error('Polling failed:', err);
          setError('Failed to check generation status');
          setIsGenerating(false);
          setCurrentTask(null);
        }
      };

      poll();
    };

    const fileToBase64 = (file: File): Promise<string> => {
      console.log(
        `📄 Converting file to base64: ${file.name} (${file.size} bytes, ${file.type})`,
      );
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
          console.log(
            `✅ File converted to base64: ${base64.substring(0, 20)}... (${base64.length} chars)`,
          );
          resolve(base64);
        };
        reader.onerror = (error) => {
          console.error(`❌ Failed to convert file to base64:`, error);
          reject(error);
        };
      });
    };

    // Helper function to show errors
    const showDownloadError = (message: string) => {
      console.error(message);
      setError(message);
    };
    
    const handleDownload = async () => {
      try {
        // First try to get the image from our smart storage system
        if (currentTask?.storageReference) {
          console.log(`📥 Attempting to download from ${currentTask.storageType}: ${currentTask.storageReference}`);
          
          // Import the storage manager
          const { retrieveData } = await import('~/utils/storageManager');
          
          // Try to retrieve the data
          const imageData = await retrieveData(currentTask.storageReference);
          
          if (imageData) {
            console.log(`📥 Successfully retrieved image from ${currentTask.storageType}`);
            const link = document.createElement('a');
            link.href = imageData; // Image data can be used directly as the href
            link.download = `ai-generated-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
          } else {
            console.warn(`Image not found in ${currentTask.storageType}, checking alternatives`);
          }
        }
        
        // Legacy: Try from localStorage if we have the key
        if (currentTask?.localStorageKey) {
          try {
            // Get base64 data from localStorage
            const base64Data = localStorage.getItem(currentTask.localStorageKey);
            
            if (base64Data) {
              console.log(`📥 Downloading from legacy localStorage: ${currentTask.localStorageKey}`);
              const link = document.createElement('a');
              link.href = base64Data; // Base64 data can be used directly as the href
              link.download = `ai-generated-${Date.now()}.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              return;
            }
          } catch (error) {
            console.warn('Error accessing legacy localStorage for download:', error);
          }
        }
        
        // Try direct Cloudinary URL if available
        if (currentTask?.cloudinaryUrl) {
          console.log(`📥 Downloading from Cloudinary URL`);
          const link = document.createElement('a');
          link.href = currentTask.cloudinaryUrl;
          link.download = `ai-generated-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
        
        // Last resort: original result URL
        if (currentTask?.resultUrl) {
          console.log(`📥 Downloading from original result URL`);
          const link = document.createElement('a');
          link.href = currentTask.resultUrl;
          link.download = `ai-generated-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          showDownloadError('No image available for download');
        }
      } catch (error) {
        console.error('Download error:', error);
        showDownloadError('Failed to download image');
      }
    };

    const handleShare = async () => {
      // For sharing, we need to use the cloud URL since Web Share API works with URLs
      // localStorage base64 images can't be shared directly with the share API
      
      // If we have a cloud URL, use it for sharing
      if (currentTask?.resultUrl && navigator.share) {
        try {
          // Always use the cloud URL for sharing
          await navigator.share({
            title: aiMediaGeneration.title,
            text:
              aiMediaGeneration.shareText ||
              `Check out my AI-generated photo with ${config.influencerName}!`,
            url: currentTask.resultUrl,
          });
        } catch (err) {
          console.log('Sharing failed:', err);
        }
      }
    };

    const reset = () => {
      setSelectedFile(null);
      setPreviewUrl('');
      setCurrentTask(null);
      setError('');
      setSelectedPreset(null);
      // Don't reset pose or product selection
    };

    const handlePresetSelect = (presetId: string) => {
      // Reset any user uploaded file
      setSelectedFile(null);
      setPreviewUrl('');

      // Set the selected preset
      setSelectedPreset(presetId);

      // Clear any previous errors
      setError('');
    };

    // Authentication Prompt - Consistent Height
    if (showAuthPrompt) {
      // Comment out auth prompt for testing
      /*
      return (
        <section className="pt-28 pb-16 bg-secondary/80 backdrop-blur-sm min-h-[80vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <a
                  href="/"
                  className="text-primary hover:text-primary-600 text-xs mb-4 flex items-center mx-auto bg-secondary/30 px-3 py-1 rounded-md border border-primary/10"
                >
                  ← Back to Home
                </a>
              </div>
              <div className="bg-secondary/40 backdrop-blur-md rounded-lg p-6 shadow-md">
                <AuthPrompt
                  title={aiMediaGeneration.loginPromptTitle}
                  message={aiMediaGeneration.loginPromptMessage}
                  returnUrl="/ai-photo-generator"
                />
              </div>
            </div>
          </div>
        </section>
      );
      */
    }

    // Upload Interface (authenticated users or no auth required) - Clean, Consistent Height
    return (
      <section className="pt-28 pb-16 bg-secondary/80 backdrop-blur-sm min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <a
              href="/"
              className="text-primary hover:text-primary-600 text-xs mb-4 flex items-center mx-auto bg-secondary/30 px-3 py-1 rounded-md border border-primary/10"
            >
              ← Back to Home
            </a>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {aiMediaGeneration.title}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-2">
              {aiMediaGeneration.description}
            </p>
            <div className="flex justify-center space-x-6 mt-4 mb-6">
              <div className="flex items-center text-gray-300">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-primary text-xs font-bold">1</span>
                </div>
                <span className="text-xs">Choose a pose</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-primary text-xs font-bold">2</span>
                </div>
                <span className="text-xs">Upload your photo</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-primary text-xs font-bold">3</span>
                </div>
                <span className="text-xs">Generate & enjoy!</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Usage limit reached - Cleaner */}
            {usageInfo && !usageInfo.canGenerate ? (
              <div className="bg-secondary/40 backdrop-blur-md border border-red-500/30 rounded-lg p-8 text-center shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {aiMediaGeneration.limitReachedTitle}
                </h3>
                <p className="text-gray-300 mb-4">
                  {aiMediaGeneration.limitReachedMessage}
                </p>
                <div className="bg-secondary/30 p-4 rounded-md border border-primary/10">
                  <p className="text-gray-400 text-xs mb-2">
                    Usage:{' '}
                    <span className="text-primary font-bold">
                      {usageInfo.currentUsage}/{usageInfo.limit}
                    </span>{' '}
                    generations used
                  </p>
                  <p className="text-gray-400 text-xs">
                    Resets:{' '}
                    <span className="text-white">
                      {usageInfo.resetDate.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Upload + Options */}
                <div className="space-y-4">
                  {/* Preset Selection Section */}
                  <div className="bg-secondary/40 backdrop-blur-md border border-primary/20 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                      <Users className="w-4 h-4 text-primary mr-2" />
                      Step 1: Choose a Pose with Sugar Shane
                    </h3>

                    <p className="text-gray-300 text-xs mb-4">
                      Select how you want to appear with Sugar Shane Mosley in
                      your AI-generated photo
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {presetImages.map((preset) => (
                        <div
                          key={preset.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                            selectedPreset === preset.id
                              ? 'border-primary'
                              : 'border-gray-600/30 hover:border-primary/30'
                          }`}
                          onClick={() => handlePresetSelect(preset.id)}
                        >
                          <div className="relative h-32">
                            <img
                              src={preset.imagePath}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                            {selectedPreset === preset.id && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h4 className="text-white text-xs font-medium mb-1">
                              {preset.name}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="bg-secondary/40 backdrop-blur-md border border-primary/20 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                      <Upload className="w-4 h-4 text-primary mr-2" />
                      Step 2: Upload Your Photo
                    </h3>

                    <p className="text-gray-300 text-xs mb-4">
                      Upload a clear photo of yourself to generate a picture
                      with Sugar Shane Mosley
                    </p>

                    {!selectedFile ? (
                      <div
                        className="border border-dashed border-primary/30 rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="text-white text-sm mb-2">
                          {aiMediaGeneration.placeholderText}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Max {aiMediaGeneration.maxFileSize}MB •{' '}
                          {aiMediaGeneration.allowedFormats
                            .join(', ')
                            .toUpperCase()}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative rounded-md overflow-hidden border border-primary/20">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={reset}
                            className="absolute top-2 right-2 bg-secondary/70 text-white p-1 rounded-md hover:bg-secondary/90 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-gray-300 text-xs">
                          {selectedFile.name}
                        </p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={aiMediaGeneration.allowedFormats
                        .map((format) => `.${format}`)
                        .join(',')}
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {error && (
                      <div className="flex items-center mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                        <p className="text-red-300 text-xs">{error}</p>
                      </div>
                    )}
                  </div>

                  {/* Pose Selection - Removed as we now use presets for pose selection */}

                  <button
                    onClick={handleGenerate}
                    disabled={!selectedFile || !selectedPreset || isGenerating}
                    className="w-full bg-primary hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-background font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Generate Your Photo with Sugar Shane
                      </>
                    )}
                  </button>

                  {/* Usage Info for authenticated users - Minimal */}
                  {usageInfo && (
                    <div className="bg-secondary/40 backdrop-blur-md border border-primary/20 rounded-md p-4">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                        <Users className="w-3 h-3 text-primary mr-2" />
                        Your Usage
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs">
                            Generations Used:
                          </span>
                          <span className="text-primary font-bold text-xs">
                            {usageInfo.currentUsage}/{usageInfo.limit}
                          </span>
                        </div>
                        <div className="w-full bg-secondary/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(usageInfo.currentUsage / usageInfo.limit) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Resets:</span>
                          <span className="text-white">
                            {usageInfo.resetDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Result Section - Cleaner */}
                <div className="space-y-4">
                  <div className="bg-secondary/40 backdrop-blur-md border border-primary/20 rounded-md p-6 shadow-md">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Sparkles className="w-4 h-4 text-primary mr-2" />
                      Your Result
                    </h3>

                    {!currentTask ? (
                      <div className="bg-secondary/30 rounded-md p-8 text-center border border-primary/10">
                        <Sparkles className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 text-xs">
                          Your AI photo with Sugar Shane Mosley will appear here
                        </p>
                        {selectedPreset === 'celebrity-style' && (
                          <p className="text-primary text-xs mt-2">
                            Celebrity Style with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'meet-greet' && (
                          <p className="text-primary text-xs mt-2">
                            Meet & Greet with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'fan-love' && (
                          <p className="text-primary text-xs mt-2">
                            Fan Love with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'boxing-ring' && (
                          <p className="text-primary text-xs mt-2">
                            Boxing Ring with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'championship' && (
                          <p className="text-primary text-xs mt-2">
                            Championship with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'training-session' && (
                          <p className="text-primary text-xs mt-2">
                            Training Session with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'red-carpet' && (
                          <p className="text-primary text-xs mt-2">
                            Red Carpet with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'autograph' && (
                          <p className="text-primary text-xs mt-2">
                            Autograph with Sugar Shane Mosley
                          </p>
                        )}
                        {selectedPreset === 'shane-special' && (
                          <p className="text-primary text-xs mt-2">
                            Shane Special with Sugar Shane Mosley
                          </p>
                        )}
                      </div>
                    ) : currentTask.status === 'submitted' ||
                      currentTask.status === 'processing' ? (
                      <div className="bg-secondary/30 rounded-md p-8 text-center border border-primary/20">
                        <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
                        <p className="text-white text-sm mb-2">
                          {aiMediaGeneration.processingMessage}
                        </p>
                        <p className="text-gray-400 text-xs">
                          This usually takes 1-3 minutes
                        </p>
                      </div>
                    ) : currentTask.status === 'succeed' &&
                      currentTask.resultUrl ? (
                      <div className="space-y-4">
                        <div className="relative rounded-md overflow-hidden border border-primary/30">
                          <img
                            src={currentTask.resultUrl}
                            alt="AI Generated Result"
                            className="w-full h-auto object-cover"
                            onLoad={async (e) => {
                              // When the image loads successfully, store it using our smart storage manager
                              try {
                                const imageUrl = currentTask.resultUrl;
                                if (imageUrl) {
                                  // Create a unique key for this AI-generated image
                                  const storageKey = `ai_photo_${Date.now()}`;
                                  
                                  // Get the image data by drawing it to a canvas
                                  const canvas = document.createElement('canvas');
                                  const ctx = canvas.getContext('2d');
                                  const img = e.target as HTMLImageElement;
                                  
                                  // Set canvas dimensions to match image
                                  canvas.width = img.naturalWidth;
                                  canvas.height = img.naturalHeight;
                                  
                                  // Draw image to canvas
                                  ctx?.drawImage(img, 0, 0);
                                  
                                  // Get base64 data
                                  const base64Data = canvas.toDataURL('image/jpeg', 0.9);
                                  
                                  // Import the storage manager
                                  const { storeData } = await import('~/utils/storageManager');
                                  
                                  // Store using the smart storage manager
                                  const storageResult = await storeData(storageKey, base64Data, {
                                    cloudinaryOptions: {
                                      folder: 'ai-photos',
                                      filename: `ai-photo-${Date.now()}.jpg`,
                                    }
                                  });
                                  
                                  console.log(`📸 AI photo saved to ${storageResult.storageType}: ${storageResult.reference}`);
                                  
                                  // Update the current task with storage reference
                                  setCurrentTask(prev => 
                                    prev ? {
                                      ...prev,
                                      storageReference: storageResult.reference,
                                      storageType: storageResult.storageType,
                                      cloudinaryUrl: storageResult.url,
                                      // Keep the original URL as fallback
                                      originalUrl: prev.resultUrl
                                    } : null
                                  );
                                }
                              } catch (err) {
                                console.warn('Failed to save image to storage:', err);
                                // Continue showing the cloud image if storage fails
                              }
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-primary/80 px-2 py-1 rounded-md">
                            <p className="text-background text-xs font-bold">
                              AI GENERATED
                            </p>
                          </div>
                        </div>
                        <p className="text-green-400 text-xs flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2" />
                          {aiMediaGeneration.successMessage}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="flex-1 bg-primary hover:bg-primary-600 text-background font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                          <button
                            onClick={handleShare}
                            className="flex-1 bg-secondary/50 hover:bg-secondary/60 text-white border border-primary/20 font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </button>
                        </div>
                        
                        {/* Add to Cart Button for AI photo prints */}
                        {config.aiMediaGeneration?.enablePrinting && (
                          <button
                            onClick={() => {
                              // Create a custom product for this AI photo
                              try {
                                console.log('🛒 Adding AI photo to cart');
                                
                                // Use the most appropriate image reference for the cart
                                let imageUrl = null;
                                
                                // First try the smart storage reference if available
                                if (currentTask?.storageReference) {
                                  imageUrl = currentTask.storageReference;
                                  console.log(`🛒 Using ${currentTask.storageType} reference for cart: ${imageUrl}`);
                                }
                                // Then try Cloudinary URL if available
                                else if (currentTask?.cloudinaryUrl) {
                                  imageUrl = currentTask.cloudinaryUrl;
                                  console.log(`🛒 Using Cloudinary URL for cart: ${imageUrl}`);
                                }
                                // Legacy: Try localStorage reference
                                else if (currentTask?.localStorageKey) {
                                  const base64Data = localStorage.getItem(currentTask.localStorageKey);
                                  if (base64Data) {
                                    const localStorageUrl = `localStorage://${currentTask.localStorageKey}`;
                                    imageUrl = localStorageUrl;
                                    console.log(`🛒 Using legacy localStorage reference for cart: ${localStorageUrl}`);
                                  }
                                }
                                
                                // Last resort: Use the original result URL
                                if (!imageUrl && currentTask?.resultUrl) {
                                  imageUrl = currentTask.resultUrl;
                                  console.log(`🛒 Using original result URL for cart as fallback`);
                                }
                                
                                if (imageUrl) {
                                  // Create a cart item with a special note
                                  const cartForm = document.createElement('form');
                                  cartForm.method = 'post';
                                  cartForm.action = '/cart';
                                  
                                  // Create a hidden input for the design image
                                  const designInput = document.createElement('input');
                                  designInput.type = 'hidden';
                                  designInput.name = 'customDesignImage';
                                  designInput.value = imageUrl;
                                  cartForm.appendChild(designInput);
                                  
                                  // Create a hidden input for the product ID (AI photo print product)
                                  const productInput = document.createElement('input');
                                  productInput.type = 'hidden';
                                  productInput.name = 'id';
                                  productInput.value = config.aiMediaGeneration?.printProductId || 'ai-photo-print';
                                  cartForm.appendChild(productInput);
                                  
                                  // Create a hidden input for the quantity
                                  const quantityInput = document.createElement('input');
                                  quantityInput.type = 'hidden';
                                  quantityInput.name = 'quantity';
                                  quantityInput.value = '1';
                                  cartForm.appendChild(quantityInput);
                                  
                                  // Add to body and submit
                                  document.body.appendChild(cartForm);
                                  cartForm.submit();
                                  document.body.removeChild(cartForm);
                                } else {
                                  throw new Error('No image available for cart');
                                }
                              } catch (error) {
                                console.error('Failed to add to cart:', error);
                                setError('Failed to add to cart. Please try downloading and ordering later.');
                              }
                            }}
                            className="w-full bg-primary/80 hover:bg-primary text-background font-bold py-2 px-3 rounded-md transition-colors mt-2 flex items-center justify-center"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Order Print
                          </button>
                        )}
                        
                        <button
                          onClick={reset}
                          className="w-full bg-secondary/30 hover:bg-secondary/40 text-gray-300 hover:text-white border border-primary/10 py-2 px-3 rounded-md transition-colors mt-2"
                        >
                          Create Another
                        </button>
                      </div>
                    ) : currentTask.status === 'failed' ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-md p-6 text-center">
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                        <p className="text-red-300 mb-4 text-xs">
                          {currentTask.error || 'Generation failed'}
                        </p>
                        <button
                          onClick={reset}
                          className="bg-primary hover:bg-primary-600 text-background font-bold py-2 px-4 rounded-md transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error rendering AIPhotoGenerator component:', error);
    // Provide a fallback UI
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-300 mt-4">
          There was an error loading this feature. Please try again later.
        </p>
        <a href="/" className="text-primary hover:underline mt-4 inline-block">
          Return to homepage
        </a>
      </div>
    );
  }
}
