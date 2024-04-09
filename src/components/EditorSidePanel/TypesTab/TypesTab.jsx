import { Collapse, Row, Col, Button, Popover } from "@douyinfe/semi-ui";
import { IconPlus, IconInfoCircle } from "@douyinfe/semi-icons";
import Searchbar from "./SearchBar";
import Empty from "../Empty";
import { useTypes } from "../../../hooks";
import TypeInfo from "./TypeInfo";

export default function TypesTab() {
  const { types, addType } = useTypes();

  return (
    <>
      <Row gutter={6}>
        <Col span={13}>
          <Searchbar />
        </Col>
        <Col span={8}>
          <Button icon={<IconPlus />} block onClick={() => addType(true)}>
            Add type
          </Button>
        </Col>
        <Col span={3}>
          <Popover
            content={
              <div className="w-[240px] text-sm space-y-2 popover-theme">
                <div>
                  This feature is meant for object-relational DBMSs like{" "}
                  <strong>PostgreSQL</strong>.
                </div>
                <div>
                  If used for <strong>MySQL</strong> or <strong>MariaDB</strong>{" "}
                  a <code>JSON</code> type will be generated with the
                  corresponding json validation check.
                </div>
                <div>
                  If used for <strong>SQLite</strong> it will be translated to a{" "}
                  <code>BLOB</code>.
                </div>
                <div>
                  If used for <strong>MSSQL</strong> a type alias to the first
                  field will be generated.
                </div>
              </div>
            }
            showArrow
            position="rightTop"
          >
            <Button theme="borderless" icon={<IconInfoCircle />} />
          </Popover>
        </Col>
      </Row>
      {types.length <= 0 ? (
        <Empty title="No types" text="Make your own custom data types" />
      ) : (
        <Collapse accordion>
          {types.map((t, i) => (
            <TypeInfo data={t} key={i} index={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
