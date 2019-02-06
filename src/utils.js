/**
 * The function replaces collection and exhibition links to display cover images
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = (html, pageContext) => html.replace(
    /(<p><a href="(?:\/(en|nl))(\/(collection|exhibition|object)s\/.*)">)([^<]+)<\/a><\/p>/g,
    (match, p1, p2, p3, p4, p5) => {
      console.log('substituteSpecialLinks', match, p1, p2, p3, p4, p5, pageContext.thumbnails);
      const hasThumbnail = p3 && pageContext && pageContext.thumbnails
        && pageContext.thumbnails.hasOwnProperty(p3.substr(1));
      if (hasThumbnail) {
        return `<a href="/${p2}${p3}" class="cover-link" style="background-image: url(${pageContext.thumbnails[p3.substr(1)]});"><div class="boxtitle">${p4}</div><div class="maintitle">${p5}</div><div></div></a>`;
      }
        return `<a href="/${p2}${p3}"><div class="boxtitle">${p4}</div><div class="maintitle">${p5}</div><div></div></a>`;
    },
  );

export const getTranslation = (obj, lang, glue = ' ') => (obj ? obj[lang] || obj['@none'] || obj.none || [] : []).join(glue);

export const getPageLanguage = (pathname) => {
  // ...
  const languageCandidate = pathname.split('/')[0];
  return languageCandidate === 'nl' ? languageCandidate : 'en';
};

export default substituteSpecialLinks;
