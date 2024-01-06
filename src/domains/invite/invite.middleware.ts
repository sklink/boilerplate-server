import { AuthCheckerInterface, MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { IContext } from "../../loaders/graphql";

export class HasRoles implements AuthCheckerInterface<IContext> {
  constructor() {}

  check({ root, args, context, info }: ResolverData<IContext>, roles: string[]) {
    return context.member && context.member.roles.some((role) => roles.includes(role));
  }
}
