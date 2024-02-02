module.exports = function verify(cfg) {
  this.logger.info('The credentials always verifies successfully');
  return { verified: true };
};
