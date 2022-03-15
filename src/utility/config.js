import {Platform} from 'react-native';

// Development Enviorment
export default {
  // BASE_URL: 'http://192.168.255.186:3000/',
  BASE_URL: 'http://dev.brightsideapi.tudip.uk/',
  SOCKET_BASE_URL: 'ws://3.10.138.224:5000/socket',
  // SOCKET_BASE_URL: 'ws://192.168.255.186:7000/socket',
  POLICY_URL: 'http://dev.angular.brightsidementoring.tudip.uk/',
  S3_BUCKET_ORIGIN_URL: 'https://brightside-assets.s3-eu-west-1.amazonaws.com',
  IMAGE_SERVER_CDN: 'http://d3v0z1a6j4y9wy.cloudfront.net/',
  GCM_SENDER_ID: '945682327048',
  BUG_SNAG_API_KEY: 'd27105c077609bdfb43199b874ae9c80',
  API_KEY:
    Platform.OS === 'ios'
      ? '3c4afb4fd46352977647e980f67b7456'
      : '1b0b3ff9876a5bf1d33f9767a7489a6f',
  APP_RELEASE_STAGE: __DEV__ ? 'dev' : 'qa',
  ATTACHMENT_URL: 'http://dev.brightsideimage.tudip.uk',
  ALGOLIA_DEFAULTS: {
    APP_ID: '8758NK3Q5J',
    API_KEY: '42de53ec239658462a11a8a4cb2684ff',
    SEARCH_PARAMETERS: {
      HITS_PER_PAGE: 5,
    },
    ALGOLIA_SEARCH_KEY: '97f263c3e9e14433b736ca7cd2b032c5',
    HIGHLIGHT: true,
  },
  ALGOLIA_FEATURED_ARTICLE_OPTION: {
    INDEX_NAME: 'articles_development',
  },
  ALGOLIA_CATEGORY_OPTION: {
    INDEX_NAME: 'categories_development',
  },
  ALGOLIA_NEWSARTICLE_OPTION: {
    INDEX_NAME: 'news_articles_development',
  },
};

// // Production Enviorment
// export default {
//     // BASE_URL: 'http://192.168.255.186:3000/',
//     BASE_URL: 'https://api.brightsidementoring.org/',
//     SOCKET_BASE_URL: 'wss://message.brightsidementoring.org/socket',
//     // SOCKET_BASE_URL: 'ws://192.168.255.186:7000/socket',
//     POLICY_URL: 'http://brightsidementoring.org/',
//     IMAGE_SERVER_CDN: 'https://d339voltx7yzmg.cloudfront.net/',
//     S3_BUCKET_ORIGIN_URL: 'https://brightside-assets.s3-eu-west-1.amazonaws.com',
//     GCM_SENDER_ID: '945682327048',
//     BUG_SNAG_API_KEY: 'd27105c077609bdfb43199b874ae9c80',
//     API_KEY: Platform.OS === 'ios' ? '3c4afb4fd46352977647e980f67b7456' : '1b0b3ff9876a5bf1d33f9767a7489a6f',
//     APP_RELEASE_STAGE: __DEV__ ? 'dev' : 'qa',
//     ATTACHMENT_URL: 'https://image.brightsidementoring.org',
//     ALGOLIA_DEFAULTS: {
//         APP_ID: '8758NK3Q5J',
//         API_KEY: '42de53ec239658462a11a8a4cb2684ff',
//         SEARCH_PARAMETERS: {
//             HITS_PER_PAGE: 5,
//         },
//         ALGOLIA_SEARCH_KEY: '97f263c3e9e14433b736ca7cd2b032c5',
//         HIGHLIGHT: true,
//     },
//     ALGOLIA_FEATURED_ARTICLE_OPTION: {
//         INDEX_NAME: 'articles_production',
//     },
//     ALGOLIA_CATEGORY_OPTION: {
//         INDEX_NAME: 'categories_production',
//     },
//     ALGOLIA_NEWSARTICLE_OPTION: {
//         INDEX_NAME: 'news_articles_production',
//     }
// };
