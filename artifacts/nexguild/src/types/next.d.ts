declare module "next" {
  export type Metadata = Record<string, unknown>;
  export type Viewport = Record<string, unknown>;
  export type NextConfig = Record<string, unknown>;
}
declare module "next/server" {
  export class NextRequest {
    headers: { get(name: string): string | null };
    json(): Promise<unknown>;
    nextUrl: { searchParams: URLSearchParams };
  }
  export class NextResponse {
    static json(body: unknown, init?: { status?: number }): NextResponse;
  }
}
declare module "next/headers" {
  export function headers(): { get(name: string): string | null };
  export function cookies(): { get(name: string): { value: string } | undefined };
}
