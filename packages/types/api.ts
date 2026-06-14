export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface ApiError {
  detail: ErrorDetail | string;
}
