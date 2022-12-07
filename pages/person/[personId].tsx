import React from "react";
import { People } from "@prisma/client";
import Navigation from "../../components/Navigation";
import styles from "../../styles/PersonPerson.module.css";
import { IconPencil, IconTrash } from "@tabler/icons";
import Link from "next/link";

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

type FieldViewerProps = {
  label: string;
  value: any;
};
function FieldViewer({ label, value }: FieldViewerProps) {
  return (
    <div className="input">
      <label>{label}</label>
      <input type={"text"} readOnly value={value} />
    </div>
  );
}

function Person({ person }: PersonProps) {
  console.log(person.details);
  const details = JSON.parse(person.details?.toString() || "");
  /*TODO:
       - Implement '/image/[id]' route
       - Implement '/images/' route
  */
  return (
    <div>
      <Navigation />
      <div className={styles.person_container}>
        <div className={styles.person_fab}>
          <div
            className={styles.person_fabutton}
            style={{ backgroundColor: "#ff2d55" }}
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
