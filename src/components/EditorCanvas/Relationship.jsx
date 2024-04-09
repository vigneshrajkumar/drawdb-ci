import { useRef } from "react";
import { Cardinality } from "../../data/constants";
import { calcPath } from "../../utils/calcPath";
import { useTables, useSettings } from "../../hooks";

export default function Relationship({ data }) {
  const { settings } = useSettings();
  const { tables } = useTables();
  const pathRef = useRef();

  let cardinalityStart = "1";
  let cardinalityEnd = "1";

  switch (data.cardinality) {
    case Cardinality.MANY_TO_ONE:
      cardinalityStart = "n";
      cardinalityEnd = "1";
      break;
    case Cardinality.ONE_TO_MANY:
      cardinalityStart = "1";
      cardinalityEnd = "n";
      break;
    case Cardinality.ONE_TO_ONE:
      cardinalityStart = "1";
      cardinalityEnd = "1";
      break;
    default:
      break;
  }

  let cardinalityStartX = 0;
  let cardinalityEndX = 0;
  let cardinalityStartY = 0;
  let cardinalityEndY = 0;

  const cardinalityOffset = 28;

  if (pathRef.current) {
    const pathLength = pathRef.current.getTotalLength();
    const point1 = pathRef.current.getPointAtLength(cardinalityOffset);
    cardinalityStartX = point1.x;
    cardinalityStartY = point1.y;
    const point2 = pathRef.current.getPointAtLength(
      pathLength - cardinalityOffset
    );
    cardinalityEndX = point2.x;
    cardinalityEndY = point2.y;
  }

  return (
    <g className="select-none group">
      <path
        ref={pathRef}
        d={calcPath({
          ...data,
          startTable: {
            x: tables[data.startTableId].x,
            y: tables[data.startTableId].y,
          },
          endTable: {
            x: tables[data.endTableId].x,
            y: tables[data.endTableId].y,
          },
        })}
        stroke="gray"
        className="group-hover:stroke-sky-700"
        fill="none"
        strokeWidth={2}
        cursor="pointer"
      />
      {pathRef.current && settings.showCardinality && (
        <>
          <circle
            cx={cardinalityStartX}
            cy={cardinalityStartY}
            r="12"
            fill="grey"
            className="group-hover:fill-sky-700"
          />
          <text
            x={cardinalityStartX}
            y={cardinalityStartY}
            fill="white"
            strokeWidth="0.5"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {cardinalityStart}
          </text>
          <circle
            cx={cardinalityEndX}
            cy={cardinalityEndY}
            r="12"
            fill="grey"
            className="group-hover:fill-sky-700"
          />
          <text
            x={cardinalityEndX}
            y={cardinalityEndY}
            fill="white"
            strokeWidth="0.5"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {cardinalityEnd}
          </text>
        </>
      )}
    </g>
  );
}
