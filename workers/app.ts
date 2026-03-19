import {createRequestHandler} from 'react-router';
import {createAppLoadContext} from '~/lib/context';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    // Preserve Hydrogen's existing context structure
    storefront: any;
    session: any;
    cart: any;
    customerAccount: any;
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

// Static asset file extensions that should be served directly
const STATIC_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|avif|heic|svg|ico|mp4|mov|webm|mp3|wav|ogg|pdf|woff|woff2|ttf|eot|otf|css|js|json|xml|txt|map)$/i;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      const url = new URL(request.url);

      // Serve static assets directly via ASSETS binding if available
      if (STATIC_EXTENSIONS.test(url.pathname) && (env as any).ASSETS) {
        try {
          const assetResponse = await (env as any).ASSETS.fetch(request);
          if (assetResponse && assetResponse.status !== 404) {
            return assetResponse;
          }
        } catch (e) {
          // Fall through to app handler
        }
      }

      // Create a timeout for the entire request
      const timeout = 10000; // 10 second timeout

      // Create a promise that resolves with the response
      const responsePromise = (async () => {
        // Create Hydrogen's app load context (includes storefront, session, etc.)
        const hydrogenContext = await createAppLoadContext(request, env, ctx);

        // Merge with Cloudflare context
        const appLoadContext = {
          ...hydrogenContext,
          cloudflare: {env, ctx},
        };

        const response = await requestHandler(request, appLoadContext);

        // Handle Hydrogen session commits
        if (hydrogenContext.session.isPending) {
          response.headers.set(
            'Set-Cookie',
            await hydrogenContext.session.commit(),
          );
        }

        return response;
      })();

      // Create a timeout promise
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);
      });

      // Race the response against the timeout
      return await Promise.race([responsePromise, timeoutPromise]).catch(
        (error) => {
          console.error('Worker error:', error);
          return new Response('Request timed out or failed', {status: 500});
        },
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', {status: 500});
    }
  },
} satisfies ExportedHandler<Env>;
