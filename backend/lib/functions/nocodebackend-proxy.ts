import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const ncbInstance = process.env.NCB_INSTANCE;
    const ncbAuthUrl = process.env.NCB_AUTH_API_URL;
    const ncbDataUrl = process.env.NCB_DATA_API_URL;
    const ncbSecretKey = process.env.NCB_SECRET_KEY;

    if (!ncbInstance || !ncbAuthUrl || !ncbDataUrl || !ncbSecretKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables for proxy.' }),
      };
    }

    const origin = event.headers?.origin || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Database-Instance, Cookie, x-requested-with',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE, PATCH',
    };

    if (event.requestContext.http.method === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: corsHeaders,
        body: '',
      };
    }

    let path = event.rawPath || event.requestContext.http.path;
    
    // Strip the /api/ prefix if the frontend is still sending it
    if (path.startsWith('/api/')) {
      path = path.replace(/^\/api/, '');
    }

    // Determine the base URL based on the path
    const isAuth = path.startsWith('/auth/');
    const baseUrl = isAuth ? ncbAuthUrl : ncbDataUrl;

    // Remove the prefix from path since NoCodeBackend routes don't expect /auth/ or /data/
    // Example: /auth/sign-in/email -> /sign-in/email
    let targetPath = path;
    if (path.startsWith('/auth/')) {
        targetPath = path.replace(/^\/auth\//, '/');
    } else if (path.startsWith('/data/')) {
        targetPath = path.replace(/^\/data\//, '/');
    }

    // Construct the target URL properly without losing the base path
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanTargetPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    const targetUrl = new URL(`${cleanBaseUrl}/${cleanTargetPath}`);

    // Append all existing query string parameters
    if (event.queryStringParameters) {
      for (const [key, value] of Object.entries(event.queryStringParameters)) {
        if (value) {
          targetUrl.searchParams.append(key, value);
        }
      }
    }

    // Always append the instance parameter (must be lowercase for NCB routing)
    targetUrl.searchParams.set('instance', ncbInstance);

    // Extract headers from the incoming request to forward
    const headers = new Headers();
    if (event.headers) {
      for (const [key, value] of Object.entries(event.headers)) {
        // Skip host and other headers that shouldn't be forwarded
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'host' || lowerKey === 'connection' || lowerKey === 'x-forwarded-for') {
          continue;
        }
        if (value) {
          headers.append(key, value);
        }
      }
    }

    // Add necessary NoCodeBackend headers
    headers.set('X-Database-Instance', ncbInstance);
    // Include Authorization header for data requests (and auth just in case)
    headers.set('Authorization', `Bearer ${ncbSecretKey}`);

    // If there's a cookie, forward it
    if (event.cookies && event.cookies.length > 0) {
      headers.set('Cookie', event.cookies.join('; '));
    }

    const fetchOptions: RequestInit = {
      method: event.requestContext.http.method,
      headers: headers,
    };

    if (event.body) {
      fetchOptions.body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : event.body;
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

    const responseHeaders: Record<string, string> = {};
    const responseCookies: string[] = [];

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'set-cookie') {
        // Prepare cookie for cross-origin usage
        let cookie = value;
        cookie = cookie.replace(/Domain=[^;]+;?\s*/gi, '');
        cookie = cookie.replace(/SameSite=[^;]+;?\s*/gi, '');
        cookie = cookie.replace(/Secure;?\s*/gi, '');
        cookie = cookie.replace(/__Secure-/gi, '');
        
        // Always append SameSite=None and Secure for cross-origin proxy
        cookie = `${cookie.trim()}; SameSite=None; Secure`;
        responseCookies.push(cookie);
      } else if (lowerKey !== 'content-encoding' && lowerKey !== 'transfer-encoding') {
        responseHeaders[key] = value;
      }
    });

    const bodyBuffer = await response.arrayBuffer();
    const isText = responseHeaders['content-type']?.includes('text') || responseHeaders['content-type']?.includes('json');

    let bodyData: string;
    let isBase64Encoded = false;

    if (isText) {
      bodyData = new TextDecoder().decode(bodyBuffer);
    } else {
      bodyData = Buffer.from(bodyBuffer).toString('base64');
      isBase64Encoded = true;
    }

    return {
      statusCode: response.status,
      headers: { ...responseHeaders, ...corsHeaders },
      cookies: responseCookies.length > 0 ? responseCookies : undefined,
      body: bodyData,
      isBase64Encoded,
    };

  } catch (error: any) {
    console.error('Proxy error:', error);
    
    // Attempt to extract origin for error CORS headers
    const origin = event.headers?.origin || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
    };

    return {
      statusCode: 502,
      headers: { ...corsHeaders },
      body: JSON.stringify({ error: 'Bad Gateway', details: error.message }),
    };
  }
};
