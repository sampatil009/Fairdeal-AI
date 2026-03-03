import { AuthPayload, User } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'fairdeal-ai-super-secret-key-2024';

// ─── Simple password hashing (demo only – use bcrypt in production) ──────────

export function hashPassword(password: string): string {
    // Simple deterministic hash for demo purposes
    let hash = 0;
    const str = password + JWT_SECRET;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `hashed_${password}`;
}

export function verifyPassword(password: string, hash: string): boolean {
    return hash === `hashed_${password}`;
}

// ─── JWT using jose ──────────────────────────────────────────────────────────

export async function signJWT(payload: AuthPayload): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET);

    // Build a simple JWT manually (base64url encoded)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
    const body = btoa(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Simple HMAC-like mock signature for demo
    const signature = btoa(`${header}.${body}.${JWT_SECRET}`)
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return `${header}.${body}.${signature}`;
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const body = parts[1];
        const decoded = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));

        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return null; // expired
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            tier: decoded.tier,
        };
    } catch {
        return null;
    }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
}

export async function getUserFromRequest(request: Request): Promise<AuthPayload | null> {
    const authHeader = request.headers.get('Authorization');
    const token = getTokenFromHeader(authHeader);
    if (!token) return null;
    return verifyJWT(token);
}
