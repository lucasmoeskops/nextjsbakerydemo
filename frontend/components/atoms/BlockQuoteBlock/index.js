export default function BlockQuoteBlock({data: {attributeName, text}}) {
  return <blockquote><p className="text">{text}</p>
    <p className="attribute_name">{attributeName}</p>
  </blockquote>
}
