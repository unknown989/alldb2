import React, { useState } from "react";
import styles from "../styles/Add.module.css";

type inputWithLabelProps = {
  label: string;
  inputType: string;
  inputPlaceholder: string;
  value: string;
  onChange: Function;
};

function InputWithLabel(props: inputWithLabelProps) {
  return (
    <div className={styles.input}>
      <label>{props.label}</label>
      <input
        type={props.inputType}
        placeholder={props.inputPlaceholder}
        value={props.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(e);
        }}
      />
    </div>
  );
}

export default function add() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [sex, setSex] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);

  const reset = () => {
    setUsername("");
    setFirstname("");
    setLastname("");
    setKeywords([]);
    setSex("");
    setProfileImage("");
    setImages([]);
    setDetails([]);
  };
  return (
    <div>
      <button className={styles.button} onClick={reset}>
        Reset
      </button>
      <InputWithLabel
        value={username}
        inputPlaceholder={"Call me something pwease..."}
        inputType={"text"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(e.target.value);
        }}
        label={"Username"}
      />
      <InputWithLabel
        value={firstname}
        inputPlaceholder={"What is my firstname?"}
        inputType={"text"}
        label={"Firstname:"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFirstname(e.target.value);
        }}
      />
      <InputWithLabel
        value={lastname}
        inputPlaceholder={"how about my lastname?"}
        inputType={"text"}
        label={"Lastname:"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLastname(e.target.value);
        }}
      />
    </div>
  );
}
