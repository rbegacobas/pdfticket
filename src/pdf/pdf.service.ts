import { Injectable , Logger} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
    private readonly logger = new Logger(PdfService.name);
  async createPdf(data: any): Promise<Buffer> {
    //const templatePath = this.getTemplatePath(data.country);

    this.logger.log("MI RAMON: "+__dirname);
    //const templatePath = path.join(__dirname, '..', 'src', 'pdf', 'templates', `${data.country}.html`);
    const templatePath = path.join(__dirname, 'templates', `${data.country}.html`);


    let templateContent = fs.readFileSync(templatePath, 'utf8');

    // Convertir fechas
    const entrada = this.convertDate(data.entryDate);
    const salida = this.convertDate(data.exitDate);
 // Calcular cantidad de noches
 const noches = this.calculateNights(data.entryDate, data.exitDate);

 // Generar un número aleatorio de 4 dígitos
 const randomNumber = Math.floor(1000 + Math.random() * 9000);
 templateContent = templateContent.replace('{{randomNumber}}', randomNumber.toString());


     // Reemplazar los campos en la plantilla
     templateContent = templateContent.replace('{{name}}', data.name);
     templateContent = templateContent.replace('{{dayEntrada}}', entrada.day);
     templateContent = templateContent.replace('{{Entrada}}', entrada.day+" "+entrada.month.toLowerCase()+" "+entrada.year);
     templateContent = templateContent.replace('{{Penalty}}', (entrada.day)+" "+entrada.month.toLowerCase()+" "+entrada.year);
     templateContent = templateContent.replace('{{monthEntrada}}', entrada.month);
     templateContent = templateContent.replace('{{yearEntrada}}', entrada.year);
     templateContent = templateContent.replace('{{weekdayEntrada}}', entrada.weekday);
     templateContent = templateContent.replace('{{daySalida}}', salida.day);
     templateContent = templateContent.replace('{{monthSalida}}', salida.month);
     templateContent = templateContent.replace('{{yearSalida}}', salida.year);
     templateContent = templateContent.replace('{{weekdaySalida}}', salida.weekday);
     templateContent = templateContent.replace('{{noches}}', noches.toString());


     this.logger.log('nombre: '+data.name);
     


    // Convertir HTML a PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(templateContent);
    const pdfUint8Array = await page.pdf();
    await browser.close();

    // Convertir Uint8Array a Buffer
    const pdfBuffer = Buffer.from(pdfUint8Array);

    return pdfBuffer;
  }

  private convertDate(dateString: string): { day: string, month: string, year: string, weekday: string } {
    const weekdays = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Crear la fecha asegurando que no haya problemas de zona horaria
    const dateParts = dateString.split('-'); // Dividimos el string de la fecha
    const date = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2]));
  
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = months[date.getUTCMonth()].toUpperCase();
    const year = date.getUTCFullYear().toString();
    const weekday = weekdays[date.getUTCDay()];
  
    return {
      day: day,
      month: month,
      year: year,
      weekday: weekday
    };
  }

  private calculateNights(entryDate: string, exitDate: string): number {
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    
    const timeDifference = exit.getTime() - entry.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    // La cantidad de noches es el número de días menos uno
    return Math.max(0, Math.floor(daysDifference));
  }


  private getTemplatePath(country: string): string {
    this.logger.log("MI RAMON: "+path.join('src', 'pdf', 'templates', 'GEO1.html'));
    
    
    switch (country.toUpperCase()) {

       
        
      case 'GEO':
        return path.join(__dirname, '..', 'src', 'pdf', 'templates', 'GEO.html');
      case 'MGA':
        return path.join(__dirname, '..', 'src', 'pdf', 'templates', 'MGA.html');
      case 'PBM':
        return path.join(__dirname, '..', 'src', 'pdf', 'templates', 'PBM.html');
      default:
        throw new Error('Invalid country');
    }
  }
}
