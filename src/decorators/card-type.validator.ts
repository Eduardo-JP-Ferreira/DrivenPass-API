import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidCardType', async: false })
export class IsValidCardType implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const validTypes = ['CREDIT', 'DEBIT', 'BOTH'];
    return validTypes.includes(value.toUpperCase());
  }

  defaultMessage(args: ValidationArguments) {
    return 'O campo type deve ser CREDIT, DEBIT ou BOTH';
  }
}
