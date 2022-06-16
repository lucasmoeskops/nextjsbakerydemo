import Link from "next/link";

export default function TopMenu({topMenu: {menuitems}}) {
  return <>
    {menuitems.map(({className, active, showDropdown, children, title, url}, idx) =>
      <li className={["presentation", active && 'active', showDropdown && 'has-submenu'].filter(i=>i).join(' ')} key={idx}>
        {showDropdown && <>
          <Link href={url}>
            <a className="allow-toggle">{title} <span><a
            className="caret-custom dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
            aria-expanded="false"></a></span></a>
          </Link>
        </> || <Link href={url}>
          <a href={url}>{title}</a>
        </Link>}
      </li>
    )}
  </>
}