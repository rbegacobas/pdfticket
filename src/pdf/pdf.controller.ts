//import { Controller } from '@nestjs/common';

import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() data: any, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.createPdf(data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=output.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

}
