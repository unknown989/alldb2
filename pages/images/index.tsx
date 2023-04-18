import { Image } from "@prisma/client";
import React from "react";
import Navigation from "../../components/Navigation";
import styles from "../../styles/IndexImages.module.css";

export async function getServerSideProps() {
  const data = await (await fetch(process.env["URL"] + "/api/images/")).json();
  return {
    props: {
      images: data.images,
    },
  };
}

type ImagesIndexProps = { images: Image[] };

function ImagesIndex({ images }: ImagesIndexProps) {
  return (
    <div>
      <Navigation />
      <div className={styles.images_container}>
        {[...images].map((img) => {
          return (
            <div className={styles.image_container}>
              <img src={img.data} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImagesIndex;
