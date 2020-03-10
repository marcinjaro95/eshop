const express = require('express');

const router = express.Router();

const { check } = require('express-validator');

const AboutPageController = require('../controllers/AboutPageController');

const CategoryPageController = require('../controllers/CategoryPageController');

const CartPageController = require('../controllers/CartPageController');

const ProducerPageController = require('../controllers/ProducerPageController');

const CheckoutPageController = require('../controllers/CheckoutPageController');

const ContactPageController = require('../controllers/ContactPageController');

const MainPageController = require('../controllers/MainPageController');

const ProductPageController = require('../controllers/ProductPageController');

const EditAccountDataPageController = require('../controllers/AccountEditDataPageController');

const EditAccountAddressDataPageController = require('../controllers/AccountEditAddressDataPageController');

const AccountOrderHistoryPageController = require('../controllers/AccountOrderHistoryPageController');

const AccountSignInPageController = require('../controllers/AccountSignInPageController');

const AccountSignUpPageController = require('../controllers/AccountSignUpPageController');

const authenticationMiddleware = function auth() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/sign-in');
  };
};

const aboutPage = new AboutPageController();
const cartPage = new CartPageController();
const categoryPage = new CategoryPageController();
const producerPage = new ProducerPageController();
const checkoutPage = new CheckoutPageController();
const contactPage = new ContactPageController();
const mainPage = new MainPageController();
const productPage = new ProductPageController();
const editAccountDataPage = new EditAccountDataPageController();
const editAccountAddressDataPage = new EditAccountAddressDataPageController();
const accountOrderHistoryPage = new AccountOrderHistoryPageController();
const accountSignInPage = new AccountSignInPageController();
const accountSignUpPage = new AccountSignUpPageController();

router.get('/about', aboutPage.render);
router.get('/cart', cartPage.render);
router.get('/category-c-:id', categoryPage.render);
router.get('/category-c-:id', categoryPage.render);
router.get('/category-p-:id', producerPage.render);
router.get('/checkout', checkoutPage.render);
router.get('/contact', contactPage.render);
router.get('/', mainPage.render);
router.get('/product-p-:id', productPage.render);
router.get('/edit-account-data', authenticationMiddleware(), editAccountDataPage.render);
router.get('/edit-account-address-data', authenticationMiddleware(), editAccountAddressDataPage.render);
router.get('/account-order-history', authenticationMiddleware(), accountOrderHistoryPage.render);
router.get('/account-sign-in', accountSignInPage.render);
router.post('/account-sign-in', accountSignInPage.authenticate);
router.get('/account-sign-up', accountSignUpPage.render);
router.post('/account-sign-up', [
  check('password', 'Wpisz hasło').not().isEmpty(),
  check('username', 'Login nie może być pusty.').not().isEmpty(),
  check('username', 'Login musi mieć od 4 do 45 znaków.').isLength({ min: 4, max: 45 }),
  check('email', 'Twój adres email jest niepoprawny.').isEmail(),
  check('email', 'Adres email musi mieć od 4 do 100 znaków.').isLength({ min: 4, max: 100 }),
  check('password', 'Hasło musi mieć od 4 do 45 znaków').isLength({ min: 4, max: 45 }),
  check('password', 'Hasło musi zawierać co najmniej jedną małą literę, jedną dużą, cyfrę oraz znak specialny.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('passwordMatch', 'Hasło musi mieć od 4 do 45 znaków').isLength({ min: 4, max: 45 })],
accountSignUpPage.signUp);

router.get('/account-logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
