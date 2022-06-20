import HeaderHero from "../../structures/HeaderHero";
import WagtailStreamData from "../../../wagtail/components/WagtailStreamData";
import dynamic from "next/dynamic";
import {linebreaks} from "../../../wagtail/django/utils";

const MODULE_MAP = new Map([
  ['block_quote', dynamic(() => import('../../atoms/BlockQuoteBlock'))],
  ['heading_block', dynamic(() => import('../../atoms/HeadingBlock'))],
  ['image_block', dynamic(() => import('../../molecules/ImageBlock'))],
  ['paragraph_block', dynamic(() => import('../../atoms/ParagraphBlock'))],
])

export default function LocationPage(
    {
       data: {
         address,
         body = [],
         image,
         introduction,
         isOpen,
         operatingHours,
         title
       }}
) {
  return <>
    <HeaderHero image={image} title={title}/>
    <div className="container bread-detail">
      <div className="row">
        <div className="col-md-12">
          <div className="col-md-7">
            <div className="row">
              {introduction && <p className="bread-detail__introduction">
                {introduction}
              </p>}

              <div className="hidden-md-down">
                <WagtailStreamData blockMap={MODULE_MAP} streamData={body}/>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-md-offset-1">
            <div className="row">
              <div className="bread-detail__meta">
                <p className="location__meta-title">Operating Status</p>
                {isOpen &&
                    "This location is currently open." ||
                    "Sorry, this location is currently closed."
                }

                <p className="location__meta-title">Address</p>
                <address>{linebreaks(address)}</address>

                {operatingHours && <>
                  <p className="location__meta-title">Opening hours</p>
                  {operatingHours.map(({closingTime, closed, day, openingTime}, index) => <>
                    <time itemProp="openingHours" key={index} dateTime={openingTime} className="location__time">
                      <span className="location__day">{day}</span>:
                      <span className="location__hours">
                        {closed && <>Closed</> || <>
                          {openingTime}{closingTime && ` - ${closingTime}`}
                        </>}
                      </span>
                    </time>
                  </>)}
                </>}
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="row hidden-md-up">
              <WagtailStreamData blockMap={MODULE_MAP} streamData={body}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}