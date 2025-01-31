type RouteType = {
  home: string;
  signup: string;
  login:string;
};

const routes: RouteType = {
  home: "/",
  signup: "/auth/signup",
  login: "/auth/login",
};

export default routes;
