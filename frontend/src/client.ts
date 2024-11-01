export interface ApiError {
  body: {
    detail?: string | { msg: string }[];
  };
}