const HeaderAutoPilot = () => {
  return (
    <div className="header__actions-autopilot">
      <input type="checkbox" id="cb-autopilot" className="header__actions-autopilot-checkbox" data-role="auto-pilot" />
      <label htmlFor="cb-autopilot" className="header__actions-autopilot-label"></label>
    </div>
  )
}

export default HeaderAutoPilot