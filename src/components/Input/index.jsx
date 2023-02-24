import { forwardRef } from "react";

export const Input = forwardRef(({ ...rest }, ref) => {
  return <input {...rest} ref={ref} />;
});
