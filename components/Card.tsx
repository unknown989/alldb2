import styles from "../styles/Card.module.css";
import {
  IconGenderFemale,
  IconGenderMale,
  IconGenderAgender,
} from "@tabler/icons";

type CardProps = {
  id: string;
  image: string;
  firstname: string;
  lastname: string;
  username: string | null;
  sex: string | null;
  keywords: string[];
};

function getGenderIcon(gender: string | null) {
  if (!gender || gender === null) {
    return <IconGenderAgender />;
  } else if (gender.toLowerCase() === "male") {
    return <IconGenderMale />;
  }

  return <IconGenderFemale />;
}

function Card(props: CardProps) {
  return (
    <div className={styles.card_container}>
      <div className={styles.card_image}>
        <img src={props.image} />
      </div>
      <div className={styles.card_details}>
        <p className={styles.card_usernameandsex}>
          @{props.username} {getGenderIcon(props.sex)}
        </p>
        <h1 className={styles.card_name}>
          {props.firstname.toUpperCase() + " " + props.lastname.toUpperCase()}
        </h1>
        <p className={styles.card_keywords}>{props.keywords.join(",")}</p>
      </div>
    </div>
  );
}

export default Card;
