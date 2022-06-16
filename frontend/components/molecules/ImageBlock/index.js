import WagtailImage from "../../atoms/Image";

export default function ImageBlock({data: {attribution, caption, image}}) {
  return <figure>
    <WagtailImage {...image} />
    <figcaption>{caption} - {attribution}</figcaption>
  </figure>
}