const passport = require('passport');

const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class AccountSignInPageController {
  authenticate() {
    passport.authenticate('local', {
      successRedirect: '/account-edit-data',
      failureRedirect: '/account-sign-in',
    });
  }

  render(req, res) {
    connector.createQuery(`
    SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers`,
    (err, rows) => {
      const [navCategories, navProducers] = rows;
      if (err) throw new Error(err);
      res.render('user/signin', {
        title: 'Strona logowania',
        stylesheets: [
          'contact',
          'contact_responsive',
          'signup',
        ],
        script: 'custom',
        navCategories,
        navProducers,
      });
    });
  }
}

module.exports = AccountSignInPageController;
