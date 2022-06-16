import React from 'react';
import Link from 'next/link'
import {Parser, ProcessNodeDefinitions} from 'html-to-react';

export function richTextToReact(html, options = {}) {
  const htmlToReactParser = new Parser();
  const processNodeDefinitions = new ProcessNodeDefinitions(React);
  return htmlToReactParser.parseWithInstructions(
    html,
    () => true,
    [
      {
        // Custom <a> processing
        shouldProcessNode: function (node) {
          return node.name === 'a';
        },
        processNode: function (node, children) {
          const {href, ...rest} = node.attribs
          return <Link href={href}><a {...rest}>{richTextToReact(children)}</a></Link>;
        }
      },
      {
        // Anything else
        shouldProcessNode: function (node) {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
      }
    ]
  );
}
