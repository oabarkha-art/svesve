import { useSiteSettings } from "@/contexts/SiteContentContext";
export function useContact() {
  const { value } = useSiteSettings();
  const artistEmail = value("contact.email");
  return {
    artistEmail,
    inquiryLink: (subject = "Anfrage zur Zusammenarbeit") =>
      `mailto:${encodeURIComponent(artistEmail)}?${new URLSearchParams({ cc: value("contact.cc"), subject })}`,
  };
}
