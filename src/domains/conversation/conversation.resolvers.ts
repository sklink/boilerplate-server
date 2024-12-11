import { Arg, Ctx, Mutation, FieldResolver, Resolver, ID, Root, Subscription, InputType, Field, Int } from "type-graphql";
import { Service } from "typedi";

// Utils
import { IContext } from "../../loaders/graphql";
import { Events } from "../../services/pubsub";

// Models
import { Conversation, ConversationModel } from "./conversation.model";
import { Message, MessageModel } from "../message/message.model";

@InputType()
class MessageInput {
  @Field()
  content!: string;

  @Field(() => ID)
  conversationId!: string;
}

@Service()
@Resolver()
export class ConversationResolver {
  @Mutation(() => Message)
  async sendMessage(@Arg("input") input: MessageInput, @Ctx() ctx: IContext ): Promise<Message> {
    const { conversationId, content } = input;

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const sentAt = new Date();

    const message = await MessageModel.create({
      conversationId,
      content,
      userId: ctx.user._id,
      sentAt,
    });

    const readToKey = getReadToKey({ userId: ctx.user._id, conversation });
    conversation.readTo[readToKey] = sentAt.getTime();
    conversation.markModified("readTo");
    await conversation.save();

    pubsub.publish(Events.MESSAGE_ADDED, { messageAdded: message });

    return message;
  }

  @Mutation(() => Conversation)
  async markConversationRead(
    @Arg("conversationId", () => ID) conversationId: string,
    @Ctx() ctx: IContext
  ): Promise<Conversation> {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const messages = await MessageModel.find({ conversationId }).sort({ sentAt: 1 });
    if (messages.length === 0) return conversation;

    const readToKey = getReadToKey({ userId: ctx.user._id, conversation });
    conversation.readTo[readToKey] = messages[messages.length - 1].sentAt.getTime();
    conversation.markModified("readTo");

    return await conversation.save();
  }

  @Subscription(() => Message, {
    topics: Events.MESSAGE_ADDED,
    filter: ({ payload, args }) =>
      String(payload.messageAdded.conversationId) === args.conversationId,
  })
  async messageAdded(
    @Root() payload: { messageAdded: Message },
    @Arg("conversationId", () => ID) conversationId: string
  ): Promise<Message> {
    return payload.messageAdded;
  }

  @FieldResolver(() => [Message])
  async messages(@Root() conversation: Conversation): Promise<Message[]> {
    return MessageModel.find({ conversationId: conversation._id }).sort({ sentAt: -1 });
  }

  @FieldResolver(() => Int)
  async unreadMessageCount(@Root() conversation: Conversation): Promise<number> {
    const readToKey = getReadToKey({ userId: conversation.user, conversation });
    const readTo = conversation.readTo ? conversation.readTo[readToKey] : null;

    const messages = await MessageModel.find({ conversationId: conversation._id }).sort({ sentAt: -1 });
    if (!readTo) return messages.length;

    const lastReadIndex = messages.findIndex(
      (message) => message.sentAt.getTime() === readTo
    );

    return lastReadIndex === -1 ? messages.length : lastReadIndex;
  }
}

function getReadToKey({ userId, conversation }) {
  let readToKey = userId;

  if (String(conversation.userId) !== String(userId)) {
    readToKey = "admin";
  }

  return readToKey;
}
