import Link from "next/link";
import {Icon} from "../../atoms/Icon/Icon";

export default function Breadcrumbs({data: {breadcrumbs}}) {
  if (!breadcrumbs) {
    return
  }
  const {ancestors} = breadcrumbs
  return ancestors && <nav className="breadcrumb-container" aria-label="Breadcrumb">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <ol className="breadcrumb">
            {ancestors.map(({title, url}, idx) => (
              idx + 1 === ancestors.length && <li aria-current="page" key={idx}>
                {title}
              </li> || <li>
                <Link href={url}>
                  <a>
                    {idx === 0 && 'Home' || title}
                  </a>
                </Link>
                <Icon display="inline" name={'chevron_icon'} color="#C55302" className="breadcrumb__chevron-icon" viewBox="0 0 11 30" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </nav>
}
