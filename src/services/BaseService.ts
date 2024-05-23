import { ACCESS_TOKEN, CLIENT_ID, REFRESH_TOKEN } from "../constants";
import { Fetch } from "../helpers";
import { RequestOptions } from "../helpers/Fetch/Fetch";
import Cookie from "js-cookie";

class BaseService {
  private baseUrl: string;
  private readonly REQUEST_TIMEOUT: number = 10000;
  protected fetchHelper: Fetch;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.fetchHelper = new Fetch(this.baseUrl, {
      requestTimeout: this.REQUEST_TIMEOUT,
    });
    this.initMiddlewares();
  }

  private initMiddlewares() {
    this.fetchHelper.useInReq(async (req: RequestInit) => {
      return {
        ...req,
        headers: {
          ...req.headers,
          "Content-Type": "application/json",
          "x-client-id": Cookie.get(CLIENT_ID),
          authorization: Cookie.get(ACCESS_TOKEN),
          refreshtoken: Cookie.get(REFRESH_TOKEN),
        },
      } as RequestInit;
    });

    this.fetchHelper.useInRes((res) => {
      if (res?.status === "error") {
        throw new Error(res.message);
      }

      return res;
    });
    // check token and refresh if necessary
  }

  protected async get(
    subUrl: string,
    reqInit: RequestInit = {},
    options?: RequestOptions
  ) {
    return await this.fetchHelper.get(subUrl, reqInit, options);
  }

  protected async post(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchHelper.post(subUrl, reqInit, body, options);
  }

  protected async put(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchHelper.put(subUrl, reqInit, body, options);
  }

  protected async delete(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchHelper.delete(subUrl, reqInit, body, options);
  }

  protected async patch(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchHelper.patch(subUrl, reqInit, body, options);
  }
}

export default BaseService;
