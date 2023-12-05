/**
 * The function replaces collection and exhibition links to display cover images
 * @param {String} html - html string to post process
 * @returns {String} the post processed html
 */
const substituteSpecialLinks = (html, pageContext, allMDRemark) => {
  return html.replace(
    /(<p><a href="(?:\/(en|nl))(\/(collection|exhibition|object|publication)s\/.*)">)([^<]+)<\/a><\/p>/g,
    (match, p1, p2, p3, p4, p5) => {
      const hasThumbnail =
        p3 &&
        pageContext &&
        pageContext.thumbnails &&
        pageContext.thumbnails.hasOwnProperty(p3.substr(1));
      if (hasThumbnail) {
        return `<a href="/${p2}${p3}" class="cover-link">
            <div class="image">
              <img class="bg" src="${pageContext.thumbnails[p3.substr(1)]}">
            </div>
              <div class="content">
                <div class="boxtitle">${p4}</div>
                <div class="maintitle">${p5}</div>
                <div></div>
              </div>
          </a>`;
      }
      if (p4 === 'publication') {
        return `<a href="/${p2}${p3}">
            <div class="boxtitle">ARTICLE
            </div>
            <div class="maintitle">${p5}</div>
            <div class="caption">${getAuthor(`/${p2}${p3}`, allMDRemark)}</div>
          </a>`;
      }
    }
  );
};

const getAuthor = (path, allMDRemark) => {
  let author;
  allMDRemark.edges.forEach((markdown) => {
    if (markdown.node.frontmatter.path === path) {
      author = markdown.node.frontmatter.author;
    }
  });
  return `${author}`;
};

export const getTranslation = (obj, lang, glue = ' ') => {
  if (obj) {
    if (
      (obj ? obj[lang] || obj['@none'] || obj.none || [] : []).join(glue) ===
        '' &&
      lang === 'en' &&
      obj.nl
    ) {
      return obj.nl.join(glue);
    } else if (
      (obj ? obj[lang] || obj['@none'] || obj.none || [] : []).join(glue) ===
        '' &&
      lang === 'nl' &&
      obj.en
    ) {
      return obj.en.join(glue);
    }
  }
  return (obj ? obj[lang] || obj['@none'] || obj.none || [] : []).join(glue);
};

export const getPageLanguage = (pathname) => {
  // the gatsby build process will only see props.location for top level
  // pages component. So it's important to note values that are required
  // to be translated during the build process, such as that of the
  // typesense search index, are required to be accessed from the page
  // level components.
  if (!pathname) return 'nl';
  const languageCandidate = pathname.split('/')[1];
  return languageCandidate === 'nl' ? languageCandidate : 'en';
};

export const thumbnailGetSize = (thumbnail, pWidth, pHeight) => {
  const thumb = thumbnail.__jsonld;
  if (!thumb.hasOwnProperty('service') || !(pWidth || pHeight)) {
    return thumb.id || thumb['@id'];
  }
  const service = Array.isArray(thumb.service)
    ? thumb.service[0]
    : thumb.service;
  if (!service) {
    return thumb.id || thumb['@id'];
  }
  if (
    service.hasOwnProperty('sizes') &&
    Array.isArray(service.sizes) &&
    service.sizes.length > 0
  ) {
    let closestSizeIndex = -1;
    let minDistanceX;
    let minDistanceY;
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
      thumbUrlParts[thumbUrlParts.length - 3] = [size.width, size.height].join(
        ','
      );
    }
    return thumbUrlParts.join('/') + '/';
  }
  return thumb.id || thumb['@id'];
};

export default substituteSpecialLinks;

export const GITHUB_RAW_JSON_BASE =
  'https://raw.githubusercontent.com/digirati-co-uk/delft-static-site-generator/master/src';
export const GITHUB_BASE =
  'https://github.com/digirati-co-uk/delft-static-site-generator/blob/master/';
