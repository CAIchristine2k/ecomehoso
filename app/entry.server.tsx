import type {AppLoadContext} from 'react-router';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://1vp61h-dm.myshopify.com',
      'http://localhost:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'ws://*.tryhydrogen.dev:*',
      'https://*.klingai.com',
      'https://s21-kling.klingai.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'http://localhost:*',
      'https://res.cloudinary.com',
      'https://cloudinary.com',
      'https://*.klingai.com',
      'https://s21-kling.klingai.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
