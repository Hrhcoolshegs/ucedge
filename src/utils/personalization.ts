import type { Customer } from '@/types';

export interface PersonalizationContext {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  balance?: number;
  accountBalance?: string;
  lifetimeValue?: string;
  location?: string;
  product?: string;
  offer?: string;
  [key: string]: string | number | undefined;
}

export class PersonalizationEngine {
  static render(
    template: string,
    context: PersonalizationContext
  ): string {
    if (!template) return '';

    let result = template;

    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = template.match(variableRegex);

    if (!matches) return template;

    matches.forEach((match) => {
      const variableName = match.replace(/\{\{|\}\}/g, '').trim();
      const value = context[variableName];

      if (value !== undefined && value !== null) {
        result = result.replace(match, String(value));
      }
    });

    return result;
  }

  static extractVariables(template: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = template.match(variableRegex);

    if (!matches) return [];

    return matches.map((match) =>
      match.replace(/\{\{|\}\}/g, '').trim()
    );
  }

  static createCustomerContext(
    customer: Customer,
    additionalData?: Record<string, any>
  ): PersonalizationContext {
    const nameParts = customer.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return {
      name: customer.name,
      firstName,
      lastName,
      email: customer.email,
      phone: customer.phone,
      balance: customer.accountBalance,
      accountBalance: `₦${customer.accountBalance.toLocaleString()}`,
      lifetimeValue: `₦${customer.lifetimeValue.toLocaleString()}`,
      location: customer.location,
      ...additionalData,
    };
  }

  static validateTemplate(template: string): {
    isValid: boolean;
    errors: string[];
    variables: string[];
  } {
    const errors: string[] = [];
    const variables = this.extractVariables(template);

    variables.forEach((variable) => {
      if (variable.includes(' ')) {
        errors.push(`Variable "${variable}" contains spaces`);
      }
      if (variable.length === 0) {
        errors.push('Empty variable name found');
      }
    });

    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('Mismatched braces in template');
    }

    return {
      isValid: errors.length === 0,
      errors,
      variables,
    };
  }

  static getAvailableVariables(): Array<{
    name: string;
    description: string;
    example: string;
  }> {
    return [
      { name: 'name', description: 'Full customer name', example: 'Adewale Ogunleye' },
      { name: 'firstName', description: 'First name only', example: 'Adewale' },
      { name: 'lastName', description: 'Last name only', example: 'Ogunleye' },
      { name: 'email', description: 'Email address', example: 'customer@example.com' },
      { name: 'phone', description: 'Phone number', example: '+234 803 123 4567' },
      { name: 'balance', description: 'Account balance (number)', example: '150000' },
      { name: 'accountBalance', description: 'Formatted account balance', example: '₦150,000' },
      { name: 'lifetimeValue', description: 'Formatted lifetime value', example: '₦5,000,000' },
      { name: 'location', description: 'Customer location', example: 'Lagos, Nigeria' },
      { name: 'product', description: 'Product name', example: 'Investment Plan' },
      { name: 'offer', description: 'Offer details', example: '0% fees for 3 months' },
    ];
  }
}
