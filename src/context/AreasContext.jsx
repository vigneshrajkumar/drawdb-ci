import { createContext, useState } from "react";
import { Action, ObjectType, defaultBlue } from "../data/constants";
import useUndoRedo from "../hooks/useUndoRedo";
import useTransform from "../hooks/useTransform";
import useSelect from "../hooks/useSelect";

export const AreasContext = createContext(null);

export default function AreasContextProvider({ children }) {
  const [areas, setAreas] = useState([]);
  const { transform } = useTransform();
  const { selectedElement, setSelectedElement } = useSelect();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addArea = (addToHistory = true, data) => {
    if (data) {
      setAreas((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      setAreas((prev) => [
        ...prev,
        {
          id: prev.length,
          name: `area_${prev.length}`,
          x: -transform.pan.x,
          y: -transform.pan.y,
          width: 200,
          height: 200,
          color: defaultBlue,
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.AREA,
          message: `Add new subject area`,
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteArea = (id, addToHistory = true) => {
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.AREA,
          data: areas[id],
          message: `Delete subject area`,
        },
      ]);
      setRedoStack([]);
    }
    setAreas((prev) =>
      prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i }))
    );
    if (id === selectedElement.id) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.NONE,
        id: -1,
        open: false,
      }));
    }
  };

  const updateArea = (id, values) => {
    setAreas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...values,
          };
        }
        return t;
      })
    );
  };

  return (
    <AreasContext.Provider
      value={{ areas, setAreas, updateArea, addArea, deleteArea }}
    >
      {children}
    </AreasContext.Provider>
  );
}
