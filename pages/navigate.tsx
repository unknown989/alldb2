import { People } from "@prisma/client";
import Link from "next/link";
import React from "react";
import Card from "../components/Card";
import Navigation from "../components/Navigation";
import styles from "../styles/Navigate.module.css";

type navigateProps = {
  people: People[];
};

export async function getServerSideProps() {
  const data = await (await fetch("/api/getall")).json();

  return {
    props: { people: data.people },
  };
}

function navigate(props: navigateProps) {
  return (
    <div>
      <Navigation />
      <div className={styles.cards}>
        {props.people.map((p) => {
          return (
            <Link href={"/person/" + p.id} key={p.id}>
              <Card
                firstname={p.firstname}
                lastname={p.lastname}
                username={p.username}
                id={p.id}
                image={p.profileimage}
                keywords={p.keywords}
                sex={p.sex}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default navigate;
