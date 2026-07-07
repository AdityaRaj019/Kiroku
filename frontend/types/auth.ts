/**
 * User payload shape returned by the backend auth endpoints.
 *
 * Mirrors the `select` projection used in:
 *   - POST /api/v1/auth/register  (201 response)
 *   - POST /api/v1/auth/login     (200 response)
 *   - GET  /api/v1/auth/profile   (200 response)
 */
export interface UserPayload {
  id: number;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  exp?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Shape of a successful authentication response (login / register).
 */
export interface AuthResponse {
  message: string;
  user: UserPayload;
  accessToken: string;
}

/**
 * Shape of the token refresh response.
 */
export interface RefreshResponse {
  message: string;
  accessToken: string;
}
