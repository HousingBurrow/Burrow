export type ActionResult<T = undefined, ErrorDetail = {}> = Promise<
  { isError: false; data: T } | (ErrorDetail & { isError: true; message?: string })
>;
