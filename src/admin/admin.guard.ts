import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ParentService } from "src/parent/parent.service";
import { Admin } from "src/schemas/Admin.schema";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly parentService: ParentService,
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        const parent = await this.parentService.getUserInfo(user.id);
        if (!parent) { 
            return false;
        }
    
        return !!(await this.adminModel.exists({ parent: Types.ObjectId.createFromHexString(user.id) }));
    }
}