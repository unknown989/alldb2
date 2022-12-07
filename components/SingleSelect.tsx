import { useEffect, useRef, useState } from "react";
import styles from "../styles/MultiSelect.module.css";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";

export type SingleSelectElementProp = {
  id: Number;
  value: any;
  label: string;
};

export type SingleSelectProps = {
  placeholder: string;
  elements: SingleSelectElementProp[];
  onChange: Function;
};

function SingleSelect(props: SingleSelectProps) {
  const [selected, setSelected] = useState<Number>();
  const [toggle, setToggle] = useState(false);
  const compRef = useRef(null);

  useEffect(() => {
    props.onChange(props.elements.find((e) => e.id === selected));
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
        <p>
          {props.elements.find((e) => e.id == selected)?.label ||
            props.placeholder}
        </p>
        <div className={styles.fba}>
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
                  selected === e.id ? styles.ul_selected : styles.ul_unselected
                }
                onClick={(ev) => {
                  setSelected(e.id);
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

export default SingleSelect;
