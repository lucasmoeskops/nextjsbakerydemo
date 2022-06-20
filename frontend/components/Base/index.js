import Head from 'next/head'
import dynamic from 'next/dynamic'
import {useRouter} from "next/router"
import WagtailAdminUserBar from "../structures/wagtailadminuserbar";
import { SWRConfig } from "swr";
import React, {useEffect, useMemo, useState} from "react";
import Header from "../structures/Header";
import Breadcrumbs from "../organisms/Breadcrumbs";


// TODO: Don't load dynamically to improve rendering speed?
const templateMap = new Map([
  ['base.HomePage', dynamic(() => import('../templates/HomePage'))],
  ['breads.BreadsIndexPage', dynamic(() => import('../templates/BreadsIndexPage'))],
  ['breads.BreadPage', dynamic(() => import('../templates/BreadPage'))],
  ['locations.LocationPage', dynamic(() => import('../templates/LocationPage'))],
  ['locations.LocationsIndexPage', dynamic(() => import('../templates/LocationsIndexPage'))],
])


export default function Base({ data, children }) {
  const [currentData, updateData] = useState(data)
  const router = useRouter()

  // Update the data when it is available
  useEffect(() => {
    if (!router.isFallback && data) {
      updateData(data)
    }
  }, [data, router.isFallback])

  // Keep the old data until new data is available
  const content = useMemo(() => {
    if (!currentData) {
      return <></>
    }

    const {
    meta: {
      seoTitle,
      searchDescription,
      type,
    },
    title,
  } = currentData

    if (!templateMap.has(type)) {
      return <div>500 Unknown template</div>
    }

    return <>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${seoTitle || title} | The Wagtail Bakery`}</title>
        {searchDescription && <meta name="description" content={searchDescription} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {router.isFallback && <div style={{position: 'fixed', top: '50%', left: '50%', zIndex: '100', background: 'white', padding: '5px 10px'}}>Loading...</div>}

      <Header data={currentData} />

      <Breadcrumbs data={currentData} />

      {React.createElement(templateMap.get(type), {data: currentData})}

      <div>{ children }</div>

      <WagtailAdminUserBar data={data} />
    </>
  }, [currentData, children, router.isFallback])

  return <SWRConfig>
    {content}
  </SWRConfig>
}
