import React from "react";
import { People } from "@prisma/client";
import Navigation from "../../components/Navigation";
import styles from "../../styles/PersonPerson.module.css";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons";
import Link from "next/link";
import FieldViewer from "../../components/FieldViewer";
import { useModal } from "../../hooks/useModal";
import { useLoading } from "../../hooks/useLoading";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [LoadingComponent, setIsLoading] = useLoading();
  const [ModalSuccessComponent, setShowModalSuccess] = useModal({
    text: "Deleted Successfully",
    description: "Hooray, that went smoothly",
    icon: (
      <div
        style={{
          backgroundColor: "#34c759",
          width: "6rem",
          height: "6rem",
          borderRadius: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconCheck size={64} color="white" />
      </div>
    ),
    buttons: [
      {
        color: "#34c759",
        onClick: () => {
          setShowModalSuccess(false);
        },
        text: "Ok :)",
      },
    ],
  });
  const [ModalErrorComponent, setShowModalError] = useModal({
    text: "Oops, That ain't good",
    description: "Check the console for the detailed error stack.",
    icon: (
      <div
        style={{
          backgroundColor: "#ff3b30",
          width: "6rem",
          height: "6rem",
          borderRadius: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconX size={64} color="white" />
      </div>
    ),
    buttons: [
      {
        color: "#ff3b30",
        onClick: () => {
          setShowModalError(false);
        },
        text: "Ok :(",
      },
    ],
  });

  const deletePersonHandler = async () => {
    setIsLoading(true);
    const url = "/api/delete/" + person.id;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let error = undefined;
    await fetch(url, options).catch((err) => {
      setShowModalError(true);
      console.error(err);
      error = err;
    });

    if (!error) {
      setIsLoading(false);
      setShowModalSuccess(true);
      router.back();
    }
  };

  return (
    <div>
      <Navigation />
      {<LoadingComponent />}
      {<ModalErrorComponent />}
      {<ModalSuccessComponent />}

      <div className={styles.person_container}>
        <div className={styles.person_fab}>
          <div
            className={styles.person_fabutton}
            style={{ backgroundColor: "#ff2d55" }}
            onClick={deletePersonHandler}
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
