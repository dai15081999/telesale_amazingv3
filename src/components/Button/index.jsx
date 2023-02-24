import { forwardRef } from "react";

export const Button = forwardRef(({ className, children, ...rest }, ref) => {
  return (
    <button className={`${className}`} {...rest} ref={ref}>
      {children}
    </button>
  );
});
