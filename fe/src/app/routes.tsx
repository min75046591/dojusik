type RouteType = {
  home: string;
  signup: string;
  login:string;
};

const routes: RouteType = {
  home: "/",
  signup: "/authentication/signup",
  login: "/authentication/login",
};

export default routes;
