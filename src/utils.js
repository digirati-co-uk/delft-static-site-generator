/**
 * The function replaces collection and exhibition links to display cover images 
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = html => html.replace(
  /(<p><a href="(\/(collection|exhibition)\/.*)">)([^<]+)<\/a><\/p>/g,
  '<a href="$2" class="cover-link"><span>$3</span>$4</a>'
);

export default substituteSpecialLinks;

