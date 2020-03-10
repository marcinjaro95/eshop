const DatabaseModel = require('../model/DatabaseModel');

const connector = new DatabaseModel();

class EditAccountDataPageController {
  render(req, res) {
    connector.createQuery(`
    SELECT category_id, category_name FROM categories;
    SELECT producer_id, producer_name FROM producers`,
    (err, rows) => {
      const [navCategories, navProducers] = rows;
      if (err) throw new Error(err);
      res.render('user/editAddressData', {
        title: 'Strona edycji danych korespondencyjnych',
        stylesheets: [
          'contact',
          'contact_responsive',
          'profile',
        ],
        script: 'custom',
        navCategories,
        navProducers,
      });
    });
  }
}

module.exports = EditAccountDataPageController;
