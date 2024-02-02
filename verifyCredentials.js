module.exports = async function verify(credentials) {
  this.logger.info('The credentials always verifies successfully');
  return { verified: true };
};
