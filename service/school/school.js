import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function UpdateSchoolImageCover({ formData }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateStudent = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/school/update/image-cover`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return updateStudent;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
