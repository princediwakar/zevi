/**
 * Retries an asynchronous operation with exponential backoff.
 * 
 * @param fn The async function to retry
 * @param retries Number of retries (default 3)
 * @param delay Initial delay in ms (default 1000)
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.warn(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(fn, retries - 1, delay * 2);
  }
}
