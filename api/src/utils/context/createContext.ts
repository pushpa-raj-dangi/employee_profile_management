import { Request ,Response} from "express";
import { CustomContext } from "../../types";


export const createContext = ({ req, res }:{
  req: Request;
  res: Response;
}): CustomContext => {


  return { req, res };
};
