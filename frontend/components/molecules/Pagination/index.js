import Link from "next/link";
import {useRouter} from "next/router";


export default function Pagination({currentPage, totalPages}) {
  const router = useRouter()
  const queryUrl = page => `?${new URLSearchParams({...router.query, page}).toString()}`
  // We currently support a single page range
  const pageRange = [1, currentPage - 1, currentPage, currentPage + 1, totalPages].reduce((p, c) => p && p[p.length-1] >= c && p || c > totalPages && p || [...p, c], [])
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return <nav className="pagination" aria-label="Pagination">
    <ul className="pagination__list">
      {hasPrevious && <li className="page-item">
        <Link href={queryUrl(currentPage - 1)}><a className="page-link previous arrows">previous</a></Link>
      </li> || <li className="page-item disabled">
        <a className="page-link">previous</a>
      </li>}

      {pageRange.map(n => (
          n === currentPage && <li className="page-item active" key={n}>
            <span>{n} <span className="sr-only">(current)</span></span>
          </li> || <li className="page-item" key={n}>
            <Link href={queryUrl(n)}>
              <a className="page-link">{n}</a>
            </Link>
          </li>
      ))}

      {hasNext && <li className="page-item">
        <Link href={queryUrl(currentPage + 1)}>
          <a className="page-link next arrows">next</a>
        </Link>
      </li> || <li className="page-item disabled">
        <a className="page-link">next</a>
      </li>}
    </ul>
  </nav>
}