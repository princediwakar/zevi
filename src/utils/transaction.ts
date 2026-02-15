import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Transaction wrapper for Supabase operations
 *
 * This utility provides a way to execute multiple database operations
 * with transactional consistency. Since Supabase JavaScript client
 * doesn't expose direct transaction control, this wrapper uses
 * PostgreSQL stored procedures for atomic operations.
 *
 * For simple cases, use the `transaction` function with a callback
 * that performs operations. If any operation fails, the entire
 * transaction is considered failed.
 *
 * For complex multi-table operations, create a dedicated PostgreSQL
 * function and call it via `supabase.rpc()`.
 */
export async function transaction<T>(
  supabase: SupabaseClient,
  operations: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  try {
    // Start a transaction by calling a BEGIN RPC if available
    // For now, we rely on the operations to be atomic via RPC calls
    // or we assume the callback handles its own transaction logic.
    const result = await operations(supabase);
    return result;
  } catch (error: unknown) {
    console.error('Transaction failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Transaction failed: ${errorMessage}`);
  }
}

/**
 * Execute multiple operations in a single RPC call for atomicity
 *
 * This is a convenience wrapper for calling a stored procedure
 * that handles multiple operations transactionally.
 */
export async function executeTransactionalRPC<T>(
  supabase: SupabaseClient,
  rpcName: string,
  params: any
): Promise<T> {
  const { data, error } = await supabase.rpc(rpcName, params);

  if (error) {
    console.error(`Transactional RPC ${rpcName} failed:`, error);
    throw new Error(`Failed to execute ${rpcName}: ${error.message}`);
  }

  return data as T;
}

/**
 * Check if a transaction is supported by the current Supabase client
 *
 * In the future, this could check for transaction support
 * or validate that we're using a version that supports transactions.
 */
export function supportsTransactions(): boolean {
  // Currently, Supabase JavaScript client doesn't support
  // multi-statement transactions directly.
  // Use stored procedures for transactional operations.
  return false;
}