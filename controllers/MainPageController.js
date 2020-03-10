const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class MainPageController {
  render(req, res) {
    console.log('req.user', req.user);
    console.log('req.user isAuthenticated', req.isAuthenticated());

    connector.createQuery(
      `SELECT * FROM catalog as cat
             INNER JOIN pictures as pic ON cat.product_id = pic.product_id
             WHERE pic.label = '1'
             LIMIT 8;
              SELECT category_id, category_name
              FROM categories;
              SELECT producer_id, producer_name
              FROM producers`,
      (err, rows) => {
        const [relatedProducts, navCategories, navProducers] = rows;
        console.log('relatedProducts', relatedProducts);
        res.render('shop/main', {
          title: 'Strona glowna',
          stylesheets: [
            'main_styles',
            'responsive',
          ],
          script: 'custom',
          relatedProducts,
          navCategories,
          navProducers,
        });
        if (err) throw new Error(err);
      },
    );
  }
}

module.exports = MainPageController;
