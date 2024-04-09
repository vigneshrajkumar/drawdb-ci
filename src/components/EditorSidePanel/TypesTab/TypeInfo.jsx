import { useState } from "react";
import { Action, ObjectType } from "../../../data/constants";
import {
  Collapse,
  Row,
  Col,
  Input,
  TextArea,
  Button,
  Card,
  Toast,
} from "@douyinfe/semi-ui";
import { IconDeleteStroked, IconPlus } from "@douyinfe/semi-icons";
import { useUndoRedo, useTypes } from "../../../hooks";
import TypeField from "./TypeField";

export default function TypeInfo({ index, data }) {
  const { deleteType, updateType } = useTypes();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState({});

  return (
    <div id={`scroll_type_${index}`}>
      <Collapse.Panel
        header={
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {data.name}
          </div>
        }
        itemKey={`${index}`}
      >
        <div className="flex items-center mb-2.5">
          <div className="text-md font-semibold">Name: </div>
          <Input
            value={data.name}
            validateStatus={data.name === "" ? "error" : "default"}
            placeholder="Name"
            className="ms-2"
            onChange={(value) => updateType(index, { name: value })}
            onFocus={(e) => setEditField({ name: e.target.value })}
            onBlur={(e) => {
              if (e.target.value === editField.name) return;
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TYPE,
                  component: "self",
                  tid: index,
                  undo: editField,
                  redo: { name: e.target.value },
                  message: `Edit type name to ${e.target.value}`,
                },
              ]);
              setRedoStack([]);
            }}
          />
        </div>
        {data.fields.map((f, j) => (
          <TypeField key={j} data={f} fid={j} tid={index} />
        ))}
        <Card
          bodyStyle={{ padding: "4px" }}
          style={{ marginTop: "12px", marginBottom: "12px" }}
          headerLine={false}
        >
          <Collapse>
            <Collapse.Panel header="Comment" itemKey="1">
              <TextArea
                field="comment"
                value={data.comment}
                autosize
                placeholder="Add comment"
                rows={1}
                onChange={(value) =>
                  updateType(index, { comment: value }, false)
                }
                onFocus={(e) => setEditField({ comment: e.target.value })}
                onBlur={(e) => {
                  if (e.target.value === editField.comment) return;
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.TYPE,
                      component: "self",
                      tid: index,
                      undo: editField,
                      redo: { comment: e.target.value },
                      message: `Edit type comment to ${e.target.value}`,
                    },
                  ]);
                  setRedoStack([]);
                }}
              />
            </Collapse.Panel>
          </Collapse>
        </Card>
        <Row gutter={6} className="mt-2">
          <Col span={12}>
            <Button
              icon={<IconPlus />}
              onClick={() => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TYPE,
                    component: "field_add",
                    tid: index,
                    message: `Add field to type`,
                  },
                ]);
                setRedoStack([]);
                updateType(index, {
                  fields: [
                    ...data.fields,
                    {
                      name: "",
                      type: "",
                    },
                  ],
                });
              }}
              block
            >
              Add field
            </Button>
          </Col>
          <Col span={12}>
            <Button
              icon={<IconDeleteStroked />}
              type="danger"
              onClick={() => {
                Toast.success(`Type deleted!`);
                deleteType(index);
              }}
              block
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Collapse.Panel>
    </div>
  );
}
