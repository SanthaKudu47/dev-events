import { ZodError } from "zod";

export function handleZodError<TSchemaErrorType>(error: TSchemaErrorType): string[] {
  if (error instanceof ZodError) {
    // return error.errors.map((err) => {
    //   const path = err.path.join(".");
    //   return path ? `${path}: ${err.message}` : err.message;
    // });
    console.log(error);
  }
  return ["Unexpected error occurred"];
}
