module.exports = async function verify(cfg) {
  if (!cfg) return { verified: true };
  this.logger.info('The credentials always verifies successfully');
  return { verified: true };
};
