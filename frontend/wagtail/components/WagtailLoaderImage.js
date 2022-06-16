import Image from 'next/image'
import {wagtailLoader} from "../image";

export default function WagtailLoaderImage(props) {
  return <Image loader={wagtailLoader} {...props} />
}
