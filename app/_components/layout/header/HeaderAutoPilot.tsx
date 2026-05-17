import { Dispatch, SetStateAction } from "react";
import ToggleSwitch from "../../ui/ToggleSwitch/ToggleSwitch";

type HeaderAutoPilotProps = {
  autoPilotEnabled: boolean;
  setAutoPilotEnabled: Dispatch<SetStateAction<boolean>>;
};

const HeaderAutoPilot = ({
  autoPilotEnabled,
  setAutoPilotEnabled,
}: HeaderAutoPilotProps) => {
  return (
    <ToggleSwitch
      checked={autoPilotEnabled}
      onChange={setAutoPilotEnabled}
    />
  );
};

export default HeaderAutoPilot;