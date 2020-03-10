const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class AboutPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT category_id, category_name FROM categories;
      SELECT producer_id, producer_name FROM producers`,
      (err, rows) => {
        const [navCategories, navProducers] = rows;
        res.render('shop/about', {
          title: 'O nas',
          stylesheets: [
            'contact',
            'contact_responsive',
          ],
          script: '',
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = AboutPageController;
