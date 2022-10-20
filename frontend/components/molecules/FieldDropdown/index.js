export default function FieldDropdown({choices = '', defaultValue, name, required}) {
  const choicesArray = choices.split(',')
  return <select defaultValue={defaultValue} name={name} required={required}>
    {choicesArray.map((value, idx) => <option key={idx}>{value}</option>)}
  </select>
}
