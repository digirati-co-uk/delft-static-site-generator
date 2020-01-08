import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/layout';
import { getPageLanguage } from '../../utils';

const Publications = ({ data, path: pagePath }) => {
  const pageLanguage = getPageLanguage(pagePath);

  return (
    <Layout language={pageLanguage} path={pagePath}>
      <main>
        <div className="blocks">
          {data.allMarkdownRemark &&
            (data.allMarkdownRemark.edges || []).map(article => {
              const { title, date, path, author } = article.node.frontmatter;
              return (
                <div className="block title cutcorners w-4 h-4 ">
                  <div className="boxtitle">{date || '[Date]'}</div>
                  <div className="maintitle">
                    {title || '[Title]'}
                    <p className="readmore">
                      <a href={path}>Read More</a>
                    </p>
                  </div>
                  <div className="boxtitle">{author || '[Author]'}</div>
                </div>
              );
            })}
        </div>
    </main>
</Layout>
);
};

Publications.propTypes = {
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default Publications;

export const pageQuery = graphql`
query($path: String!) {
  allMarkdownRemark(
   filter: { frontmatter: { path: { regex: $path }}}
   sort: { fields: [frontmatter___date], order: DESC}
 ){
   edges {
     node {
       id,
       frontmatter {
         title
         path
         date
         author
       }
     }
   }
 }
  allSitePage {
      edges {
        node {
          id
          path
        }
      }
    }
}`;
