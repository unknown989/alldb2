import { ReactElement } from "react";
import styles from "../styles/FieldViewer.module.css";

type FieldViewerProps = {
  label: string;
  value: any;
  element?: ReactElement;
  onChange?: Function;
  readOnly?: boolean;
};
export default function FieldViewer({
  label,
  value,
  element,
  onChange = () => {},
  readOnly = true,
}: FieldViewerProps) {
  if (element !== undefined) {
    return (
      <div className="input">
        <label>{label}</label>
        <div className={styles.field_viewer_element}>
          {(function (): ReactElement {
            return element;
          })()}
        </div>
      </div>
    );
  } else {
    return (
      <div className="input">
        <label>{label}</label>
        <input
          type={"text"}
          readOnly={readOnly}
          value={value}
          onChange={(e) => {
            if (!readOnly) onChange(e.target.value);
          }}
        />
      </div>
    );
  }
}
