import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/MultiFileSelector.module.css";
import { IconX } from "@tabler/icons";

type MultiFileSelectorProps = {
  placeholder: String;
  onChange: Function;
  is_image?: boolean;
  initial_value?: string[];
};

function MultiFileSelector({
  placeholder,
  onChange,
  is_image = true,
  initial_value = [],
}: MultiFileSelectorProps) {
  const [files, setFiles] = useState<string[]>(initial_value);
  const uploaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (files) {
      onChange(files);
    }
  }, [files]);

  return (
    <div className={styles.multifileselect}>
      <input
        ref={uploaderRef}
        type="file"
        hidden
        multiple
        accept={is_image ? "image/*" : "*"}
        onInput={(e) => {
          let files_tmp: string[] = [];
          let loaded = 0;
          let files_length = 0;
          if (e.currentTarget.files) {
            files_length = e.currentTarget.files.length;
            setIsLoading(true);
            for (var i = 0; i < e.currentTarget.files?.length; i++) {
              var reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  files_tmp.push(event.target.result.toString());
                  loaded++;
                }
              };

              reader.onloadend = () => {
                if (loaded === files_length && files_length != 0) {
                  setFiles(files_tmp);
                  setIsLoading(false);
                }
              };

              reader.onerror = (err) => {
                console.error(err);
                alert("Error occurred, check console");
              };
              reader.readAsDataURL(e.currentTarget.files[i]);
            }
          }
        }}
      />
      <div className={styles.multifileselector_details}>
        <div className={styles.multifileselector_details_elements}>
          <button
            type="button"
            className="button"
            onClick={() => {
              uploaderRef.current.click();
            }}
          >
            Select
          </button>
          <p>
            {!isLoading
              ? files.length + " Selected" || placeholder
              : "Loading..."}
          </p>
          {files && is_image && (
            <div className={styles.images}>
              {files.map((i) => {
                return <img src={i} className={styles.image} />;
              })}
            </div>
          )}
        </div>
        <div className={styles.multifileselector_details_icons}>
          <IconX
            onClick={() => {
              setFiles([]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MultiFileSelector;
