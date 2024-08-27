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
    <div className="">
      <span className="">{description}</span>
      <span className="">{number}</span>
      {details && (
        <>
          <h6>Details:</h6>
          <span className="">Bitstamp: {details.bitstamp}</span> <br />
          <span className="">Coinbase: {details.coinbase}</span> <br />
          <span className="">Bitfinex: {details.bitfinex}</span>
        </>
      )}
    </div>
  );
};

export default GJNumberLabel;
