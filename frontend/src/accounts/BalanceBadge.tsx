type Props = {
  balance: {
    available: number;
    current: number;
    currency: string;
  };
};

const BalanceBadge = ({ balance }: Props) => {
  return (
    <div className="text-right">
      <p className="text-sm font-semibold text-gray-900">
        {balance.currency} {balance.current.toFixed(2)}
      </p>
      <p className="text-xs text-gray-500">
        Available: {balance.currency} {balance.available.toFixed(2)}
      </p>
    </div>
  );
};

export default BalanceBadge;
