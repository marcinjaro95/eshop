const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class CategoryPageController {
  render(req, res) {
    connector.createQuery(`SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers;
    SELECT * FROM categories_producers as cp
    INNER JOIN catalog as cat ON cp.product_id = cat.product_id
    INNER JOIN pictures as pic ON cp.product_id = pic.product_id
    INNER JOIN categories as c ON cp.category_id = c.category_id
    WHERE cp.category_id = ${req.params.id} AND pic.label = '1'`, (err, rows) => {
      if (err) throw err;
      const [navCategories, navProducers, products] = rows;
      console.log('products', products);
      res.render('shop/category', {
        title: 'Strona kategorii',
        stylesheets: [
          'categories',
          'categories_responsive',
        ],
        script: 'categories',
        products,
        categoryName: catName && catName.category_name,
        navCategories,
        navProducers,
      });
    });
  }
}

module.exports = CategoryPageController;
