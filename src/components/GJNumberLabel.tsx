interface GJNumberLabelProps {
  description: string;
  number: string;
  details?: any;
}
const GJNumberLabel: React.FC<GJNumberLabelProps> = ({
  description,
  number,
  details = null,
}: GJNumberLabelProps) => {
  return (
    <div>
      <span>{description}</span>
      <span>{number}</span>
      {details && (
        <div className="text-base">
          <h6>Details:</h6>
          <span>Bitstamp: ${details.bitstamp}</span> <br />
          <span>Coinbase: ${details.coinbase}</span> <br />
          <span>Bitfinex: ${details.bitfinex}</span>
        </div>
      )}
    </div>
  );
};

export default GJNumberLabel;
