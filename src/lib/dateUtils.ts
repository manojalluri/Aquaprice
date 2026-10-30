/**
 * Date utility for formatting timestamps in Asia/Kolkata (IST) timezone.
 */

export function getCurrentISTTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Formats an ISO date string into Indian Standard Time (IST)
 * Example output: "30 Oct 2026, 09:45 AM" or "30 October 2026, 09:45 AM"
 */
export function formatISTDateTime(isoString?: string | null, fullMonth = false): string {
  if (!isoString) return "N/A";
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";

    // Format using Intl.DateTimeFormat with Asia/Kolkata timezone
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: fullMonth ? 'long' : 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting IST date:", error);
    return isoString;
  }
}

/**
 * Returns two-line representation: Date on top, Time on bottom
 */
export function formatISTSplit(isoString?: string | null): { dateStr: string; timeStr: string } {
  if (!isoString) return { dateStr: "N/A", timeStr: "" };
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { dateStr: "N/A", timeStr: "" };

    const dateFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      dateStr: dateFormatter.format(date),
      timeStr: timeFormatter.format(date)
    };
  } catch {
    return { dateStr: "N/A", timeStr: "" };
  }
}

