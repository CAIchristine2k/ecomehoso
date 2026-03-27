import {FormattedMoney} from '~/components/FormattedMoney';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useConfig} from '~/utils/themeContext';

export function ProductPrice({
  price,
  compareAtPrice,
  className = '',
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  className?: string;
}) {
  const config = useConfig();

  return (
    <div className={`${className}`}>
      {compareAtPrice ? (
        <div className="flex items-center gap-2">
          {price ? (
            <span className="font-medium text-primary">
              <FormattedMoney data={price} />
            </span>
          ) : null}
          <s className="text-sm text-primary-600">
            <FormattedMoney data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <span className="font-medium text-primary">
          <FormattedMoney data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
