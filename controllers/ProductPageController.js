const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class ProductPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT * FROM catalog as cat
    INNER JOIN categories_producers ON cat.product_id = categories_producers.product_id
    WHERE cat.product_id LIKE ${req.params.id};
    SELECT * FROM categories_producers as cp
    INNER JOIN categories as cat ON cp.category_id = cat.category_id
    WHERE product_id = ${req.params.id};
    SELECT * FROM pictures as pic
    INNER JOIN catalog as cat ON cat.product_id = pic.product_id
    WHERE pic.product_id = ${req.params.id};
    SELECT * FROM catalog as cat
    INNER JOIN pictures as pic ON cat.product_id = pic.product_id
    WHERE pic.label = '1'
    LIMIT 4;
    SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers`,
      (err, rows) => {
        const [product, category, images, relatedProducts, navCategories, navProducers] = rows;
        if (err) throw new Error(err);
        res.render('shop/product', {
          title: 'Strona produktu',
          stylesheets: [
            'product',
            'product_responsive',
          ],
          script: 'product',
          product,
          category,
          images,
          relatedProducts,
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = ProductPageController;
