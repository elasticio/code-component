module.exports = async function verify(credentials) {
  console.log(1);
  this.logger.info('The credentials always verifies successfully');
  return true;
};
