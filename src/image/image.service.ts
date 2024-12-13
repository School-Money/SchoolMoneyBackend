import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { v2 as cloudinaryV2, UploadApiResponse } from 'cloudinary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child } from 'src/schemas/Child.schema';
import { Parent } from 'src/schemas/Parent.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { PassThrough } from 'stream';
import * as https from 'https';

@Injectable()
export class ImageService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof cloudinaryV2,
    @InjectModel('Child') private readonly childModel: Model<Child>,
    @InjectModel('Parent') private readonly parentModel: Model<Parent>,
    @InjectModel('Collection') private readonly collectionModel: Model<Collection>,
  ) {}

    private getModel(entity: string): Model<any> {
        switch (entity) {
            case 'child':
                return this.childModel;
            case 'parent':
                return this.parentModel;
            case 'collection':
                return this.collectionModel;
            default:
                throw new NotFoundException(`Entity "${entity}" not found.`);
        }
    }

    private hasPermissions(document: any, entity: string, parentId: string): boolean {
        if (entity === 'child') {
            return document.parent.toString() === parentId;
        }

        if (entity === 'parent') {
            return document._id.toString() === parentId;
        }

        if (entity === 'collection') {
            return document.creator.toString() === parentId;
        }

        return false
    }

    async uploadImage(entity: string, id: string, file: Express.Multer.File, parentId: string): Promise<string> {
        try {
            const model = this.getModel(entity);
            const document = await model.findById(id);

            if (!document) {
                throw new NotFoundException(`${entity} with id ${id} not found.`);
            } else if (!this.hasPermissions(document, entity, parentId)) {
                throw new BadRequestException(`You do not have permission to upload an image.`);
            }

            const fileExtension = file.mimetype.split('/')[1];
            const filename = file.originalname.split('.')[0];
            const publicId = `${entity}-${id}-${filename}`;

            const result: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                {
                    folder: 'uploads',
                    public_id: publicId,
                    format: fileExtension,
                },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    },
                );
                const bufferStream = new PassThrough();
                bufferStream.end(file.buffer);
                bufferStream.pipe(uploadStream);
            });

            const updatedField = entity === 'collection' ? 'logo' : 'avatar';
            document[updatedField] = result.secure_url;
            await document.save();

            return document[updatedField];
        } catch (error) {
            console.error(error); // Debugging: Log any errors
            throw new BadRequestException(`Image upload failed: ${error.message}`);
        }
    }


    async getImage(
        entity: string,
        id: string,
        parentId: string,
    ): Promise<{ stream: PassThrough; contentType: string }> {
        try {
            const model = this.getModel(entity);
            const document = await model.findById(id);

            if (!document) {
                throw new NotFoundException(`${entity} with id ${id} not found.`);
            } else if (!this.hasPermissions(document, entity, parentId)) {
                throw new BadRequestException(`You do not have permission to view this image.`);
            }

            const field = entity === 'collection' ? 'logo' : 'avatar';
            const imageUrl = document[field];

            if (!imageUrl) {
                throw new NotFoundException(`Image for ${entity} with id ${id} not found.`);
            }

            const stream = new PassThrough();

            return new Promise((resolve, reject) => {
                https.get(imageUrl, (response) => {
                    if (response.statusCode !== 200) {
                    reject(new NotFoundException(`Could not retrieve image from Cloudinary.`));
                    return;
                    }

                    const contentType = response.headers['content-type'] || 'image/jpeg';
                    response.pipe(stream);

                    resolve({ stream, contentType });
                });
            });   
        } catch (error) {
            console.log(error);
            throw new BadRequestException(`You do not have permission to view this image.`);
        }
    }
}
