/**
 *
 * Content is coming from the StandardBlock StreamField
 * class within `blocks.py`
 */

export default function HeadingBlock({data: {headingText, size}}) {
  return <>
    {size === 'h2' && <h2>
      {headingText}
    </h2> || size === 'h3' && <h3>
      {headingText}
    </h3> || size === 'h4' && <h4>
      {headingText}
    </h4>}
  </>
}
