export const artistEmail = "svea.fritzenkoetter00@gmail.com";

// CC is not displayed on the page, but is visible in the visitor's mail app.
export function inquiryLink(subject = "Anfrage zur Zusammenarbeit") {
  const params = new URLSearchParams({ cc: "abarkha@hotmail.com", subject });
  return `mailto:${artistEmail}?${params.toString()}`;
}
