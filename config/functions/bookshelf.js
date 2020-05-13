/*
 * This is a bit ugly but the only way we can customize
 * the admin model before strapi's boot process syncs the
 * database. There is no way to overwrite the admin plugin
 * like it's possible with the regular plugins. Also, regular
 * bootstrap functions run too late, i.e. after database
 * initialization.
 */

module.exports = () => {
  strapi.admin.models.administrator.attributes.role = {
    "type": "enumeration",
    "enum": [
      "admin",
      "manager"
    ]
  }
  strapi.plugins.admin.models = strapi.admin.models
}
