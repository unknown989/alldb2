import { useRef, useState } from "react";
import { People, Image as ImageType } from "@prisma/client";
import Navigation from "../../components/Navigation";
import styles from "../../styles/EditPerson.module.css";
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceFloppy,
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons";
import Link from "next/link";
import SingleSelect, {
  SingleSelectElementProp,
} from "../../components/SingleSelect";
import FieldViewer from "../../components/FieldViewer";
import { useLoading } from "../../hooks/useLoading";
import { useModal } from "../../hooks/useModal";

import Image from "next/image";

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
  let _details;
  if (person.details instanceof String || typeof person.details === "string") {
    _details = JSON.parse(person.details.toString() || "");
  } else {
    _details = person.details;
  }
  const [user, setUser] = useState(person.username);
  const [first, setFirst] = useState(person.firstname);
  const [last, setLast] = useState(person.lastname);

  const [keywords, setKeywords] = useState(person.keywords);
  const [sex, setSex] = useState<SingleSelectElementProp>();

  const [profileImage, setProfileImage] = useState(person.profileimage);

  const [images, setImages] = useState<ImageType[] | null>(person.images);
  const [details, setDetails] = useState(_details);
  const [imagesToUpload, setImagesToUpload] = useState<string[]>([]);

  const uploaderRef = useRef<HTMLInputElement>(null);
  const imagesUploaderRef = useRef<HTMLInputElement>(null);

  const [LoadingComponent, setIsLoading] = useLoading();
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
  const [ModalSuccessComponent, setShowModalSuccess] = useModal({
    text: "Updated Successfully",
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

  const saveButtonHandler = async () => {
    setIsLoading(true);
    let thresh = 0;
    let maxthresh = 1;

    const url = "/api/update/person/" + person.id;
    const body = {
      username: user,
      firstname: first,
      lastname: last,
      keywords: keywords,
      sex: sex?.value,
      profileimage: profileImage,
      details: details,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await (await fetch(url, options)).json().catch((err) => {
      setShowModalError(true);
      console.error(err);
    });

    if (res.status === 200) {
      thresh++;
    } else {
      setShowModalError(true);
      console.log(res.message);
    }

    if (imagesToUpload.length > 0) {
      maxthresh += 1;
      const images_url = "/api/images/";
      type UploadImageProps = {
        images: string[];
        ownerId: string;
      };
      const images_body: UploadImageProps = {
        images: imagesToUpload,
        ownerId: person.id,
      };
      options.body = JSON.stringify(images_body);
      const res = await (await fetch(images_url, options))
        .json()
        .catch((err) => {
          console.error(err);
        });
      if (res.status === 200) {
        thresh++;
      } else {
        console.log(res.message);
      }
    }

    console.log("Max: %d Thresh: %d", maxthresh, thresh);

    if (thresh === maxthresh) {
      setShowModalSuccess(true);
    } else {
      setShowModalError(true);
    }
    setIsLoading(false);
    {
      /* TODO:
          - FIXME: when an image is removed from the state, it is still shown
          - When the imagesToUpload are uploaded, automatically show the uploaded ones without having to reload
          */
    }
  };

  const deleteImageHandler = async (imageId: string) => {
    setIsLoading(true);
    const url = "/api/update/image/" + imageId;
    const body = {
      action: "delete",
    };
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
            setShowModalSuccess(true);
          }, 1000);
        } else {
          console.error(json.message);
          setTimeout(() => {
            setIsLoading(false);
            setShowModalError(true);
          }, 1000);
        }
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
          setIsLoading(false);
          setShowModalError(true);
        }, 1000);
      });
  };

  return (
    <div>
      <Navigation />
      {<LoadingComponent />}
      {<ModalSuccessComponent />}
      {<ModalErrorComponent />}
      <div className={styles.person_container}>
        <div className={styles.person_fab}>
          <div
            className={styles.person_fabutton}
            style={{ backgroundColor: "#ff2d55" }}
            onClick={() => {
              alert("TODO: this should delete this record, buut it doesn't :<");
            }}
          >
            <IconTrash />
          </div>
          <Link href={"/person/" + person.id}>
            <div
              className={styles.person_fabutton}
              style={{ backgroundColor: "#00c7be" }}
            >
              <IconEye />
            </div>
          </Link>
          <div
            className={styles.person_fabutton}
            style={{ backgroundColor: "#48484a" }}
            onClick={() => {
              saveButtonHandler();
            }}
          >
            <IconDeviceFloppy />
          </div>
        </div>
        <p className={styles.person_id}>{person.id}</p>
        <div className={styles.person_profileimage}>
          <img src={profileImage} />
          <div className={styles.person_edit_image}>
            <div className={styles.person_fab}>
              <input
                ref={uploaderRef}
                type="file"
                hidden
                accept={"image/*"}
                onInput={(e) => {
                  if (e.currentTarget.files && e.currentTarget.files[0]) {
                    var reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setProfileImage(event.target.result.toString());
                      }
                    };
                    reader.onerror = (err) => {
                      console.error(err);
                      alert("Error occurred, check console");
                    };
                    reader.readAsDataURL(e.currentTarget.files[0]);
                  }
                }}
              />
              <div
                className={styles.person_fabutton}
                onClick={() => {
                  uploaderRef.current?.click();
                }}
              >
                <IconUpload />
              </div>
              <div
                className={styles.person_fabutton}
                style={{ backgroundColor: "#ffaa30" }}
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = person.profileimage;
                  a.download = person.id + ".jpeg";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <IconDownload />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.person_fields}>
          <p className={styles.separator}>Prior Info</p>
          <FieldViewer
            onChange={(v: string) => {
              setUser(v);
            }}
            value={user}
            readOnly={false}
            label="Username"
          />
          <FieldViewer
            readOnly={false}
            onChange={(v: string) => {
              setFirst(v);
            }}
            value={first}
            label="Firstname"
          />
          <FieldViewer
            readOnly={false}
            onChange={(v: string) => {
              setLast(v);
            }}
            value={last}
            label="Lastname"
          />
          <FieldViewer
            readOnly={false}
            value={sex}
            element={
              <SingleSelect
                placeholder="Select sex..."
                elements={[
                  { id: 0, label: "Female", value: "female" },
                  { id: 1, label: "Male", value: "male" },
                ]}
                initial_index={(function (): number {
                  let rv = -1;
                  switch (person.sex?.toLowerCase()) {
                    case "male":
                      rv = 1;
                      break;
                    case "female":
                      rv = 0;
                      break;
                    default:
                      break;
                  }
                  return rv;
                })()}
                onChange={(e: SingleSelectElementProp) => {
                  setSex(e);
                }}
              />
            }
            label="Sex"
          />
          <FieldViewer
            readOnly={false}
            onChange={(v: string) => {
              setKeywords(v.split(","));
            }}
            value={keywords}
            label="Keywords"
          />
          {details.length > 0 && (
            <>
              <br />
              <p className={styles.separator}>Details</p>
              {[...details].map((detail, index) => {
                return (
                  <div className={styles.details_input}>
                    <input
                      type={"text"}
                      defaultValue={detail.key}
                      onChange={(e) => {
                        const nd = details;
                        nd[index].key = e.currentTarget.value;
                        console.log(details[index]);
                        setDetails(nd);
                      }}
                    />
                    <input
                      type={"text"}
                      defaultValue={detail.value}
                      onChange={(e) => {
                        const nd = details;
                        nd[index].value = e.currentTarget.value;
                        console.log(details[index]);
                        setDetails(nd);
                      }}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
        <br />
        <div className={styles.person_images}>
          <p className={styles.separator}>Images</p>
          <div className={styles.person_fab}>
            <Link href={"/images/" + person.id}>
              <div
                className={styles.person_fabutton}
                style={{ backgroundColor: "#00c7be" }}
              >
                <IconEye />
              </div>
            </Link>
            <input
              ref={imagesUploaderRef}
              type="file"
              hidden
              multiple
              accept={"image/*"}
              onInput={(e) => {
                let files_tmp: string[] = [];
                let loaded = 0;
                let files_length = 0;
                if (e.currentTarget.files) {
                  files_length = e.currentTarget.files.length;
                  for (var i = 0; i < e.currentTarget.files?.length; i++) {
                    var reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        files_tmp.push(event.target.result.toString());
                        loaded++;
                      }
                    };

                    reader.onloadend = () => {
                      if (loaded === files_length && files_length != 0) {
                        setImagesToUpload([...imagesToUpload, ...files_tmp]);
                      }
                    };

                    reader.onerror = (err) => {
                      console.error(err);
                      alert("Error occurred, check console");
                    };
                    reader.readAsDataURL(e.currentTarget.files[i]);
                  }
                }
              }}
            />
            <div
              className={styles.person_fabutton}
              onClick={() => {
                imagesUploaderRef.current?.click();
              }}
            >
              <IconPlus />
            </div>
          </div>
          <br />
          <div className={styles.person_images_container}>
            {(person.images || []).length > 0 &&
              [...(person.images || [])].map((img) => {
                return (
                  <div className={styles.person_image} key={img.id}>
                    <img src={img.data} />
                    <div className={styles.person_image_edit}>
                      <div className={styles.person_fab}>
                        <Link href={"/image/" + img.id}>
                          <div
                            className={styles.person_fabutton}
                            style={{ backgroundColor: "#00c7be" }}
                          >
                            <IconEye />
                          </div>
                        </Link>
                        <div
                          className={styles.person_fabutton}
                          style={{ backgroundColor: "#ff2d55" }}
                          onClick={() => {
                            deleteImageHandler(img.id);
                            if (images) {
                              const nimages = images.filter(
                                (i) => i.id !== img.id
                              );
                              setImages([...nimages]);
                            }
                          }}
                        >
                          <IconTrash />
                        </div>
                        <div
                          className={styles.person_fabutton}
                          style={{ backgroundColor: "#ffaa30" }}
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = img.data;
                            a.download = img.id;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        >
                          <IconDownload />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {[
              ...imagesToUpload.map((img, index) => {
                return (
                  <div className={styles.person_image}>
                    <img src={img} />
                    <div className={styles.image_should_upload}>
                      <IconAlertCircle color="#ffce2d" />
                    </div>
                    <div className={styles.person_image_edit}>
                      <div className={styles.person_fab}>
                        <div
                          className={styles.person_fabutton}
                          style={{ backgroundColor: "#ff2d55" }}
                          onClick={() => {
                            setImagesToUpload([
                              ...imagesToUpload.filter((_, i) => i !== index),
                            ]);
                          }}
                        >
                          <IconTrash />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }),
            ]}
            {images?.length == 0 && imagesToUpload.length == 0 && (
              <div className={styles.person_images}>
                <Image
                  src={"/nodata.png"}
                  alt="Not found"
                  width={200}
                  height={200}
                />
                <p>Empty like the void.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Person;
