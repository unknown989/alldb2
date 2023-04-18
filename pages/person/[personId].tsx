import React from "react";
import { People } from "@prisma/client";
import Navigation from "../../components/Navigation";
import styles from "../../styles/PersonPerson.module.css";
import { IconPencil, IconTrash } from "@tabler/icons";
import Link from "next/link";
import FieldViewer from "../../components/FieldViewer";

type PersonProps = {
  person: People;
};

export async function getServerSideProps(context: any) {
  const { personId } = context.query;
  const data = await (
    await fetch(process.env["URL"] + "/api/get/" + personId)
  ).json();

  return {
    props: {
      person: data.person,
    },
  };
}

function Person({ person }: PersonProps) {
  
  let details;
  if (person.details instanceof String || typeof person.details === "string") {
    details = JSON.parse(person.details.toString() || "");
  } else {
    details = person.details;
  }


  return (
    <div>
      <Navigation />
      <div className={styles.person_container}>
        <div className={styles.person_fab}>
          <div
            className={styles.person_fabutton}
            style={{ backgroundColor: "#ff2d55" }}
            onClick={() => {
              alert("this should delete this record, buut it doesn't :<");
            }}
          >
            <IconTrash />
          </div>
          <Link href={"/edit/" + person.id}>
            <div className={styles.person_fabutton}>
              <IconPencil />
            </div>
          </Link>
        </div>
        <p className={styles.person_id}>{person.id}</p>
        <div className={styles.person_profileimage}>
          <img src={person.profileimage} />
        </div>
        <div className={styles.person_fields}>
          <p className={styles.separator}>Prior Info</p>
          <FieldViewer value={person.username} label="Username" />
          <FieldViewer value={person.firstname} label="Firstname" />
          <FieldViewer value={person.lastname} label="Lastname" />
          <FieldViewer value={person.sex} label="Sex" />
          <FieldViewer value={person.keywords} label="Keywords" />
          {details.length > 0 && (
            <>
              <br />
              <p className={styles.separator}>Details</p>
              {[...details].map((detail) => {
                return (
                  <FieldViewer
                    value={detail.value}
                    label={detail.key}
                    key={detail.id}
                  />
                );
              })}
            </>
          )}
        </div>
        <br />
        {(person.images || []).length > 0 && (
          <div className={styles.person_images}>
            <p className={styles.separator}>Images</p>
            <div className={styles.person_images_container}>
              {[...(person.images || [])].map((img) => {
                return (
                  <div className={styles.person_image}>
                    <Link href={"/image/" + img.id}>
                      <img src={img.data} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Person;
