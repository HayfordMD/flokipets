import { POST } from '../[...path]+api';

// Mock fetch globally
global.fetch = jest.fn();

describe('Auth API - Remember Me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NCB_INSTANCE = 'test-instance';
    process.env.NCB_AUTH_API_URL = 'https://api.test.com';
  });

  it('adds Max-Age=2592000 to Set-Cookie when rememberMe is true', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    // Mock the upstream response from NoCodeBackend
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: {
        getSetCookie: () => ['session=123; Domain=app.nocodebackend.com; HttpOnly; Secure']
      },
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true }))
    });

    const request = new Request(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost'}/api/auth/sign-in/email`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password', rememberMe: true })
    });

    const response = await POST(request);
    
    const setCookieHeaders = response.headers.get('Set-Cookie');
    expect(setCookieHeaders).toContain('session=123');
    expect(setCookieHeaders).toContain('Max-Age=2592000');
    expect(setCookieHeaders).not.toContain('Domain=');
  });

  it('removes Max-Age and Expires to create a session cookie when rememberMe is false', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    // Mock upstream response returning a cookie with Max-Age
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: {
        getSetCookie: () => ['session=123; Domain=app.nocodebackend.com; Max-Age=3600; Expires=Wed, 21 Oct 2026 07:28:00 GMT']
      },
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true }))
    });

    const request = new Request(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost'}/api/auth/sign-in/email`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password', rememberMe: false })
    });

    const response = await POST(request);
    
    const setCookieHeaders = response.headers.get('Set-Cookie');
    expect(setCookieHeaders).toContain('session=123');
    expect(setCookieHeaders).not.toContain('Max-Age=');
    expect(setCookieHeaders).not.toContain('Expires=');
    expect(setCookieHeaders).not.toContain('Domain=');
  });
});
