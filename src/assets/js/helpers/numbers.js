export const isInt = value => Number(value) === value && value % 1 === 0;

export const isFloat = value => Number(value) === value && value % 1 !== 0;
