import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassCreate, PassTreasurerToParentParams } from 'src/interfaces/class.interface';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent } from 'src/schemas/Parent.schema';

@Injectable()
export class ClassService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<Class>,
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
        @InjectModel(Child.name) private readonly childModel: Model<Child>,
        @InjectModel(Collection.name) private readonly collectionModel: Model<Collection>,
    ) {}

    async create(classInfo: ClassCreate) {
        try {
            const treasurer = await this.parentModel.findById(classInfo.treasurerId);
            if (!treasurer) {
                throw new NotFoundException('Treasurer not found');
            }
            return await this.classModel.create({ ...classInfo, treasurer: treasurer._id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to create class: ${error.message}`);
        }
    }

    async get(parentId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            
            const myChildren = await this.childModel.find({ parent: parent._id });
            let myClasses = await this.classModel.find({
                _id: { $in: myChildren.map((child) => child.class) },
            });

            const treasuredClasses = await this.classModel.find({ treasurer: parent._id });
            myClasses.push(...treasuredClasses);

            myClasses = myClasses.filter((classDoc, index, self) => {
                return index === self.findIndex((t) => t._id.toHexString() === classDoc._id.toHexString());
            });

            const childrenInMyClasses = await this.childModel.find({
                class: { $in: myClasses.map((classDoc) => classDoc._id) },
            });

            return myClasses.map((classDoc) => {
                const children = childrenInMyClasses.filter(
                    (child) => child.class.toHexString() === classDoc._id.toHexString(),
                );
                const isTreasurer = classDoc.treasurer.toHexString() === parentId;
                return { ...classDoc.toObject(), childrenAmount: children.length, isTreasurer };
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get classes: ${error.message}`);
        }
    }

    async getInviteCode(treasurerId: string, classId: string) {
        try {
            const treasurer = await this.parentModel.findById(treasurerId);
            if (!treasurer) {
                throw new NotFoundException('Treasurer not found');
            }
            const classDoc = await this.classModel.findById(classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }
            const classDocWithTreasurer = await this.classModel.findOne({
                treasurer: treasurer._id,
                _id: classDoc._id,
            });
            if (!classDocWithTreasurer) {
                throw new ForbiddenException('You are not the treasurer of this class');
            }
            return { inviteCode: classDocWithTreasurer._id };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to get invite code: ${error.message}`);
        }
    }

    async passTreasurerToParent(passTreasurerToParentParams: PassTreasurerToParentParams): Promise<Class> {
        try {
            const { currentTreasurerId, newTreasurerId, classId } = passTreasurerToParentParams;

            const currentTreasurer = await this.parentModel.findById(currentTreasurerId);
            const newTreasurer = await this.parentModel.findById(newTreasurerId);
            const classDoc = await this.classModel.findById(classId);

            if (!currentTreasurer || !newTreasurer || !classDoc) {
                throw new NotFoundException('One of the related entities not found');
            } else if (currentTreasurer._id.toString() !== classDoc.treasurer.toString()) {
                throw new UnauthorizedException('You are not the treasurer of this class');
            } else if (newTreasurer._id.toString() === currentTreasurer._id.toString()) {
                return classDoc;
            }

            const newTreasurerChildren = await this.childModel.find({ parent: newTreasurer._id });
            if (!newTreasurerChildren.length) {
                throw new NotFoundException('New treasurer has no children');
            } else if (
                !newTreasurerChildren.some((child) => child.class.toHexString() === classDoc._id.toHexString())
            ) {
                throw new UnauthorizedException('New treasurer has no children in this class');
            }

            const updatedClassDoc = await this.classModel.findByIdAndUpdate(
                classId,
                { treasurer: newTreasurer._id },
                { new: true },
            );
            return updatedClassDoc;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Database operation failed: ${error.message}`);
        }
    }

    async isParentInClass(parentId: string, classId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }
            const classDoc = await this.classModel.findById(classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }
            const isTreasurer = classDoc.treasurer.toHexString() === parentId;
            const children = await this.childModel.find({ parent: parent._id, class: classDoc._id });
            return !!children.length || isTreasurer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to check access to class: ${error.message}`);
        }
    }

    async getClassDetails(parentId: string, classId: string) {
        try {
            const parent = await this.parentModel.findById(parentId);
            if (!parent) {
                throw new NotFoundException('Parent not found');
            }

            const classDoc = await this.classModel.findById(classId);
            if (!classDoc) {
                throw new NotFoundException('Class not found');
            }

            const childrenInClass = await this.childModel.find({ class: classDoc._id });
            if (!childrenInClass.length) {
                throw new NotFoundException('No children found in this class');
            }

            const treasurerData = await this.parentModel.findById(classDoc.treasurer);
            if (!treasurerData) {
                throw new NotFoundException('TreasurerData not found');
            }

            const classCollections = await this.collectionModel.find({ class: classDoc._id });

            const { lastName, firstName, avatar } = treasurerData.toObject();
            const treasurer = { lastName, firstName, avatar };

            return {
                className: classDoc.name,
                children: childrenInClass.map((child) => {
                    const { firstName, lastName, avatar } = child;
                    return { firstName, lastName, avatar };
                }),
                treasurer: treasurer,
                collections: classCollections.map((collection) => {
                    const { title, description, logo, startDate, endDate, targetAmount } = collection;
                    return { title, description, logo, startDate, endDate, targetAmount };
                }),
                isTreasurer: classDoc.treasurer.toHexString() === parentId,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(`Could not reach database: ${error.message}`);
        }
    }
}
