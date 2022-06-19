from wagtail.models import Page

from fabrique.wagtail.core.models import with_serve_from_next_support


def with_navigation_support(page_class):
    def top_menu(self):
        from bakerydemo.base.templatetags.navigation_tags import has_menu_children
        site = self.get_site()
        parent = site.root_page
        menuitems = parent.get_children().live().in_menu()
        for menuitem in menuitems:
            menuitem.show_dropdown = has_menu_children(menuitem)
            # We don't directly check if calling_page is None since the template
            # engine can pass an empty string to calling_page
            # if the variable passed as calling_page does not exist.
            menuitem.active = self.url_path.startswith(menuitem.url_path)
        return {
            'menuitems': [{
                'className': menuitem.title.lower().replace(' ', ''),
                'active': menuitem.active,
                'show_dropdown': menuitem.show_dropdown,
                'children': self.top_menu_children(menuitem) if menuitem.show_dropdown else [],
                'title': menuitem.title,
                'url': menuitem.relative_url(site),
            } for menuitem in menuitems]
        }

    def top_menu_children(self, parent):
        from bakerydemo.base.templatetags.navigation_tags import has_menu_children
        site = self.get_site()
        menuitems_children = parent.get_children()
        menuitems_children = menuitems_children.live().in_menu()
        for menuitem in menuitems_children:
            menuitem.has_dropdown = has_menu_children(menuitem)
            # We don't directly check if calling_page is None since the template
            # engine can pass an empty string to calling_page
            # if the variable passed as calling_page does not exist.
            menuitem.active = self.url_path.startswith(menuitem.url_path)
            menuitem.children = menuitem.get_children().live().in_menu()
        return {
            'menuitems': [{
                'title': menuitem.title,
                'url': menuitem.relative_url(site),
            } for menuitem in menuitems_children]
        }

    setattr(page_class, 'top_menu', top_menu)
    setattr(page_class, 'top_menu_children', top_menu_children)
    page_class.api_fields = [
        *getattr(page_class, 'api_fields', []),
        'top_menu',
    ]
    return page_class


def with_breadcrumbs_support(page_class):
    def breadcrumbs(self):
        site = self.get_site()
        if self.depth <= 2:
            # When on the home page, displaying breadcrumbs is irrelevant.
            ancestors = ()
        else:
            ancestors = Page.objects.ancestor_of(
                self, inclusive=True).filter(depth__gt=1)
        if ancestors:
            return {
                'ancestors': [{
                    'title': ancestor.title,
                    'url': ancestor.relative_url(site)
                } for ancestor in ancestors],
            }

    setattr(page_class, 'breadcrumbs', breadcrumbs)
    page_class.api_fields = [
        *getattr(page_class, 'api_fields', []),
        'breadcrumbs',
    ]
    return page_class


def apply_plugins(page_class):
    for support in [
        with_breadcrumbs_support,
        with_navigation_support,
        with_serve_from_next_support,
    ][::-1]:
        page_class = support(page_class)
    return page_class