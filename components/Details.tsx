import { useState } from "react";
import FieldViewer from "./FieldViewer";
import styles from "../styles/Details.module.css";
import DetailField from "./DetailField";

export type DetailsType = {
  id: any;
  key: string;
  value: string;
};

export type DetailsProps = {
  onChange: Function;
  value: DetailsType[];
};
export default function DetailsComponent(props: DetailsProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <div>
      <div className={styles.detail_add}>
        <FieldViewer
          label="Property Name"
          value={key}
          onChange={(data: string) => {
            setKey(data);
          }}
        />
        <FieldViewer
          label="Property Value"
          value={value}
          onChange={(data: string) => {
            setValue(data);
          }}
        />
        <button
          className="button"
          type="button"
          onClick={() => {
            props.onChange([
              ...props.value,
              { id: props.value.length, key: key, value: value },
            ]);
            setKey("");
            setValue("");
          }}
        >
          Add
        </button>
      </div>
      <hr style={{ opacity: 0.2 }} />
      {[...props.value].length > 0 ? (
        <>
          {props.value.map((d) => {
            return (
              <DetailField
                onDelete={(id: any) => {
                  props.onChange(props.value.filter((d) => d.id !== id));
                }}
                id={d.id}
                name={d.key}
                value={d.value}
              />
            );
          })}
        </>
      ) : (
        <p style={{ textAlign: "center" }}>Nothing added!</p>
      )}
    </div>
  );
}
