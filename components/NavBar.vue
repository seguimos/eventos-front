<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      color="primary"
      disable-resize-watcher
    >
      <v-list class="secondary--text" dark>
        <div v-if="$auth.user">
          <v-list-group
            no-action
            sub-group
            class="secondary--text d-sm-flex d-md-none"
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $auth.user.email }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(item, index) in menuEmail"
              :key="index"
              :to="item.route"
            >
              <v-list-item-title>{{ item.menu }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-for="(menu, index) in $auth.user.menus"
            :key="`menu-${index}`"
            :value="true"
            no-action
            sub-group
            class="secondary--text"
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ menu.menu }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(submenu, i) in menu.submenus"
              :key="`submenu-${i}`"
              link
              :to="submenu.route"
            >
              <v-list-item-title>
                {{ submenu.submenu }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          link
          :to="link.route"
        >
          <v-list-item-title>
            {{ link.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      color="primary"
      class="secondary--text"
    >
      <v-app-bar-nav-icon
        class="d-sm-flex d-md-none"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title v-text="title" />
      <v-toolbar-items
        v-if="$auth.user"
        class="d-none d-md-flex"
      >
        <v-menu
          v-for="(menu, index) in $auth.user.menus"
          :key="`menu-${index}`"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              class="secondary--text"
              dark
              v-bind="attrs"
              text
              v-on="on"
            >
              <v-icon left>
                {{ attrs['aria-expanded'] === 'true'? 'mdi-chevron-down': 'mdi-chevron-right' }}
              </v-icon>
              {{ menu.menu }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(submenu, indexSubmenu) in menu.submenus"
              :key="`submenu-${indexSubmenu}`"
              :to="submenu.route"
            >
              <v-list-item-title>{{ submenu.submenu }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-toolbar-items
        class="d-none d-md-flex"
      >
        <v-btn
          v-for="(link, index) in links"
          :key="index"
          link
          :to="link.route"
          text
          color="primary"
          class="secondary--text"
        >
          {{ link.name }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items v-if="!$auth.loggedIn">
        <v-btn
          to="/login"
          text
          class="secondary--text"
        >
          Iniciar Sesión
        </v-btn>
        <v-btn
          to="/register"
          text
          class="secondary--text"
        >
          Registrarse
        </v-btn>
      </v-toolbar-items>
      <v-menu v-else offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            text
            class="secondary--text d-none d-md-flex"
            v-bind="attrs"
            v-on="on"
          >
            {{ $auth.user.email }}
            <v-icon right>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuEmail"
            :key="index"
            :to="item.route"
          >
            <v-list-item-title>{{ item.menu }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      drawer: false,
      title: 'Boric Presidente',
      menuEmail: [
        { menu: 'Configuración', route: '/settings' },
        { menu: 'Cerrar Sesión', route: '/logout' }
      ],
      links: [
        { route: '/', name: 'Eventos' },
        { route: '/comandos', name: 'Comandos' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
