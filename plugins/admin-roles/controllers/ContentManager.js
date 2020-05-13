/*
 * Custom controllers to filter which entries are visible and writable
 * by a non-root admin
 */

module.exports = {
  async count(ctx) {
    const { model } = ctx.params
    const adminAttr = adminAttribute(model)
    if (adminAttr) ctx.request.querystring += `&${adminAttr}.username=${ctx.state.admin.username}`
    await strapi.plugins['content-manager'].controllers.contentmanager.count(ctx)
  },

  async find(ctx) {
    const { model } = ctx.params
    const adminAttr = adminAttribute(model)
    if (adminAttr) ctx.request.querystring += `&${adminAttr}.username=${ctx.state.admin.username}`
    await strapi.plugins['content-manager'].controllers.contentmanager.find(ctx)
  },

  async findone(ctx) {
    const { model, id } = ctx.params
    if (!isAssigned(model, id, ctx.state.admin)) return ctx.notFound('Entry not found')
    await strapi.plugins['content-manager'].controllers.contentmanager.findOne(ctx)
  },

  async update(ctx) {
    const { model, id } = ctx.params
    if (!isAssigned(model, id, ctx.state.admin)) return ctx.notFound('Entry not found')
    await strapi.plugins['content-manager'].controllers.contentmanager.update(ctx)
  },

  async create(ctx) {
    const { model } = ctx.params
    const adminAttr = adminAttribute(model)
    if (adminAttr)
      return ctx.badRequest(null, [
        {
          messages: [{ id: 'Forbidden', message: 'Forbidden' }],
          errors: [],
        }
      ])
    await strapi.plugins['content-manager'].controllers.contentmanager.create(ctx)
  },

  async delete(ctx) {
    const { model } = ctx.params
    const adminAttr = adminAttribute(model)
    if (adminAttr) return ctx.throw(403, 'Forbidden')
    await strapi.plugins['content-manager'].controllers.contentmanager.delete(ctx)
  },

  async deletemany(ctx) {
    const { model } = ctx.params
    const adminAttr = adminAttribute(model)
    if (adminAttr) return ctx.throw(403, 'Forbidden')
    await strapi.plugins['content-manager'].controllers.contentmanager.deleteMany(ctx)
  }
}

function adminAttribute(model) {
  const attributes = strapi.db.getModel(model).attributes
  return Object.keys(attributes).find(name => attributes[name].plugin === 'admin'
                                           && attributes[name].model === 'administrator')
}

async function isAssigned(model, id, admin) {
  const adminAttr = adminAttribute(model)
  if (!adminAttr) return false
  const params = { id: id, [adminAttr+'.username']: admin.username }
  return !!(await strapi.db.query(model).count(params))
}
