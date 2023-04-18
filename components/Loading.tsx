import { IconLoader2 } from "@tabler/icons";
import styles from "../styles/Loading.module.css";

export default function Loading() {
  return (
    <>
      <div className={styles.loading_cover}></div>
      <div className={styles.loading}>
        <div className={styles.loading_icon}>
          <IconLoader2 strokeWidth={1} className={styles.loading_icon_loader} />
        </div>
        <h3 className={styles.loading_text}>Loading...</h3>
      </div>
    </>
  );
}
