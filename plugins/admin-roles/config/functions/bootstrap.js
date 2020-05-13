/*
 * We need to hook into the admin's create and update
 * controllers to take the added role attribute into
 * account. In the original controllers the admin
 * attributes are hard-coded. But we can reuse them
 * here.
 */
module.exports = () => {
  const admin = Object.assign({}, strapi.admin.controllers.admin)
  Object.assign(strapi.admin.controllers.admin, {
    async create(ctx) {
      await admin.create(ctx)

      if (ctx.status !== 201) return

      const { id } = ctx.response.body
      const { role } = ctx.request.body
      await strapi.query('administrator', 'admin').update({ id }, { role })
    },

    async update(ctx) {
      await admin.update(ctx)

      if (ctx.status !== 200) return

      const { id } = ctx.params
      const { role } = ctx.request.body
      await strapi.query('administrator', 'admin').update({ id }, { role })
    }
  })
}
