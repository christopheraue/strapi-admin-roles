/*
 * Custom controllers to filter the admin relation from content types
 * for non-root admins
 */

module.exports = {
  async findcontenttype(ctx) {
    await strapi.plugins['content-manager'].controllers.contenttypes.findContentType(ctx)
    const contentType = ctx.body.data.contentType
    const adminAttr = adminAttribute(contentType.uid)
    delete contentType.schema.attributes[adminAttr]
    delete contentType.metadatas[adminAttr]
    contentType.layouts.editRelations = contentType.layouts.editRelations.filter(rel => rel !== adminAttr)
  }
}

function adminAttribute(model) {
  const attributes = strapi.db.getModel(model).attributes
  return Object.keys(attributes).find(name => attributes[name].plugin === 'admin'
                                           && attributes[name].model === 'administrator')
}
