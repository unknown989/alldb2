import { useEffect, useRef, useState } from "react";
import styles from "../styles/MultiSelect.module.css";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons";

export type MultiSelectElementProp = {
  id: Number;
  value: any;
  label: string;
};

export type MultiSelectProps = {
  elements: MultiSelectElementProp[];
  onChange: Function;
};

function MultiSelect(props: MultiSelectProps) {
  const [selected, setSelected] = useState<Number[]>([]);
  const [toggle, setToggle] = useState(false);
  const compRef = useRef(null);

  useEffect(() => {
    let tmp: MultiSelectElementProp[] = [];
    selected.forEach((v) => {
      const t = props.elements.find((r) => r.id == v);
      if (!t) {
        return;
      }
      tmp.push({
        id: t.id,
        label: t.label,
        value: t.value,
      });
    });
    props.onChange(tmp);
  }, [selected]);
  const handleClick = (ev: Event) => {
    if (compRef.current && !compRef.current.contains(ev.target)) {
      setToggle(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [compRef]);
  return (
    <div className={styles.multiselect} ref={compRef}>
      <div
        className={styles.multiselect_selected}
        onClick={() => setToggle(!toggle)}
      >
        <p>{selected.length} Selected</p>
        <div className={styles.fba}>
          <IconX
            onClick={() => {
              setSelected([]);
            }}
            cursor={"pointer"}
          />
          {toggle ? (
            <IconChevronUp cursor={"pointer"} />
          ) : (
            <IconChevronDown cursor={"pointer"} />
          )}
        </div>
      </div>
      {toggle && (
        <div className={styles.multiselect_options}>
          {props.elements.map((e) => {
            return (
              <ul
                key={e.id.toString()}
                className={
                  selected.includes(e.id)
                    ? styles.ul_selected
                    : styles.ul_unselected
                }
                onClick={(ev) => {
                  if (!selected.includes(e.id)) {
                    setSelected(
                      Array.from(new Set<Number>([...selected, e.id]))
                    );
                  } else {
                    setSelected([...selected.filter((v) => v != e.id)]);
                  }
                }}
              >
                {e.label}
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
