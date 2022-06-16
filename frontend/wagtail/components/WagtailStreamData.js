import React from 'react'

export default function WagtailStreamData({ blockMap, streamData }) {
  return streamData.map(({type, value, id}, otherId) => {
    if (blockMap.has(type)) {
      return React.createElement(blockMap.get(type), {key: id || otherId, data: value})
    }
  })
}
