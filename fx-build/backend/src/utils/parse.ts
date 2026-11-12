/**
 * Shared JSON parsing utility.
 * Extracts the first {...} block from text then parses it,
 * falling back to a full JSON.parse. Returns null on failure.
 *
 * Returns `any` to preserve compatibility with the callers that
 * perform runtime-narrowed property access (e.g. p?.summary, p?.title).
 * Proper generic typing is a Phase 3 / Phase 4 concern.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonWithError(text: string): { value: any; error?: string } {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try {
    return { value: JSON.parse(jsonMatch ? jsonMatch[0] : text) }
  } catch (error) {
    return { value: null, error: error instanceof Error ? error.message : String(error) }
  }
}

export function safeParseJson(text: string): any {
  return parseJsonWithError(text).value
}

export function getSafeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return Object.entries(process.env).reduce((safeMessage, [name, value]) => {
    if (value && /(?:API_KEY|TOKEN|SECRET|PASSWORD)/i.test(name)) {
      return safeMessage.split(value).join('[REDACTED]')
    }
    return safeMessage
  }, message)
}
