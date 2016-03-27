/// <reference path="./vue-router.d.ts" />

Vue.use(VueRouter);

namespace TestBasic {
    "use strict";

    var Foo = Vue.extend({
        template: "<p>This is foo!</p>",
        route: {
            canActivate(transition: vuejs.Transition<any, any, any, any, any>) {
                return true;
            },
            activate: function() {
                var p: PromiseLike<any>;
                return p;
            },
            deactivate: function(transition: vuejs.Transition<any, any, any, any, any>) {
                transition.next();
            }
        }
    });

    var Bar = Vue.extend({
        template: "<p>This is bar!</p>"
    });

    var App = Vue.extend({});
    var app = new App();
    app.$on("some event", function() {
        var name: string = app.$route.name;
    });

    var router = new VueRouter<typeof App.prototype>();

    router.map({
        "/foo": {
            component: Foo
        },
        "/bar": {
            component: Bar
        }
    });

    router.start(App, "#app");
}

namespace TestAdvanced {
    "use strict";

    namespace App {

        export class App extends Vue {
            authenticating: boolean;

            data() {
                return {
                    authenticating: false
                };
            }
        }
    }

    namespace Inbox {
        export class Index extends Vue {
        }
    }

    namespace RouteConfig {
        export function configRouter(router: vuejs.Router<App.App>) {
            router.map({
                "/about": {
                    component: {},
                    auth: false
                },
                "*": {
                    component: {}
                }
            });

            router.redirect({
                "/info": "/about",
                "/hello/:userId": "/user/:userId"
            });

            router.beforeEach((transition) => {
                if (transition.to.path === "/forbidden") {
                    router.app.authenticating = true;
                    setTimeout(() => {
                        router.app.authenticating = false;
                        alert("");
                        transition.abort();
                    }, 3000);
                } else {
                    transition.next();
                }
            });
        }
    }

    import configRouter = RouteConfig.configRouter;

    const router = new VueRouter<App.App>({
        history: true,
        saveScrollPosition: true
    });

    configRouter(router);
    router.start(App, "#app");
}
