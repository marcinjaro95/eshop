const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class CartPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT category_id, category_name
         FROM categories;
            SELECT producer_id, producer_name
            FROM producers`,
      (err, rows) => {
        const [navCategories, navProducers] = rows;
        res.render('shop/cart', {
          title: 'Strona koszyka',
          stylesheets: [
            'cart',
            'cart_responsive',
          ],
          script: 'cart',
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = CartPageController;
