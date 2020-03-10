const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class ContactPageController {
  render(req, res) {
    connector.createQuery(
      `SELECT category_id, category_name
         FROM categories;
            SELECT producer_id, producer_name
            FROM producers`,
      (err, rows) => {
        const [navCategories, navProducers] = rows;
        res.render('shop/contact', {
          title: 'Strona kontaktu',
          stylesheets: [
            'contact',
            'contact_responsive',
          ],
          script: 'contact',
          navCategories,
          navProducers,
        });
      },
    );
  }
}

module.exports = ContactPageController;
