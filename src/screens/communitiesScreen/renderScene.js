import Topics from './topics';
import Threads from './threads';
import React, {PureComponent} from 'react';

class RenderScene extends PureComponent {
  render() {
    const {
      route,
      navigateToQuickPost,
      navigateToSelectedTopic,
      navigateToAddTopic,
      navigateToThreadPost,
      onLikeThread,
      onFollowThread,
    } = this.props;
    switch (route.route.key) {
      case 'first':
        return (
          <Topics
            navigateToSelectedTopic={navigateToSelectedTopic}
            navigateToAddTopic={navigateToAddTopic}
            navigateToThreadPost={navigateToThreadPost}
            onLikeThread={onLikeThread}
            onFollowThread={onFollowThread}
            {...this.props}
          />
        );
      case 'second':
        return (
          <Threads
            navigateToAddTopic={navigateToAddTopic}
            {...this.props}
            navigateToThreadPost={navigateToThreadPost}
            onLikeThread={onLikeThread}
            onFollowThread={onFollowThread}
            navigateToQuickPost={navigateToQuickPost}
          />
        );
      default:
        return null;
    }
  }
}
export default RenderScene;
