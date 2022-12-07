import { IconUser, IconSelector, IconPhotoUp, IconId } from "@tabler/icons";
import { useState } from "react";
import MultiSelect from "../components/MultiSelect";
import type { MultiSelectElementProp } from "../components/MultiSelect";
import MultiStep from "../components/MultiStep";
import Navigation from "../components/Navigation";
import styles from "../styles/Add.module.css";
import SingleSelect, {
  SingleSelectElementProp,
} from "../components/SingleSelect";
import SingleFileSelector from "../components/SingleFileSelector";
import MultiFileSelector from "../components/MultiFileSelector";

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
          placeholder="Username..."
        ></input>
      </div>
      <div className={styles.input}>
        <label htmlFor="i2">Firstname</label>
        <input
          value={states[1].value}
          onChange={(e) => states[1].setter(e.target.value)}
          id="i2"
          type={"text"}
          placeholder="Username..."
        ></input>
      </div>
      <div className={styles.input}>
        <label htmlFor="i3">Lastname</label>
        <input
          value={states[2].value}
          onChange={(e) => states[2].setter(e.target.value)}
          id="i3"
          type={"text"}
          placeholder="Lastname..."
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
        onChange={(v: MultiSelectElementProp[]) => states[0].setter(v)}
      />
      <label>Select a sex...</label>
      <SingleSelect
        elements={[
          { id: 0, label: "Female", value: "female" },
          { id: 1, label: "Male", value: "male" },
        ]}
        placeholder={"Select a sex..."}
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
        placeholder={"Select a profile image..."}
        onChange={(image: string) => {
          states[0].setter(image);
        }}
        initial_value={states[0].value}
      />
      {/*
        TODO:
          - Add Details form
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
function step_four() {
  return (
    <div>
      <p>Details</p>
    </div>
  );
}

export default function add() {
  const [user, setUser] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const [keywords, setKeywords] = useState([]);
  const [sex, setSex] = useState<SingleSelectElementProp>();

  const [profileImage, setProfileImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  return (
    <div>
      <Navigation />
      <MultiStep
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
            component: step_four(),
            icon: <IconId size={32} />,
            title: "Details",
          },
        ]}
      />
    </div>
  );
}
