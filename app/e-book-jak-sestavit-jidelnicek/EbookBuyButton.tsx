export function EbookBuyButton({ className, label = "CHCI E-BOOK!" }: { className?: string; label?: string }) {
  return (
    <a
      href="https://buy.stripe.com/28E7sL1pibfr6lla4leIw08"
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
