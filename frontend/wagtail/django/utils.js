import React from 'react';


/**
 * linebreaks
 *
 * Similar functionality to the django linebreaks template tag.
 */
export function linebreaks(string) {
  return <>
    {string.split('\n').map((v, i) => <React.Fragment key={i}>
      {i && <br /> || null}{v}
    </React.Fragment>)}
  </>
}
