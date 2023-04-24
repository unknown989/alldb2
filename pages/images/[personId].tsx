import { Image } from "@prisma/client";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import styles from "../../styles/ImageImages.module.css";

export async function getServerSideProps(context: any) {
  const { personId } = context.query;
  const data = await (
    await fetch("/api/images/" + personId)
  ).json();

  const name = await (
    await fetch("/api/get/" + personId)
  ).json();
  console.log(name);
  

  return {
    props: {
      images: data.images,
      name: name.person.firstname + " " + name.person.lastname,
    },
  };
}

type ImagesProps = {
  images: Image[];
  name: string;
};

function Images({ images, name }: ImagesProps) {
  return (
    <div>
      <Navigation />
      <h1 className={styles.name}>{name}'s Images</h1>
      <div className={styles.images_container}>
        {[...images].map((img) => {
          return (
            <Link href={"/image/" + img.id}>
              <div className={styles.image_container}>
                <img src={img.data} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Images;
