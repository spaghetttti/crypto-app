interface GJNumberLabelProps {
  description: string;
  number: string;
}
const GJNumberLabel: React.FC<GJNumberLabelProps> = ({
  description,
  number,
}: GJNumberLabelProps) => {
  return (
    <div>
      <span>{description}: {number}</span>
    </div>
  );
};

export default GJNumberLabel;
