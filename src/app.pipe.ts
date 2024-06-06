import { Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { createHash } from 'crypto';
import { MinLengthVarChar } from './users/dto/constants';

// Antes de validar, os dados serão tratados.
// Talvez essas operações devem ser feitas no front-end,
// mas para mais segurança e confiabilidade, cá está também.
@Injectable()
export class AppPipeTransform implements PipeTransform {
  transform(data: Record<string, any>) {
    const sanitizedData: Record<string, any> = {};

    // Não será muito custoso.
    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'password') {
          sanitizedData[key] = this.passwordHash(value);
        } else {
          sanitizedData[key] = this.sanitizeValue(value);
        }
      });

      return sanitizedData;
    }

    return data;
  }

  private sanitizeValue(value: string): string {
    if (typeof value === 'string') {
      // Removerá espaço em branco desnecessários.
      // Para comentários e posts, talvez não devesse ser aplicado.
      value = value.replace(/\s{2,}(?![\d\s]*$)/g, ' ').trim();

      // Os E-mails devem ser armazenados em minúsculos.
      // Facilitará a validação e a padronização no BD.
      if (isEmail(value)) {
        value = value.toLowerCase();
      }
    }

    return value;
  }

  // Encriptação para a senha.
  private passwordHash(password: string) {
    const { MIN_PASSWORD } = MinLengthVarChar;

    if (password.length < MIN_PASSWORD) return undefined;

    return createHash('sha256')
      .update(password + process.env.JWT_SECRET)
      .digest('hex');
  }
}
