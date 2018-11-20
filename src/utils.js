const substituteSpecialLinks = html => html.replace(
  /(<p><a href="(\/(collection|exhibition)\/.*)">)([^<]+)<\/a><\/p>/g,
  '<a href="$2" class="cover-link"><span>$3</span>$4</a>'
);

export default substituteSpecialLinks;

