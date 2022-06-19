import HeaderHero from "../../structures/HeaderHero";
import WagtailStreamData from "../../../wagtail/components/WagtailStreamData";
import dynamic from "next/dynamic";
import {linebreaks} from "../../../wagtail/django/utils";
import HeaderIndex from "../../structures/HeaderIndex";
import CardPictureCard from "../../molecules/CardPictureCard";

const MODULE_MAP = new Map([
  ['block_quote', dynamic(() => import('../../atoms/BlockQuoteBlock'))],
  ['heading_block', dynamic(() => import('../../atoms/HeadingBlock'))],
  ['image_block', dynamic(() => import('../../molecules/ImageBlock'))],
  ['paragraph_block', dynamic(() => import('../../atoms/ParagraphBlock'))],
])

export default function LocationIndexPage(
    {
       data: {
         introduction,
         locations,
         title
       }}
) {
  return <>
    <HeaderIndex introduction={introduction} title={title} />

    <div className="container">
      <div className="location-list-page">
        {locations.map((location, index) => <CardPictureCard data={location} key={index} portrait={false} />)}
      </div>
    </div>
  </>
}
