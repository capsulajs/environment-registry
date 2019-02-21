export const isEnvKeyValid = (request: any) => request && request.envKey && typeof request.envKey === 'string';

export const isEnvValid = (request: any) => {
  return request && request.env && request.env.accessPoints && request.env.accessPoints[0];
};

export const validationMessages = {
  envKeyIsNotCorrect: 'envKey was not provided or is not a string',
  envIsNotCorrect: "env was not provided or doesn't match this pattern: { accessPoints: { url: string }[] }",
};
