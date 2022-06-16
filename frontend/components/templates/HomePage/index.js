import dynamic from 'next/dynamic'
import WagtailStreamData from "../../../wagtail/components/WagtailStreamData";
import Link from "next/link";
import {richTextToReact} from "../../../wagtail/utils/richtext";
import CardListingCard from "../../molecules/CardListingCard";
import {Icon} from "../../atoms/Icon/Icon";
import WagtailImage from "../../atoms/Image";


const ModuleMap = new Map([
  ['paragraph_block', dynamic(() => import('../../atoms/ParagraphBlock'))],
])

function FeaturedSectionBread({title = '', featuredItems=[]}) {
  return <>
    <h2 className="featured-cards__title">{title}</h2>
    <ul className="featured-cards__list">
      {featuredItems.map((item, index) => <li key={index}>
        <CardListingCard data={item} />
      </li>)}
    </ul>
    <Link href="/breads">
      <a className="featured-cards__link">
        <span>View more of our breads</span>
        <Icon name={'chevron_icon'} color="#C55302" className="featured-cards__chevron-icon" viewBox="0 0 11 30" />
      </a>
    </Link>
  </>
}


export default function HomePage({
                                   data: {
                                     body=[],
                                     featuredSection1,
                                     featuredSection1Title,
                                     heroCta='',
                                     heroCtaLink='',
                                     heroText='',
                                     image='',
                                     promoImage='',
                                     promoText='',
                                     promoTitle='',
                                     title=''
                                   }
                                 }) {

  return <div className="homepage">

    <div className="container-fluid hero">
      {image && <WagtailImage layout="fill" objectFit="cover" priority={true} {...image} />}
      <div className="hero-gradient-mask"></div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-1 col-lg-5 home-hero">
            <h1>{title}</h1>
            <p className="lead">{heroText}</p>
            {heroCtaLink && <Link href={heroCtaLink}>
              <a className="hero-cta-link">
                {heroCta}
              </a>
            </Link> || heroCta}
          </div>
        </div>
      </div>
    </div>

    <div className="container">
      <div className="row promo-row">
        <div className="featured-cards col-sm-5 col-sm-offset-1">
          {featuredSection1 && <FeaturedSectionBread title={featuredSection1Title} {...featuredSection1} />}
        </div>

        <div className="col-sm-6 promo">
          {(promoImage || promoTitle || promoText) && <>
            <div className="col-lg-10 promo-text">
              {promoTitle && <h2>{promoTitle}</h2>}
              {promoText && <>{richTextToReact(promoText)}</>}
            </div>
            {promoImage && <figure style={{width: '590px'}}><WagtailImage {...promoImage} /></figure>}
          </>}
        </div>
      </div>
    </div>

    {body && body.length && <div className="container-fluid streamfield">
        <div className="row">
            <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 streamfield-column">
                <WagtailStreamData blockMap={ModuleMap} streamData={body}></WagtailStreamData>
            </div>
        </div>
    </div>}

  </div>
}
