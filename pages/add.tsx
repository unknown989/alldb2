import {
  IconUser,
  IconSelector,
  IconPhotoUp,
  IconId,
  IconCheck,
  IconX,
} from "@tabler/icons";
import { useState } from "react";
import MultiSelect from "../components/MultiSelect";
import MultiStep from "../components/MultiStep";
import Navigation from "../components/Navigation";
import styles from "../styles/Add.module.css";
import SingleSelect, {
  SingleSelectElementProp,
} from "../components/SingleSelect";
import SingleFileSelector from "../components/SingleFileSelector";
import MultiFileSelector from "../components/MultiFileSelector";
import DetailsComponent, { DetailsType } from "../components/Details";
import { useLoading } from "../hooks/useLoading";
import { useModal } from "../hooks/useModal";

type StepStateProp = {
  value: any;
  setter: Function;
};

type StepProps = {
  states: StepStateProp[];
};

function step_one({ states }: StepProps) {
  return (
    <div className={styles.form_div}>
      <div className={styles.input}>
        <label htmlFor="i1">Username</label>
        <input
          value={states[0].value}
          onChange={(e) => states[0].setter(e.target.value)}
          id="i1"
          type={"text"}
          placeholder="Call me something :)"
        ></input>
      </div>
      <div className={styles.input}>
        <label htmlFor="i2">Firstname</label>
        <input
          value={states[1].value}
          onChange={(e) => states[1].setter(e.target.value)}
          id="i2"
          type={"text"}
          placeholder="What do friends call me ?"
        ></input>
      </div>
      <div className={styles.input}>
        <label htmlFor="i3">Lastname</label>
        <input
          value={states[2].value}
          onChange={(e) => states[2].setter(e.target.value)}
          id="i3"
          type={"text"}
          placeholder="What do teachers call me?"
        ></input>
      </div>
    </div>
  );
}
function step_two({ states }: StepProps) {
  return (
    <div>
      <label>Select a keyword...</label>
      <MultiSelect
        elements={[
          { id: 0, label: "Strong", value: "strong" },
          { id: 1, label: "Weak", value: "weak" },
        ]}
        onChange={(v: string[]) => states[0].setter(v)}
      />
      <label>Select a sex...</label>
      <SingleSelect
        elements={[
          { id: 0, label: "Female", value: "female" },
          { id: 1, label: "Male", value: "male" },
        ]}
        placeholder={"What am I?"}
        initial_index={(function (): number {
          let rv = -1;
          switch (states[1].value?.value || "") {
            case "female":
              rv = 0;
              break;
            case "male":
              rv = 1;
              break;
            default:
              break;
          }
          return rv;
        })()}
        onChange={(v: SingleSelectElementProp) => {
          states[1].setter(v);
        }}
      />
    </div>
  );
}

function step_three({ states }: StepProps) {
  return (
    <div>
      <label htmlFor="s1">Profile Image...</label>
      <SingleFileSelector
        placeholder={"Give me a picture :)"}
        onChange={(image: string) => {
          states[0].setter(image);
        }}
        initial_value={states[0].value}
      />
      {/*
        TODO:
          - Connect to Backend
      */}
      <label htmlFor="s2">Images</label>
      <MultiFileSelector
        onChange={(images: string[]) => {
          states[1].setter(images);
        }}
        placeholder={"Select images..."}
        initial_value={states[1].value}
      />
    </div>
  );
}

function step_four(props: StepProps) {
  return (
    <div className={styles.step_four}>
      <DetailsComponent
        onChange={props.states[0].setter}
        value={props.states[0].value}
      />
    </div>
  );
}

export default function add() {
  const [user, setUser] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const [keywords, setKeywords] = useState<string[]>([]);
  const [sex, setSex] = useState<SingleSelectElementProp>();

  const [profileImage, setProfileImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<DetailsType[]>([]);

  const [LoadingComponent, setIsLoading] = useLoading();
  const [ModalSuccessComponent, setShowModalSuccess] = useModal({
    text: "Added Successfully",
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

  const addPersonHandler = async () => {
    setIsLoading(true);
    const url = "/api/add/person";
    const body = {
      username: user,
      firstname: first,
      lastname: last,
      keywords: keywords,
      sex: sex?.value,
      profileimage: profileImage,
      images,
      details,
    };
    console.log(body);

    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options).catch((err) => {
      setShowModalError(true);
      console.error(err);
    });
    setIsLoading(false);
    setShowModalSuccess(true);
  };

  return (
    <div>
      <Navigation />
      {<LoadingComponent />}
      {<ModalErrorComponent />}
      {<ModalSuccessComponent />}
      <MultiStep
        onSubmit={addPersonHandler}
        elements={[
          {
            component: step_one({
              states: [
                { setter: setUser, value: user },
                { setter: setFirst, value: first },
                { setter: setLast, value: last },
              ],
            }),
            icon: <IconUser size={32} />,
            title: "Identity",
          },
          {
            component: step_two({
              states: [
                { setter: setKeywords, value: keywords },
                { setter: setSex, value: sex },
              ],
            }),
            icon: <IconSelector size={32} />,
            title: "Selection",
          },
          {
            component: step_three({
              states: [
                { setter: setProfileImage, value: profileImage },
                { setter: setImages, value: images },
              ],
            }),
            icon: <IconPhotoUp size={32} />,
            title: "Images",
          },
          {
            component: step_four({
              states: [{ setter: setDetails, value: details }],
            }),
            icon: <IconId size={32} />,
            title: "Details",
          },
        ]}
      />
    </div>
  );
}
