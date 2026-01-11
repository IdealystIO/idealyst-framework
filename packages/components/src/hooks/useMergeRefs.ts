/**
 * Useful when working with getWebProps and forwarding refs.
 * Accepts various ref types including callback refs and ref objects.
 * Uses a permissive type to handle refs from different React type versions in monorepos.
 * @param refs - Array of refs to merge (can include undefined values)
 * @returns A ref callback that updates all provided refs
 */
export default function useMergeRefs<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...refs: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        ref.current = value;
      }
    });
  };
}