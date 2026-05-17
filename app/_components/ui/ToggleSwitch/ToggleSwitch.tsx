import "./ToggleSwitch.scss";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id="cb-autopilot"
        className="toggle-switch__checkbox input-hidden"
        data-role="auto-pilot"
        aria-label="Toggle header auto mode"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <label
        htmlFor="cb-autopilot"
        className="toggle-switch__label"
      />
    </div>
  );
};

export default ToggleSwitch;