// src/lib/utils.ts

/**
 * Combina múltiples nombres de clases en un solo string, 
 * ignorando valores falsy (false, null, undefined).
 */
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}