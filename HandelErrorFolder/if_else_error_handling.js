// >>  TRY CATH LIKHNE KA BEST TARIKA.
const customerror = (func) => {
  return function(req, res, next) {
    func(req, res, next).catch(next);
  }
}

module.exports = customerror;


