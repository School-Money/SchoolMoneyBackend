import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as https from 'https';
import { PassThrough } from 'stream';

@Controller('default-images')
export class DefaultImageController {
  constructor(private readonly configService: ConfigService) {}

  private async fetchImage(url: string, res: Response) {
    if (!url) {
      res.status(404).send('Image URL not found.');
      return;
    }

    const stream = new PassThrough();

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        res.status(404).send('Image not found.');
        return;
      }

      res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      response.pipe(stream).pipe(res);
    });
  }

  @Get('avatar')
  async getDefaultAvatar(@Res() res: Response) {
    const defaultAvatar = this.configService.get<string>('DEFAULT_AVATAR');
    await this.fetchImage(defaultAvatar, res);
  }

  @Get('logo')
  async getDefaultLogo(@Res() res: Response) {
    const defaultLogo = this.configService.get<string>('DEFAULT_LOGO');
    await this.fetchImage(defaultLogo, res);
  }
}
