import { Image } from "@prisma/client";
import Link from "next/link";
import FieldViewer from "../../components/FieldViewer";
import Navigation from "../../components/Navigation";

export async function getServerSideProps(context: any) {
  const { imageId } = context.query;
  const data = await (
    await fetch(process.env["URL"] + "/api/image/" + imageId)
  ).json();

  return {
    props: {
      image: data.image,
    },
  };
}

type ImageProps = {
  image: Image;
};

function Image({ image }: ImageProps) {
  const details = JSON.parse(image.details?.toString() || "[]");
  console.log(image.details);

  return (
    <div>
      <Navigation />
      <div style={{ textAlign: "center", userSelect: "none" }}>
        <span style={{ opacity: "0.5" }}>
          Created At: {image.createdAt.toString()}
        </span>
        <br />
        <span style={{ opacity: "0.5", userSelect: "none" }}>
          Updated At: {image.updatedAt.toString()}
        </span>
        <br />
        <span style={{ opacity: "0.5", userSelect: "text" }}>
          Image ID: {image.id}
        </span>
        <br />
        <span style={{ opacity: "0.8", userSelect: "text" }}>
          Owner ID:{" "}
          <Link href={"/person/" + image.ownerid}>{image.ownerid}</Link>
        </span>
        <br />
        <br />
        <img src={image.data} />
        <br />
        {[...details].map((detail) => {
          return (
            <FieldViewer
              key={detail.id}
              value={detail.value}
              label={detail.key}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Image;
