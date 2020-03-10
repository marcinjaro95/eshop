const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class ProducerPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers;
    SELECT * FROM categories_producers as cp
    INNER JOIN catalog as cat ON cp.product_id = cat.product_id
    INNER JOIN pictures as pic ON cp.product_id = pic.product_id
    INNER JOIN producers as prod ON cp.producer_id = prod.producer_id
    WHERE cp.producer_id = ${req.params.id} AND pic.label = '1'`,
      (err, rows) => {
        const [navCategories, navProducers, products] = rows;
        if (err) throw err;
        res.render('shop/category', {
          title: 'Strona kategorii',
          stylesheets: [
            'categories',
            'categories_responsive',
          ],
          script: 'categories',
          products,
          categoryName: products && products.producer_name,
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = ProducerPageController;
