import { createHash as cryptoCreateHash } from 'crypto';

export function createHash(input: {
  customerName: string;
  description: string;
}): string {
  const normalizedCustomer = input.customerName
    .trim()
    .toLowerCase();

  const normalizedDescription = input.description
    .trim()
    .toLowerCase();

  const rawString = `${normalizedCustomer}:${normalizedDescription}`;

  return cryptoCreateHash('sha256')
    .update(rawString)
    .digest('hex');
}