import { ReactElement } from "react";
import styles from "../styles/Modal.module.css";

export type ModalActionButtonProps = {
  text: string;
  color: string;
  onClick: Function;
};

export type ModalProps = {
  text: string;
  icon: ReactElement;
  buttons: ModalActionButtonProps[];
  description?: string;
};

export default function Modal({
  text,
  description = "",
  icon,
  buttons,
}: ModalProps) {
  return (
    <>
      <div className={styles.modal_cover}></div>
      <div className={styles.modal}>
        <div className={styles.modal_icon}>{icon}</div>
        <h3 className={styles.modal_text}>{text}</h3>
        {description && (
          <p className={styles.modal_description}>{description}</p>
        )}
        <div className={styles.modal_buttons}>
          {[...buttons].map((btn) => {
            return (
              <button
                className="button"
                style={
                  btn.color === "default" ? {} : { backgroundColor: btn.color }
                }
                onClick={() => btn.onClick()}
              >
                {btn.text}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
