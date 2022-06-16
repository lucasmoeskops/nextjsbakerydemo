import WagtailImage from "../../atoms/Image";

export default function HeaderHero({image, title}) {
  return image && <div className="container-fluid hero">
    {image && <WagtailImage layout="fill" objectFit="cover" {...image} />}
    <div className="hero__container">
      <h1 className="hero__title">{title}</h1>
    </div>
  </div> || <div className="container">
    <div className="row">
      <div className="col-md-7">
        <h1>{title}</h1>
      </div>
    </div>
  </div>
}