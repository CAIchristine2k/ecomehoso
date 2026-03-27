import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/**
 * Formats money with € after the number (e.g., "29,90 €")
 */
export function FormattedMoney({
  data,
  className,
  withoutTrailingZeros = false,
}: {
  data: MoneyV2;
  className?: string;
  withoutTrailingZeros?: boolean;
}) {
  const amount = parseFloat(data.amount);
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: withoutTrailingZeros ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return <span className={className}>{formatted} €</span>;
}
