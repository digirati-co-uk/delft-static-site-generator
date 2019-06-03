/**
 * The function replaces collection and exhibition links to display cover images
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = (html, pageContext) => html.replace(
    /(<p><a href="(?:\/(en|nl))(\/(collection|exhibition|object)s\/.*)">)([^<]+)<\/a><\/p>/g,
    (match, p1, p2, p3, p4, p5) => {
      const hasThumbnail = p3 && pageContext && pageContext.thumbnails
        && pageContext.thumbnails.hasOwnProperty(p3.substr(1));
      if (hasThumbnail) {
        let template = `
          <a href="/${p2}${p3}" class="cover-link">
            <div class="image">
              <img class="bg" src="${pageContext.thumbnails[p3.substr(1)]}">
            </div>
            <div class="content">
              <div class="boxtitle">${p4}</div>
              <div class="maintitle">${p5}</div>
              <div></div>
            </div>

          </a>
        `;
        return template;
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

export const thumbnailGetSize = (thumbnail, pWidth, pHeight) => {
  const thumb = thumbnail.__jsonld;
  if (!thumb.hasOwnProperty('service') || !(pWidth || pHeight)) {
    return (thumb.id || thumb['@id']);
  }
  const service = Array.isArray(thumb.service) ? thumb.service[0] : thumb.service;
  if (!service) {
    return (thumb.id || thumb['@id']);
  }
  if (
    service.hasOwnProperty('sizes')
    && Array.isArray(service.sizes)
    && service.sizes.length > 0
  ) {
    let closestSizeIndex = -1;
    let minDistanceX = Number.MAX_SAFE_INTEGER;
    let minDistanceY = Number.MAX_SAFE_INTEGER;
    service.sizes.forEach((size, index) => {
      if (pWidth) {
        const xDistance = Math.abs(size.width - pWidth);
        if (minDistanceX >= xDistance) {
          closestSizeIndex = index;
          minDistanceX = xDistance;
        }
      }
      if (pHeight) {
        const yDistance = Math.abs(size.height - pHeight);
        if (minDistanceY >= yDistance) {
          closestSizeIndex = index;
          minDistanceY = yDistance;
        }
      }
    });
    const thumbUrlParts = (thumb.id || thumb['@id']).split('/');
    if (closestSizeIndex !== -1) {
      const size = service.sizes[closestSizeIndex];
      thumbUrlParts[thumbUrlParts.length - 3] = [size.width, size.height].join(',');
    }
    return thumbUrlParts.join('/');
  }
  return (thumb.id || thumb['@id']);
};


export default substituteSpecialLinks;
