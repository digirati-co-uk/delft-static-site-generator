/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import { globalHistory } from '@reach/router';

export const onInitialClientRender = () => {
  /**
   * This is a workaround for a bug in Gatsby
   *
   * See https://github.com/gatsbyjs/gatsby/issues/8357 for more details
   */
  globalHistory._onTransitionComplete();
};
