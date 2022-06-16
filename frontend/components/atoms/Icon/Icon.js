import PropTypes from 'prop-types';

const icons = require('./icons.json');

export const Icon = ({ name = null, size = null, color, display = 'block', title=null, viewBox="0 0 24 24", ...rest }) => {
  const styles = {
    lineHeight: size ? `${size}em` : "1em",
    // height: !size ? `100%` : null,
    // width: !size ? `100%`: null,
    color: color ? color : "currentColor",
    display
  };
  
  if(!name){
    throw new Error('No icon name set');
  }
  
  return name && <svg style={{ ...styles }} {...rest} viewBox={viewBox} width={size && size} height={size && size} xmlns="http://www.w3.org/2000/svg">
    { title && <title id="title">{title}</title> }
    <use
      href={`#${icons.find((icon) => icon.name ===
      name.trim()).name}-icon`}
    />
  </svg>
};

Icon.propTypes ={
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
}