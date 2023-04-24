import { IconTrash } from "@tabler/icons";
import FieldViewer from "./FieldViewer";
import styles from "../styles/DetailField.module.css";

export default function DetailField({
  name,
  value,
  onDelete,
  id,
}: {
  name: string;
  value: string;
  onDelete: Function;
  id: any;
}) {
  return (
    <div className={styles.detail_field}>
      <FieldViewer readOnly label="Name" value={name} />
      <FieldViewer readOnly label="Value" value={value} />
      <div onClick={() => onDelete(id)} className={styles.delete_button}>
        <IconTrash size={16} />
      </div>
    </div>
  );
}
