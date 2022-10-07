declare var API: {
  readonly hostUrl: string;
  request<T, P>(path: string, method: RequestMethod, data: T): Promise<P>;
};

type RequestMethod = "GET" | "POST" | "PATCH";

interface HeadersObject {
  Authorization?: string;
}
