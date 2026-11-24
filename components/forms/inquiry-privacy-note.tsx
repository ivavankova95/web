export function InquiryPrivacyNote({ className }: { className?: string }) {
  return (
    <p className={className}>
      Údaje z formuláře použiji k vyřízení zprávy. Přečti si{" "}
      <a href="/gdpr">informace o zpracování osobních údajů</a>.
    </p>
  );
}
