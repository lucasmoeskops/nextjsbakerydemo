import WagtailImage from "../../atoms/Image";


export default function CardPictureCard({data: {image, portrait, portraitImage, title, url}}) {
  return <div className="picture-card">
    <a className="picture-card__link" href={url}>
      <figure className="picture-card__image">
        {portrait && <WagtailImage {...portraitImage} /> || <WagtailImage {...image} />}
        <div className="picture-card__contents">
          <h3 className="picture-card__title">{title}</h3>
        </div>
      </figure>
    </a>
  </div>
}