import Image from "next/image";
import WagtailImage from "../../atoms/Image";


function CardListingCardImage({data}) {
  return <figure className="listing-card__image">
    <WagtailImage {...data} />
  </figure>
}


export default function CardListingCard({data: {breadType, image, origin, title, url}}) {
  return <div className="listing-card">
    <a className="listing-card__link" href={url}>
      {image && <CardListingCardImage data={image} />}
      <div className="listing-card__contents">
        <h3 className="listing-card__title">{title}</h3>
        {(origin || breadType) && <table className="listing-card__meta">
          <tbody>
            {origin && <tr>
              <td className="listing-card__meta-category">Origin</td>
              <td className="listing-card__meta-content">{origin}</td>
            </tr>}
            {breadType && <tr>
              <td className="listing-card__meta-category">Type</td>
              <td className="listing-card__meta-content">{breadType}</td>
            </tr>}
          </tbody>
        </table>}
      </div>
    </a>
  </div>
}