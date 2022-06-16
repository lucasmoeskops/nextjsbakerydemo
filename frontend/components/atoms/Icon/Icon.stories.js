const icons = require('./icons.json');
import { IconDefs } from './IconDefs';
import { Icon } from './Icon';

const iconNames = icons.map(icon=>icon.name);

/*
  - Add documentation for using Icon Defs (https://medium.com/@neilmorgan.mail/using-inline-svg-icons-in-react-2cc9ac20bd6a)
  - Icon search/filter by name
  - Add color parameter

*/


export default {
  title: 'Design System/Atoms/Icon',
  component: Icon,
  argTypes: {
    name: {
      description: `Select one of the icon names`,
      type: {
        required: true,
      },
      defaultValue: iconNames[0],
      options: iconNames,
      control: { type: 'select' }
    },
    size: {
      description: 'Default value is null. Icon will grow as big as container is unless a Number is set.',
      control: 'number',
      defaultValue: null
    },
  },
}


export const AllIcons = (args) => (
  <>
    <IconDefs />
    <ul className="flex flex-wrap">
      {
        iconNames.map(icon=>{
          return (
            <li className="flex w-1/2 sm:w-1/3 px-1" key={`icon_`+icon}>
              <div className="border px-2 py-3 mb-2 flex flex-col items-center w-full">
                <Icon name={icon} size={24} />
                <p className="text-md mt-1"><small>{icon}</small></p>
              </div>
            </li>
          )
        })
      }
    </ul>
  </>
)

AllIcons.argTypes ={
  size: {
    control: false,
  },
  name: {
    control: false,
  },
}

export const Playground = (args) => (
  <>
    <div className="text-gray-300 text-sm"><small>Icon container</small></div>
        <div className={`mb-4 border relative`}>     
      <IconDefs />
      <Icon {...args} />
    </div>
  </>
);

// Playground.args = {
//   name: {
//     defaultValue: iconNames[0],
//     options: iconNames,
//     control: { type: 'select' }
//   },
// }