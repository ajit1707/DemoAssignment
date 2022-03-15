import React from 'react';
import truncate from 'truncate-html';
import HTML from 'react-native-render-html';
import {openLink} from '../utility/helper';

const HtmlRenderer = (props) => (
  <HTML
    onLinkPress={(event, href) => openLink(href, props)}
    {...props}
    html={truncate(
      props.html && props.html.trim(),
      props.numberOfWords ? props.numberOfWords : 0,
    )}
  />
);

export default HtmlRenderer;
