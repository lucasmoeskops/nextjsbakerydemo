import HeaderHero from "../../structures/HeaderHero";
import WagtailStreamData from "../../../wagtail/components/WagtailStreamData";
import dynamic from "next/dynamic";

const MODULE_MAP = new Map([
  ['block_quote', dynamic(() => import('../../atoms/BlockQuoteBlock'))],
  ['heading_block', dynamic(() => import('../../atoms/HeadingBlock'))],
  ['image_block', dynamic(() => import('../../molecules/ImageBlock'))],
  ['paragraph_block', dynamic(() => import('../../atoms/ParagraphBlock'))],
])

export default function BreadPage({data: {body=[], breadType, image, introduction, origin, title}}) {
  return <>
    <HeaderHero image={image} title={title} />
    <div className="container bread-detail">
      <div className="row">
        <div className="col-md-12">
          <div className="col-md-7">
            <div className="row">
              {introduction && <p className="bread-detail__introduction">
                {introduction}
              </p>}

              <div className="hidden-md-down">
                <WagtailStreamData blockMap={MODULE_MAP} streamData={body} />
              </div>
            </div>
          </div>

          <div className="col-md-4 col-md-offset-1">
            <div className="row">
              <div className="bread-detail__meta">
                {origin && <>
                  <p className="bread-detail__meta-title">Origin</p>
                  <p className="bread-detail__meta-content">{origin}</p>
                </>}
                {breadType && <>
                  <p className="bread-detail__meta-title">Type</p>
                  <p className="bread-detail__meta-content">{breadType}</p>
                </>}
                {/*{% with ingredients=page.ingredients.all %}*/}
                {/*{% if ingredients %}*/}
                {/*<h4>Ingredients</h4>*/}
                {/*<ul>*/}
                {/*  {% for ingredient in ingredients %}*/}
                {/*  <li>*/}
                {/*    {{ingredient.name}}*/}
                {/*  </li>*/}
                {/*  {% endfor %}*/}
                {/*</ul>*/}
                {/*{% endif %}*/}
                {/*{% endwith %}*/}
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="row hidden-md-up">
              <WagtailStreamData blockMap={MODULE_MAP} streamData={body} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}