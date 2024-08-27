interface GJNumberLabelProps {
  description: string;
  number: string;
}
const GJNumberLabel: React.FC<GJNumberLabelProps>  = ({
  description,
  number,
}: GJNumberLabelProps) => {
  return (
    <div className="gj-number-label">
      <span className="description">{description}</span>
      <span className="number">{number}</span>
    </div>
  );
};

export default GJNumberLabel;
