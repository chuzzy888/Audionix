import { LiveButton } from "./live-button";
import { MicButton } from "./mix-button";

export const Controls = () => {
  return (
    <div className="flex space-x-4 mb-4">
      <MicButton />
      <LiveButton />
    </div>
  );
};
