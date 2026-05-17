const HeaderAutoPilot = () => {
  return (
    <div className="header__autopilot">
      <input type="checkbox" id="cb-autopilot" className="header__autopilot-checkbox input-hidden" data-role="auto-pilot" />
      <label htmlFor="cb-autopilot" className="header__autopilot-label"></label>
    </div>
  )
}

export default HeaderAutoPilot