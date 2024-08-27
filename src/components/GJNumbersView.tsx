import { Key } from "react";
import GJNumberLabel from "./GJNumberLabel";

const GJNumbersView = ({ title, data }: {
  title: string;
  data: any;
}) => {
  return (
    <div className="gj-numbers-view">
      <h3>{title}</h3>
      <div className="numbers-list">
        {data.map((item: { description: string; number: string; }, index: Key) => (
          <GJNumberLabel
            key={index}
            description={item.description}
            number={item.number}
          />
        ))}
      </div>
    </div>
  );
};

export default GJNumbersView;
