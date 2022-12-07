import React from 'react'
import styles from "../styles/Navigation.module.css";
import Logo from "../assets/alldb.svg";
import Link from 'next/link';
type Props = {}

export default function Navigation({}: Props) {
  return (
    <div className={styles.navigation_container}>
    <Link href="/"><Logo className={styles.navigation_logo} /></Link>
    <div className={styles.navigation_links}>
      <Link className={styles.navigation_link} href={"/add"}>Add</Link>
      <Link className={styles.navigation_link} href={"/navigate"}>Navigate</Link>
    </div>
    </div>
  )
}