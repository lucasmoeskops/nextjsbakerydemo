import NextImage from "next/image";
import useDimensions from "react-cool-dimensions";

const AutoWidthObservingImage = (props) => {
  const { observe, width } = useDimensions()
  const size = width !== null ? `${Math.round(width)}px` : '320px'

  return <div ref={observe}>
    <NextImage sizes={size} {...props} />
  </div>
}

export default function WagtailImage({url, ...rest}) {
  if (rest.layout === 'fill') {
    // layout fill doesn't like width and height
    delete rest.height
    delete rest.width
  }

  return <AutoWidthObservingImage src={`${process.env.NEXT_PUBLIC_WAGTAIL_URL}${url}`} {...rest} />
}
