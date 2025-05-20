import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../models";

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
    if(context.getType() === 'http'){
        return context.switchToHttp().getRequest().user;
    }
    const user = context.getArgs()[2]?.req.headers?.user;
    if (user) {
        return JSON.parse(user);
    }
    throw new Error('User not found in context');
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)