import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SingleFileSelector.module.css";
import { IconX } from "@tabler/icons";

type SingleFileSelectorProps = {
  placeholder: String;
  onChange: Function;
  is_image?: boolean;
  initial_value?: string;
};

function SingleFileSelector({
  placeholder,
  onChange,
  is_image = true,
  initial_value = "",
}: SingleFileSelectorProps) {
  const [file, setFile] = useState(initial_value);
  const uploaderRef = useRef(null);

  useEffect(() => {
    if (file) {
      onChange(file);
    }
  }, [file]);

  return (
    <div className={styles.singlefileselect}>
      <input
        ref={uploaderRef}
        type="file"
        hidden
        accept={is_image ? "image/*" : "*"}
        onInput={(e) => {
          if (e.currentTarget.files && e.currentTarget.files[0]) {
            var reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setFile(event.target.result.toString());
              }
            };
            reader.onerror = (err) => {
              console.error(err);
              alert("Error occurred, check console");
            };
            reader.readAsDataURL(e.currentTarget.files[0]);
          }
        }}
      />
      <div className={styles.singlefileselector_details}>
        <div className={styles.singlefileselector_details_elements}>
          <button
            type="button"
            className="button"
            onClick={() => {
              uploaderRef.current.click();
            }}
          >
            Select
          </button>
          <p>{file ? "1 Selected" : placeholder}</p>
          {file && is_image && <img className={styles.image} src={file} />}
        </div>
        <div className={styles.singlefileselector_details_icons}>
          <IconX
            onClick={() => {
              setFile("");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SingleFileSelector;
