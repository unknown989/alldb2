import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>AllDB - Where all is stored</h1>
      </header>
      <div className={styles.holder}>
        <h2>Choose an action:</h2>
        <div className={styles.buttons}>
          <Link href={"/add"}>
            <button className={"button"}>Add a person</button>
          </Link>
          <Link href={"/navigate"}>
            <button className={"button"}>Navigate people</button>
          </Link>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>Copyright &copy;{new Date().getFullYear()} - AllDB by unkown989</p>
      </footer>
    </div>
  );
}
