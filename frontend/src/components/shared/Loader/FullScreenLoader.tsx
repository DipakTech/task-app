import { ComponentPropsWithRef } from "react";
import { Loader } from "./BaseLoader";

export function FullScreenLoader(props: ComponentPropsWithRef<typeof Loader>) {
  return (
    <div className="bg-background w-screen h-screen flex items-center justify-center fixed top-0 left-0 z-50">
      <Loader {...props} />
    </div>
  );
}
