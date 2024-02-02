module.exports = async function verifyCredentials(credentials) {
  this.logger.info('The credentials always verifies successfully');
  return { verified: true };
};
