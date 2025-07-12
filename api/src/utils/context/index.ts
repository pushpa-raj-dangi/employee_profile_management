import { CustomContext } from "../../types";


export const createContext = ({ req, res }:{
  req: any;
  res: any;
}): CustomContext => {
  console.log("Creating context with request:", req.method, req.url);

  return { req, res };
};
