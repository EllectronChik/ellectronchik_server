import { Injectable, NestMiddleware } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as mime from 'mime-types';
import { Request, Response } from 'express';

@Injectable()
export class ImageProcessingMiddleware implements NestMiddleware {
  use(req: Request, res: Response) {
    // Дешифрование изображения в ответе
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'static',
      req.params['0'],
    );
    const iv = req.query.iv as string;
    let secret: string;
    try {
      secret = req.cookies.key;
      if (!secret || secret.length !== 32) {
        throw new Error();
      }
    } catch (e) {
      return res.status(400).send('Invalid request');
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    if (!iv) {
      return res.status(400).send('Invalid request');
    }

    const fileBuffer = fs.readFileSync(filePath);

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      secret,
      Buffer.from(iv, 'hex'),
    );

    let decrypted: Buffer;
    try {
      decrypted = Buffer.concat([
        decipher.update(fileBuffer),
        decipher.final(),
      ]);
    } catch (e) {
      return res.status(500).send('Error decrypting file');
    }

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.send(decrypted);
  }
}
