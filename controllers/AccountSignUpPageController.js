const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

const saltRounds = 10;

const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();


class AccountSignUpPageController {
  signUp(req, res) {
    const { errors } = validationResult(req);
    if (errors.length) {
      res.render('user/signup', {
        title: 'Strona rejestracji',
        stylesheets: [
          'contact',
          'contact_responsive',
          'signup',
        ],
        script: 'custom',
        errors,
      });
    } else {
      const { username } = req.body;
      const { email } = req.body;
      const { password } = req.body;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        connector.createQuery(
          `INSERT INTO users (user_id, username, email, password, role)
        VALUES (NULL, ?, ?, ?, 1)`,
          [username, email, hash],
          (error) => {
            if (error) {
              console.log(error);
              res.render('user/signup', {
                title: 'Strona rejestracji',
                stylesheets: [
                  'contact',
                  'contact_responsive',
                  'signup',
                ],
                script: 'custom',
                errors: error,
              });
            }
            connector.createQuery(
              'SELECT LAST_INSERT_ID() as user_id',
              (error, results) => {
                if (error) {
                  console.log(error);
                  res.render('user/signup', {
                    title: 'Strona rejestracji',
                    stylesheets: [
                      'contact',
                      'contact_responsive',
                      'signup',
                    ],
                    script: 'custom',
                    errors: error,
                  });
                }
                console.log(results[0]);
                const userId = results[0];
                req.login(userId, (err) => {
                  if (err) {
                    console.log(err);
                    res.render('user/signup', {
                      title: 'Strona rejestracji',
                      stylesheets: [
                        'contact',
                        'contact_responsive',
                        'signup',
                      ],
                      script: 'custom',
                      errors: err,
                    });
                  }
                  res.redirect('/');
                });
              },
            );
          },
        );
      });
    }
  }

  render(req, res) {
    connector.createQuery(`
    SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers`,
    (err, rows) => {
      const [navCategories, navProducers] = rows;
      if (err) throw new Error(err);
      res.render('user/signup', {
        title: 'Strona rejestracji',
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

module.exports = AccountSignUpPageController;
