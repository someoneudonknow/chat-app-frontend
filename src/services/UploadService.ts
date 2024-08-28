import { ACCESS_TOKEN, CLIENT_ID, REFRESH_TOKEN } from "../constants";
import { BASE_URL, UPLOAD_MANY, UPLOAD_ONE } from "../constants/api-endpoints";
import { HttpMethod } from "../constants/types";
import BaseService from "./BaseService";
import Cookie from "js-cookie";

class UploadService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
    this.initMiddlewaresInner();
  }

  private initMiddlewaresInner() {
    this.fetchHelper.useInReq(async (req: RequestInit) => {
      return {
        ...req,
        headers: {
          ...req.headers,
          "Content-Type": undefined,
        },
      } as RequestInit;
    });
  }

  public async uploadOneWithFileData(fileToUpload: Blob | File) {
    const formData = new FormData();

    formData.append("attachment", fileToUpload);

    return await this.uploadOne({ formData });
  }

  public async uploadOne({ formData }: { formData: FormData }) {
    const currentUserId = Cookie.get(CLIENT_ID);
    const accessToken = Cookie.get(ACCESS_TOKEN);
    const refreshToken = Cookie.get(REFRESH_TOKEN);

    if (!currentUserId || !accessToken) throw new Error("Can't upload");

    const headers = new Headers();

    headers.append("x-client-id", currentUserId);

    if (accessToken) {
      headers.append("authorization", accessToken);
    }
    if (refreshToken) {
      headers.append("refreshtoken", refreshToken);
    }

    try {
      const response = await fetch(`${BASE_URL}/${UPLOAD_ONE}`, {
        method: HttpMethod.POST,
        headers,
        body: formData,
      });

      const data = await response.json();

      if (data?.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async uploadMany({ formData }: { formData: FormData }) {
    const currentUserId = Cookie.get(CLIENT_ID);
    const accessToken = Cookie.get(ACCESS_TOKEN);
    const refreshToken = Cookie.get(REFRESH_TOKEN);

    const headers = new Headers();

    headers.append("x-client-id", currentUserId || "");
    if (accessToken) {
      headers.append("authorization", accessToken);
    }
    if (refreshToken) {
      headers.append("refreshtoken", refreshToken);
    }

    try {
      const response = await fetch(`${BASE_URL}/${UPLOAD_MANY}`, {
        method: HttpMethod.POST,
        headers,
        body: formData,
      });

      const data = await response.json();

      if (data?.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default UploadService;
