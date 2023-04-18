import { useEffect, useMemo, useState } from "react";
import Modal, { ModalProps } from "../components/Modal";

export function useModal(props: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const component = useMemo(() => {
    if (showModal)
      return (
        <Modal
          text={props.text}
          icon={props.icon}
          description={props.description}
          buttons={props.buttons}
        />
      );
    else return <></>;
  }, [showModal]);

  return [
    (): JSX.Element => component,
    (v: boolean) => {
      setShowModal(v);
    },
  ];
}
