const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

export const Events = {
  MESSAGE_ADDED: 'MESSAGE_ADDED',
};
