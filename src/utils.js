/**
 * The function replaces collection and exhibition links to display cover images 
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = (html, pageContext) => {
  return html.replace(
    /(<p><a href="(\/(collection|exhibition)s\/.*)">)([^<]+)<\/a><\/p>/g,
    function (match, p1, p2, p3, p4) {
      if (p2 && pageContext && pageContext.thumbnails && pageContext.thumbnails.hasOwnProperty(p2.substr(1))) {
        return `<a href="${p2}" class="cover-link" style="background-image: url(${pageContext.thumbnails[p2.substr(1)]});"><span>${p3}</span>${p4}</a>`;
      } else {
        return `<a href="${p2}" class="cover-link"><span>${p3}</span>${p4}</a>`;
      }
    }
  );
};

export const getTranslation = (obj, lang, glue=' ') => (obj[lang] || []).join(glue)

export default substituteSpecialLinks;

