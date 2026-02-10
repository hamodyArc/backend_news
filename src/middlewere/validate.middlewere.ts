import { Request, Response, NextFunction} from "express";
import { z } from "zod";

export const validate = 
(schema: z.ZodTypeAny) => async (req :Request, res: Response, next: NextFunction) => {
    void res;
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            param: req.params,
        })
        next();
    } catch (error) {
        next(error);
    }
}