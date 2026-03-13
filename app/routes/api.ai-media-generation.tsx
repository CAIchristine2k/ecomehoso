import type {ActionFunctionArgs} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {CUSTOMER_METAFIELD_UPDATE} from '~/graphql/customer-account/CustomerUpdateMutation';

const KLING_API_BASE = 'https://api-singapore.klingai.com';

interface KlingAIResponse {
  code: number;
  message: string;
  request_id: string;
  data?: {
    task_id: string;
    task_status: string;
    created_at: number;
    updated_at: number;
  };
}

// Base64URL encode function for JWT
function base64URLEncode(str: ArrayBuffer): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(str)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Generate JWT token using Web Crypto API (compatible with Cloudflare Workers)
async function generateKlingToken(
  accessKey: string,
  secretKey: string,
): Promise<string> {
  if (!accessKey || !secretKey) {
    throw new Error('KlingAI API credentials not configured');
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    iss: accessKey,
    exp: Math.floor(Date.now() / 1000) + 1800, // 30 minutes from now
    nbf: Math.floor(Date.now() / 1000) - 5, // 5 seconds ago
  };

  // Using exactly the same JSON stringification format as KlingAI examples
  const headerJson = JSON.stringify(header);
  const payloadJson = JSON.stringify(payload);

  // Encode header and payload
  const encodedHeader = base64URLEncode(new TextEncoder().encode(headerJson));
  const encodedPayload = base64URLEncode(new TextEncoder().encode(payloadJson));

  // Create signature
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data),
  );
  const encodedSignature = base64URLEncode(signature);

  const token = `${data}.${encodedSignature}`;

  // Log JWT token details for verification
  console.log('🔐 JWT TOKEN VERIFICATION DETAILS:');
  console.log('✅ Complete JWT Token:', token);
  console.log('✅ Token Parts:');
  console.log('   Header:', encodedHeader);
  console.log('   Payload:', encodedPayload);
  console.log('   Signature:', encodedSignature);
  console.log('✅ Decoded Payload:', payload);
  console.log('✅ Token Length:', token.length);
  console.log('✅ Generation Timestamp:', new Date().toISOString());
  console.log('✅ Formatted Authorization Header:', `Bearer ${token}`);

  // Verify there's exactly one space between Bearer and token
  const authHeader = `Bearer ${token}`;
  console.log('✅ Auth Header Check:', {
    totalLength: authHeader.length,
    startsWithBearer: authHeader.startsWith('Bearer '),
    bearerSpaceToken: authHeader === `Bearer ${token}`,
  });

  return token;
}

// Make the request body interface more flexible
interface AIGenerationRequest {
  // Legacy virtual try-on fields (keep for backward compatibility)
  userImage?: string; // Legacy: base64 data
  userImageUrl?: string; // User image URL
  influencerImage?: string;
  pose?: string;
  productImage?: string;
  clothImageUrl?: string;

  // New generation types
  generationType?:
    | 'fan-together'
    | 'image-reference'
    | 'text-only'
    | 'virtual-try-on'; // Keep virtual-try-on for backward compatibility
  prompt?: string;
  negativePrompt?: string;
  referenceImageUrl?: string;
  baseImageUrl?: string; // For image editing
  imageReference?: 'subject' | 'face';
  aspectRatio?: string;
  numberOfImages?: number;
}

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({message: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    // Get environment variables from context
    const KLING_ACCESS_KEY = context.env.KLING_ACCESS_KEY as string | undefined;
    const KLING_SECRET_KEY = context.env.KLING_SECRET_KEY as string | undefined;

    console.log('🔧 Environment check:', {
      hasAccessKey: !!KLING_ACCESS_KEY,
      accessKeyLength: KLING_ACCESS_KEY?.length || 0,
      hasSecretKey: !!KLING_SECRET_KEY,
      secretKeyLength: KLING_SECRET_KEY?.length || 0,
    });

    if (!KLING_ACCESS_KEY || !KLING_SECRET_KEY) {
      console.warn(
        '❌ KlingAI API credentials not configured in environment variables',
      );
      return new Response(
        JSON.stringify({
          message:
            'AI media generation service is not configured. Please check your environment variables.',
        }),
        {
          status: 503,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    // TESTING: Skip authentication for now
    console.log(
      '🧪 TESTING MODE: Skipping authentication checks for AI generation',
    );

    // TODO: Re-enable authentication for production
    // const isLoggedIn = await context.customerAccount.isLoggedIn();
    // if (!isLoggedIn) {
    //   return new Response(JSON.stringify({
    //     message: 'Authentication required'
    //   }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    // TODO: Re-enable usage tracking for production
    // const { data } = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);
    // const customer = data.customer;
    // ... usage limit checks ...

    // Parse request body with the new parameters
    const body = (await request.json()) as AIGenerationRequest;
    const {
      // Legacy fields
      userImage,
      userImageUrl,
      influencerImage,
      pose,
      productImage,
      // New fields
      generationType = 'text-only', // Default to text-only for cost optimization
      prompt,
      negativePrompt,
      referenceImageUrl,
      clothImageUrl,
      baseImageUrl,
      imageReference = 'subject',
      aspectRatio = '1:1',
      numberOfImages = 1,
    } = body;

    // Validation based on generation type
    if (generationType === 'virtual-try-on') {
      if (!userImage && !userImageUrl) {
        return new Response(
          JSON.stringify({
            message: 'User image or image URL is required for virtual try-on',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
    } else if (generationType === 'fan-together') {
      if (!prompt) {
        return new Response(
          JSON.stringify({
            message: 'Prompt is required for fan together generation',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
      if (!userImageUrl && !referenceImageUrl) {
        return new Response(
          JSON.stringify({
            message:
              'User image and target person/pet image are required for fan together',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
    } else if (generationType === 'image-reference') {
      if (!prompt) {
        return new Response(
          JSON.stringify({
            message: 'Prompt is required for image reference generation',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
      if (!referenceImageUrl) {
        return new Response(
          JSON.stringify({
            message:
              'Reference image is required for image reference generation',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
    } else if (generationType === 'text-only') {
      if (!prompt) {
        return new Response(
          JSON.stringify({
            message: 'Prompt is required for text-only generation',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }
    }

    // Generate JWT token for KlingAI
    console.log('🔑 Generating JWT token for KlingAI...');
    let token: string;
    try {
      token = await generateKlingToken(KLING_ACCESS_KEY, KLING_SECRET_KEY);
      console.log('✅ JWT token generated successfully');
    } catch (error) {
      console.error('❌ JWT token generation failed:', error);
      return new Response(
        JSON.stringify({
          message: 'Failed to generate authentication token',
        }),
        {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    let klingRequest: any;
    let apiEndpoint: string;

    // Helper function to fetch and convert image to base64
    const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
      // Skip conversion if already a base64 string
      if (
        imageUrl.startsWith('data:image/') ||
        (imageUrl.match(/^[A-Za-z0-9+/=]+$/) && imageUrl.length > 100)
      ) {
        console.log('Image URL appears to be base64 already, skipping fetch');
        // Extract the base64 part if it's a data URL
        const base64Match = imageUrl.match(/base64,(.+)/);
        return base64Match ? base64Match[1] : imageUrl;
      }

      // Log the URL we're trying to fetch (but mask it for privacy)
      const urlForLog =
        typeof imageUrl === 'string'
          ? `${imageUrl.substring(0, 30)}...${imageUrl.substring(imageUrl.length - 10)}`
          : 'invalid-url';
      console.log(`Fetching image from: ${urlForLog}`);

      try {
        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: {
            Accept: 'image/*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`Invalid content type: ${contentType}`);
        }

        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) {
          throw new Error('Empty image data received');
        }

        // Check image size limits (KlingAI has 10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (buffer.byteLength > maxSize) {
          throw new Error(
            `Image too large: ${buffer.byteLength} bytes (max ${maxSize} bytes)`,
          );
        }

        console.log(`Successfully fetched image: ${buffer.byteLength} bytes`);

        // Convert ArrayBuffer to base64 in chunks to avoid stack overflow with large images
        const uint8Array = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 8192; // Process in 8KB chunks

        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }

        return btoa(binary);
      } catch (error) {
        console.error(`Image fetch failed for ${urlForLog}:`, error);
        throw error;
      }
    };

    if (generationType === 'virtual-try-on') {
      // Legacy virtual try-on logic (keep for backward compatibility)
      let userImageBase64: string;

      if (userImage) {
        userImageBase64 = userImage;
      } else if (userImageUrl) {
        try {
          userImageBase64 = await fetchImageAsBase64(userImageUrl);
        } catch (error) {
          console.error('Failed to fetch user image:', error);
          return new Response(
            JSON.stringify({
              message: 'Failed to fetch user image from URL',
            }),
            {
              status: 400,
              headers: {'Content-Type': 'application/json'},
            },
          );
        }
      } else {
        return new Response(
          JSON.stringify({
            message: 'No user image provided',
          }),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          },
        );
      }

      klingRequest = {
        model_name: 'kolors-virtual-try-on-v1-5',
        human_image: userImageBase64,
      };

      // Get cloth image
      if (clothImageUrl) {
        try {
          klingRequest.cloth_image = await fetchImageAsBase64(clothImageUrl);
        } catch (error) {
          console.error('Failed to fetch cloth image:', error);
        }
      } else if (influencerImage) {
        klingRequest.cloth_image = influencerImage;
      }

      apiEndpoint = `${KLING_API_BASE}/v1/images/kolors-virtual-try-on`;
    } else if (generationType === 'fan-together') {
      // Use kling-v2 model for superior face blending and image quality
      const modelName = 'kling-v2';

      console.log(`🤝 Fan-together generation config (V2):`, {
        hasUserImage: !!userImageUrl,
        hasReferenceImage: !!referenceImageUrl,
        imageReference: 'face', // Set to 'face' for face preservation
        modelName,
      });

      klingRequest = {
        model_name: modelName,
        prompt: prompt,
        aspect_ratio: aspectRatio,
        n: numberOfImages,
        image_reference: 'face', // V2 has improved face reference capabilities
      };

              // For fan-together with V2, use the user's image as the base
        if (userImageUrl) {
          try {
            const userBase64 = await fetchImageAsBase64(userImageUrl);
            klingRequest.image = userBase64;
            console.log('✅ User image added as primary image for V2 fan-together');
          } catch (error) {
            console.error('Failed to fetch user image:', error);
            return new Response(
              JSON.stringify({
                message: 'Failed to fetch user image',
              }),
              {
                status: 400,
                headers: {'Content-Type': 'application/json'},
              },
            );
          }
        }

        // For V2, we can potentially use enhanced multi-image capabilities
        // V2 with image_reference='face' preserves the face from the input image
        // and uses the prompt to generate the scene with improved quality
        if (referenceImageUrl) {
          try {
            const hosoBase64 = await fetchImageAsBase64(referenceImageUrl);
            console.log('✅ Hoso reference image processed for V2 enhancement');
            
            // V2 model with face reference offers superior face preservation
            // and better understanding of detailed prompt descriptions
            // The enhanced V2 capabilities should produce more realistic results
          } catch (error) {
            console.error('Failed to fetch Hoso reference image:', error);
          }
        }

      apiEndpoint = `${KLING_API_BASE}/v1/images/generations`;
    } else if (generationType === 'image-reference') {
      // Use kling-v2 for superior image reference capabilities
      const modelName = 'kling-v2';

      console.log(`🖼️ Image-reference generation config (V2):`, {
        hasReferenceImage: !!referenceImageUrl,
        imageReference,
        modelName,
      });

      klingRequest = {
        model_name: modelName,
        prompt: prompt,
        aspect_ratio: aspectRatio,
        n: numberOfImages,
      };

      // Use the reference image with V2's enhanced capabilities
      if (referenceImageUrl) {
        try {
          klingRequest.image = await fetchImageAsBase64(referenceImageUrl);
          // V2 model provides superior style/content reference understanding
        } catch (error) {
          console.error('Failed to fetch reference image:', error);
          return new Response(
            JSON.stringify({
              message: 'Failed to fetch reference image',
            }),
            {
              status: 400,
              headers: {'Content-Type': 'application/json'},
            },
          );
        }
      }

      apiEndpoint = `${KLING_API_BASE}/v1/images/generations`;
    } else {
      // Text-only generation with V2
      console.log(`💭 Text-only generation config (V2):`, {
        hasNegativePrompt: !!negativePrompt,
        modelName: 'kling-v2',
      });

      klingRequest = {
        model_name: 'kling-v2',
        prompt: prompt,
        aspect_ratio: aspectRatio,
        n: numberOfImages,
      };

      // Add negative prompt for text-only generation (V2 has improved negative prompt handling)
      if (negativePrompt) {
        klingRequest.negative_prompt = negativePrompt;
      }

      apiEndpoint = `${KLING_API_BASE}/v1/images/generations`;
    }

    // Make request to KlingAI
    console.log('🚀 Making request to KlingAI:', {
      endpoint: apiEndpoint,
      generationType,
      promptLength: prompt?.length || 0,
      hasUserImage: !!userImageUrl,
      hasReferenceImage: !!referenceImageUrl,
    });

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(klingRequest),
    });

    console.log(
      '📡 KlingAI response status:',
      response.status,
      response.statusText,
    );

    let klingResult: KlingAIResponse;
    try {
      klingResult = (await response.json()) as KlingAIResponse;
    } catch (error) {
      console.error('❌ Failed to parse KlingAI response JSON:', error);
      return new Response(
        JSON.stringify({
          message: 'Invalid response from AI service',
        }),
        {
          status: 502,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    console.log('📋 KlingAI response:', {
      status: response.status,
      code: klingResult.code,
      message: klingResult.message,
      hasData: !!klingResult.data,
    });

    if (!response.ok || klingResult.code !== 0) {
      console.error('❌ KlingAI API error:', {
        httpStatus: response.status,
        apiCode: klingResult.code,
        message: klingResult.message,
        requestId: klingResult.request_id,
      });

      // Provide more specific error messages
      let errorMessage =
        klingResult.message || 'Failed to create AI generation task';
      if (response.status === 401) {
        errorMessage =
          'Authentication failed with KlingAI API. Please check your API credentials.';
      } else if (response.status === 403) {
        errorMessage =
          'Access denied by KlingAI API. Please check your account permissions.';
      } else if (response.status === 429) {
        if (klingResult.code === 1102) {
          errorMessage =
            'KlingAI account balance is insufficient. Please top up your account or check your billing status.';
        } else {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        }
      }

      return new Response(
        JSON.stringify({
          message: errorMessage,
          code: klingResult.code,
          requestId: klingResult.request_id,
        }),
        {
          status: response.status || 500,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    if (!klingResult.data) {
      return new Response(
        JSON.stringify({
          message: 'Invalid response from AI service',
        }),
        {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    // TODO: Update usage tracking when re-enabled
    // Note: Customer Account API doesn't support metafield updates directly
    // This would need to be implemented via Admin API or alternative storage
    console.log('🧪 TESTING MODE: AI generation completed (no usage tracking)');

    // Return the task information
    return new Response(
      JSON.stringify({
        taskId: klingResult.data.task_id,
        status: klingResult.data.task_status,
        createdAt: klingResult.data.created_at,
        updatedAt: klingResult.data.updated_at,
        generationType: generationType, // Include the generation type for polling
      }),
      {
        headers: {'Content-Type': 'application/json'},
      },
    );
  } catch (error) {
    console.error('AI media generation error:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to create AI generation task',
      }),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      },
    );
  }
}

// Handle other methods
export async function loader() {
  return new Response(JSON.stringify({message: 'Method not allowed'}), {
    status: 405,
    headers: {'Content-Type': 'application/json'},
  });
}
