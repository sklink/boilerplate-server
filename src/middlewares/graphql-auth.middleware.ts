import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { IContext } from "../loaders/graphql";

export class AuthChecker implements AuthCheckerInterface<IContext> {
  constructor() {}

  check({ root, args, context, info }: ResolverData<IContext>, roles: string[]) {
    return context.member && context.member.roles.some((role) => roles.includes(role));
  }
}
