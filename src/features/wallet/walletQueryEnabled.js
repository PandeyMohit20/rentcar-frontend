/**
 * Wallet data is private and should load only after auth restoration finishes.
 * Public navigation also uses this condition, so signed-out visitors make no
 * wallet request.
 */
export function walletQueryEnabled({ isRestoring, isAuthenticated }) {
  return !isRestoring && isAuthenticated
}
