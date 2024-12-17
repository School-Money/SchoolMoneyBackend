import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChildCreate, ChildUpdate } from 'src/interfaces/child.interface';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ChildService {
    private readonly avatarUrl: string = 
        `https://res.cloudinary.com/${this.configService.get<string>('CLOUDINARY_CLOUD_NAME')}/image/upload/v1734099384/default-avatar.jpg`;

    constructor(
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        private readonly configService: ConfigService,
    ) {}

    async create(childCreate: ChildCreate) {
        try {
            const parent = await this.parentModel.findById(childCreate.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const classDoc = await this.classModel.findById(childCreate.inviteCode);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }
            return await this.childModel.create({
                ...childCreate,
                birthDate: new Date(childCreate.birthDate * 1000),
                parent: parent._id,
                class: classDoc._id,
                avatar: this.avatarUrl,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to create child: ${error.message}`);
        }
    }

    async update(childUpdate: ChildUpdate) {
        try {
            const parent = await this.parentModel.findById(childUpdate.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const classDoc = await this.classModel.findById(childUpdate.classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }
            const child = await this.childModel.findById(childUpdate.childId);
            if (!child) {
                throw new NotFoundException('Child not found');
            } else if (child.parent.toString() !== parent._id.toString()) {
                throw new BadRequestException('Cannot update child of another parent');
            }

            if (child.class.toString() !== childUpdate.classId) {
                const oldClass = await this.classModel.findById(child.class);
                const parentChildrenInOldClass = await this.childModel.find({
                    parent: parent._id,
                    class: child.class,
                });

                if (!oldClass) {
                    throw new NotFoundException('Old class not found');
                } else if (
                    parent._id.toString() === oldClass.treasurer.toString() &&
                    !parentChildrenInOldClass.some((child) => child._id.toString() !== childUpdate.childId)
                ) {
                    throw new BadRequestException('Cannot change class of only child in class of treasurer parent');
                }
            }

            return await this.childModel.findByIdAndUpdate(childUpdate.childId, {
                ...childUpdate,
                parent: parent._id,
                class: classDoc._id,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update child: ${error.message}`);
        }
    }

    async get(parentId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            return await this.childModel.find({ parent: parent._id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get children: ${error.message}`);
        }
    }

    async delete(childDetails: { childId: string; parentId: string }) {
        try {
            const parent = await this.parentModel.findById(childDetails.parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const child = await this.childModel.findById(childDetails.childId);
            if (!child) {
                throw new NotFoundException('Child not found');
            } else if (child.parent.toString() !== parent._id.toString()) {
                throw new BadRequestException('Cannot delete child of another parent');
            }

            const childClass = await this.classModel.findById(child.class);
            const parentChildrenInClass = await this.childModel.find({
                parent: parent._id,
                class: child.class,
            });

            if (!childClass) {
                throw new NotFoundException('Class not found');
            } else if (
                parent._id.toString() === childClass.treasurer.toString() &&
                !parentChildrenInClass.some((child) => child._id.toString() !== childDetails.childId)
            ) {
                throw new BadRequestException('Cannot delete only child in class of treasurer parent');
            }

            return await this.childModel.findByIdAndDelete(childDetails.childId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to delete child: ${error.message}`);
        }
    }
}
