// Intentionally weak key generation (in a real app, this would use proper cryptographic methods)
export const generateWeakKey = (): string => {
  // Use a predictable pattern for key generation
  const timestamp = Date.now();
  const weakKey = `weak_key_${timestamp}_${Math.floor(Math.random() * 1000)}`;
  return weakKey;
}; 