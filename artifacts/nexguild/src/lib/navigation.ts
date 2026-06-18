import { useLocation, useParams as useWouterParams } from "wouter";
import { Link } from "wouter";

export function useRouter() {
  const [, navigate] = useLocation();
  return {
    push:    (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back:    () => window.history.back(),
    refresh: () => window.location.reload(),
  };
}

export function usePathname(): string {
  const [pathname] = useLocation();
  return pathname;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useWouterParams() as T;
}

export { Link };
