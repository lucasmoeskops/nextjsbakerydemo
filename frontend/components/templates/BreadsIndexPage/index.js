import HeaderIndex from "../../structures/HeaderIndex";
import CardListingCard from "../../molecules/CardListingCard";
import {wagtailApiFetcher} from "../../../wagtail/api/public";
import {useEffect, useState} from "react";
import Pagination from "../../molecules/Pagination";
import {useRouter} from "next/router";


export default function BreadIndexPage({data: {breads: {items: initialBreads, totalCount}, introduction, id, title}}) {
  const router = useRouter()
  const searchParams = {
    descendant_of: id,
    fields: ['bread_type', 'featured_image', 'origin', 'title', 'url'].join(','),
    type: 'breads.BreadPage',
    order: '-first_published_at',
    limit: Math.max(initialBreads.length, 6),
  }

  const readPageFromQuery = () => Number(router.query.page) || 1
  const [page, setPage] = useState(readPageFromQuery)
  const [breads, setBreads] = useState(initialBreads)
  const calculateTotalPages = totalItems => Math.ceil((totalItems || 0) / searchParams.limit)
  const [totalPages, setTotalPages] = useState(calculateTotalPages(totalCount))

  useEffect(() => {
    const newPage = readPageFromQuery()
    if (page !== newPage) {
      setPage(newPage)
    }
  }, [page, router.query.page])

  useEffect(() => {
    const query = new URLSearchParams({
      ...searchParams,
      offset: (page - 1) * searchParams.limit
    })

    // TODO: do we need to manually cancel this request when a new one is made?
    wagtailApiFetcher(`/pages/?${query.toString()}`).then(res => {
      // Featured image needed a different name because the rendition spec is different
      const breads = res.items.map(item => ({...item, image: item.featuredImage}))
      setBreads(breads)
      setTotalPages(calculateTotalPages(res.meta.totalCount))
    }).catch(err => setBreads([]))
  }, [page])

  return <>
    <HeaderIndex introduction={introduction} title={title} />

    <div className="container">
      <ul className="bread-list">
        {breads.map((bread, index) => <li key={index}>
          <CardListingCard data={bread} />
        </li>)}
      </ul>
    </div>

    {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
  </>
}