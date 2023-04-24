import React, { ReactElement, useState } from "react";

import styles from "../styles/MultiStep.module.css";

type MultiStepElement = {
  title: string;
  icon: ReactElement;
  component: ReactElement;
};

type MultiStepProps = {
  elements: MultiStepElement[];
  onSubmit: Function;
};

function MultiStep({ elements, onSubmit }: MultiStepProps) {
  const [currStep, setCurrStep] = useState(0);
  return (
    <div>
      <div className={styles.multistep_defs}>
        {elements.map((e, index) => {
          return (
            <>
              {index != 0 && <div className={styles.multistep_line}></div>}
              <div
                data-attr={e.title}
                className={
                  currStep >= index
                    ? styles.multistep_def_curr
                    : styles.multistep_def
                }
                onClick={() => {
                  if (index != currStep) {
                    setCurrStep(index);
                  }
                }}
              >
                <div className={styles.multistep_icon}>{e.icon}</div>
              </div>
            </>
          );
        })}
      </div>
      <form className={styles.multistep_form}>
        {elements[currStep].component}
      </form>
      <div className={styles.buttons}>
        <button
          className="button"
          disabled={currStep === 0}
          onClick={() => {
            setCurrStep(Math.max(0, currStep - 1));
          }}
        >
          Back
        </button>
        <button
          className="button"
          onClick={() => {
            if (currStep === elements.length - 1) {
              onSubmit();
            } else {
              setCurrStep(Math.min(elements.length - 1, currStep + 1));
            }
          }}
        >
          {currStep === elements.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default MultiStep;
