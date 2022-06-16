
import {useRef} from "react";
import Link from "next/link"
import TopMenu from "../../molecules/TopMenu";


export default function Header({data}) {
  const mobileNavigation = useRef();
  const mobileNavigationToggle = useRef();
  // const body = document.querySelector('body');

  function toggleMobileNavigation() {
      if (mobileNavigation.current.hidden) {
        // body.classList.add('no-scroll');
        mobileNavigation.current.hidden = false;
        mobileNavigationToggle.current.setAttribute('aria-expanded', 'true');
      } else {
        // body.classList.remove('no-scroll');
        mobileNavigation.current.hidden = true;
        mobileNavigationToggle.current.setAttribute('aria-expanded', 'false');
      }
  }

  return <div className="header clearfix">
    <div className="container">
      <div className="navigation">
        <Link href="/"><a className="navigation__logo">The Wagtail Bakery</a></Link>

        <button
            type="button"
            className="navigation__mobile-toggle"
            aria-label="Toggle mobile menu"
            aria-expanded="false"
            ref={mobileNavigationToggle}
            onClick={toggleMobileNavigation}
        >
          <span className="navigation__toggle-icon-bar"></span>
          <span className="navigation__toggle-icon-bar"></span>
          <span className="navigation__toggle-icon-bar"></span>
        </button>

        <nav className="navigation__mobile" ref={mobileNavigation} hidden>
          <Link href="/"><a className="navigation__logo">The Wagtail Bakery</a></Link>
          <ul className="navigation__items nav-pills">
            {/*{# main_menu is defined in base/templatetags/navigation_tags.py #}*/}
            {/*{% get_site_root as site_root %}*/}
            {/*{% top_menu parent=site_root calling_page=self %}*/}
          </ul>
          <form action="/search" method="get" className="navigation__mobile-search" role="search">
            <label htmlFor="mobile-search-input" className="u-sr-only">Search the bakery</label>
            <input className="navigation__search-input" id="mobile-search-input" type="text" placeholder="Search"
                   autoComplete="off" name="q" />
              <div aria-hidden="true" className="navigation__search-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
                      fill="#333"/>
                </svg>
              </div>
          </form>
        </nav>

        <nav className="navigation__desktop" aria-label="Main">
          <ul className="navigation__items nav-pills">
            <TopMenu {...data} />
          </ul>
        </nav>

        <form action="/search" method="get" className="navigation__search" role="search">
          <label htmlFor="search-input" className="u-sr-only">Search the bakery</label>
          <input className="navigation__search-input" id="search-input" type="text" placeholder="Search"
                 autoComplete="off" name="q" />
            <div aria-hidden="true" className="navigation__search-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
                    fill="#333"/>
              </svg>
            </div>
        </form>
      </div>
    </div>
  </div>
}