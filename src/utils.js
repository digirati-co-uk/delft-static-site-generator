/**
 * The function replaces collection and exhibition links to display cover images 
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = (html, pageContext) => {
  return html.replace(
    /(<p><a href="(\/(collection|exhibition|object)s\/.*)">)([^<]+)<\/a><\/p>/g,
    function (match, p1, p2, p3, p4) {
      if (p2 && pageContext && pageContext.thumbnails && pageContext.thumbnails.hasOwnProperty(p2.substr(1))) {
        return `<a href="${p2}" class="cover-link" style="background-image: url(${pageContext.thumbnails[p2.substr(1)]});"><div class="boxtitle">${p3}</div><div class="maintitle">${p4}</div><div></div></a>`;
      } else {
        return `<a href="${p2}"><div class="boxtitle">${p3}</div><div class="maintitle">${p4}</div><div></div></a>`;
      }
    }
  );
};

export const getTranslation = (obj, lang, glue=' ') => (obj ? obj[lang] || [] : []).join(glue)

export default substituteSpecialLinks;

