import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Constructor for JwtStrategy
     * @param configService - ConfigService to get JWT secret
     * @param usersService - UsersService to get user information
     */
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        const jwt = configService.get('JWT_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => request?.cookies?.Authentication || request?.Authentication
            ]),
            secretOrKey: jwt,
        });
    }

    async validate({ userId }: TokenPayload) {
        const user = await this.usersService.getUser({ id: userId.toString() });
        if (!user) {
            return null;
        }
        return user;
    }
}