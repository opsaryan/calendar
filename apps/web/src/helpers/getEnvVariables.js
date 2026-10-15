export const getEnvVariables = () => {
  // Load the environment variables
  const variables = import.meta.env;

  return {
    ...variables,
  };
};
