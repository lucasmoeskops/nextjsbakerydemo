function get_filter(spec, crop, vary_width = false) {
  const args = spec.split('x')

  if (args.length === 1) {
    return vary_width ? 'height' : 'width'
  }

  return crop ? 'fill' : 'max'
}


function build_spec(raw, crop = true, vary_width = false) {
    return `${get_filter(raw, crop, vary_width)}-${raw}`
}

function parseSource(source) {
  let query = source

  if (source.startsWith('http')) {
    query = new URL(source).search
  }

  return Object.fromEntries(new URLSearchParams(query).entries())
}


export const wagtailLoader = ({ src, width, quality }) => {
  const { image_id: imageId, ratio } = parseSource(src)
  let height = null
  let spec

  if (!imageId) {
    return '/placeholder.jpg'
  }

  if (ratio) {
    const [w, h] = ratio.split(':')
    height = Math.floor(width * h / w)
    spec = build_spec(`${width}x${height}`)
  } else {
    spec = build_spec(`${width}`)
  }

  // TODO: do anything with quality?
  return `${process.env.NEXT_PUBLIC_API_URL}/image/${imageId}/${spec}/`
}
