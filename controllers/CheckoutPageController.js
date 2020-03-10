const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class CheckoutPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT category_id, category_name
         FROM categories;
            SELECT producer_id, producer_name
            FROM producers`,
      (err, rows) => {
        const [navCategories, navProducers] = rows;
        res.render('shop/checkout', {
          title: 'Strona podsumowania koszyka',
          stylesheets: [
            'checkout',
            'checkout_responsive',
          ],
          script: 'checkout',
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = CheckoutPageController;
