// import * as icons from './icons.json';
const icons = require('./icons.json');

export const IconDefs = () => {
  const SvgIcons = icons.map((icon, index) => (
    <svg
      id={`${icon.name}-icon`}
      viewBox={icon.viewBox || "0 0 24 24"}
      fill="currentColor"
      key={index}
      fillRule="evenodd" 
      clipRule="evenodd"
    >
      <path d={icon.path} />
    </svg>
  ));

  return (
    <svg style={{ display: "none" }}>
      <defs>
        {SvgIcons}
      </defs>
    </svg>
  );
};