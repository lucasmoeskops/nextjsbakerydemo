export default function FieldEmail({defaultValue = '', name}) {
  return <input type="email" name={name} defaultValue={defaultValue} />
}