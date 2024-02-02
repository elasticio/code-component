module.exports = async function verify() {
  this.logger.info('The credentials always verifies successfully');
  return { verified: true };
};
