/**
 * Userful when workign with getWebProps and forwarding refs
 * @param refs 
 * @returns 
 */
export default function useMergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        ref.current = value;
      }
    });
  };
}