import "./ToggleSwitch.scss";

const ToggleSwitch = () => {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id="cb-autopilot"
        className="toggle-switch__checkbox input-hidden"
        data-role="auto-pilot"
        aria-label="Toggle header auto mode"
      />

      <label
        htmlFor="cb-autopilot"
        className="toggle-switch__label"
      />
    </div>
  )
}

export default ToggleSwitch