"use strict";

import { HttpMethod } from "../../constants/types";
import RequestCached from "./RequestCached";

type ReqMiddlewareFunc = (
  request: RequestInit
) => RequestInit | Promise<RequestInit>;
type ResMiddlewareFunc = (response: any) => any | Promise<any>;

export type FetchOptions = {
  requestTimeout: number;
};

export type RequestOptions = {
  cached?: {
    timeout?: number | "pernament";
  };
};

class Fetch {
  private baseUrl: string;
  private reqMiddlewares: ReqMiddlewareFunc[] = [];
  private resMiddlewares: ResMiddlewareFunc[] = [];
  private options: Partial<FetchOptions>;

  constructor(baseUrl: string, options: Partial<FetchOptions>) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  public useInReq(middleware: ReqMiddlewareFunc) {
    this.reqMiddlewares.push(middleware);
  }

  public useInRes(middleware: ResMiddlewareFunc) {
    this.resMiddlewares.push(middleware);
  }

  private async execReqMiddlewaresChain(
    req: RequestInit
  ): Promise<RequestInit> {
    for (const fn of this.reqMiddlewares) {
      req = await fn(req);
    }

    return req;
  }

  private async execResMiddlewaresChain(res: object) {
    for (const fn of this.resMiddlewares) {
      res = fn(res);
    }

    return res;
  }

  private async fetchWithMiddlewares(
    url: string,
    reqInit: RequestInit = {},
    options?: RequestOptions
  ) {
    if (reqInit.method === HttpMethod.GET) {
      const cachedData = RequestCached.getInstance().get(url);

      if (cachedData) return cachedData;
    }

    const requestInit: RequestInit = await this.execReqMiddlewaresChain(
      reqInit
    );
    let abortController: AbortController | null = null;
    let timeoutId: number | null = null;

    if (this.options?.requestTimeout) {
      abortController = new AbortController();

      timeoutId = setTimeout(() => {
        abortController?.abort(
          "Request timeout reached, please try again later"
        );
      }, this.options?.requestTimeout);
    }

    const response = await fetch(url, {
      ...requestInit,
      signal: abortController?.signal,
    });

    if (timeoutId && response) {
      clearTimeout(timeoutId);
    }

    const jsonData = await response.json();

    const data: any = await this.execResMiddlewaresChain(jsonData);

    const cachedTimeout = options?.cached?.timeout;

    if (cachedTimeout) {
      RequestCached.getInstance().memorize(url, data, cachedTimeout);
    }

    return data;
  }

  private prepareBody(body: any): string | FormData {
    if (body instanceof FormData) {
      return body;
    }
    return JSON.stringify(body);
  }

  public async get(
    subUrl: string,
    reqInit: RequestInit = {},
    options?: RequestOptions
  ) {
    return await this.fetchWithMiddlewares(
      `${this.baseUrl}/${subUrl}`,
      {
        method: HttpMethod.GET,
        ...reqInit,
      },
      options
    );
  }

  public async post(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchWithMiddlewares(
      `${this.baseUrl}/${subUrl}`,
      {
        method: HttpMethod.POST,
        body: this.prepareBody(body),
        ...reqInit,
      },
      options
    );
  }

  public async put(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchWithMiddlewares(
      `${this.baseUrl}/${subUrl}`,
      {
        method: HttpMethod.PUT,
        body: this.prepareBody(body),
        ...reqInit,
      },
      options
    );
  }

  public async delete(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchWithMiddlewares(
      `${this.baseUrl}/${subUrl}`,
      {
        method: HttpMethod.DELETE,
        body: this.prepareBody(body),
        ...reqInit,
      },
      options
    );
  }

  public async patch(
    subUrl: string,
    reqInit: RequestInit = {},
    body: object,
    options?: RequestOptions
  ) {
    return await this.fetchWithMiddlewares(
      `${this.baseUrl}/${subUrl}`,
      {
        method: HttpMethod.PATCH,
        body: this.prepareBody(body),
        ...reqInit,
      },
      options
    );
  }
}

export default Fetch;
