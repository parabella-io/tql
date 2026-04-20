export type HttpHandler<HttpRequest, Response = unknown> = (request: HttpRequest) => Promise<Response> | Response;

export interface HttpAdapter<HttpRequest> {
  post(path: string, handler: HttpHandler<HttpRequest>): void;
  getBody(request: HttpRequest): unknown;
}
